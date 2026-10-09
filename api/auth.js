import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { SendMailClient } from "zeptomail";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseKey || "placeholder"
);

function getMailClient() {
  const token = process.env.ZEPTO_TOKEN || process.env.ZEPTOMAIL_TOKEN || process.env.VITE_ZEPTO_TOKEN;
  return new SendMailClient({
    url: "https://api.zeptomail.in/v1.1/email/template",
    token,
  });
}

async function sendPickIdWelcomeEmail(email, name, pickID) {
  const mailClient = getMailClient();
  await mailClient.sendMailWithTemplate({
    template_key: "2518b.5f1360f6e8e70412.k1.14d4fa60-0dc0-11f1-8966-62df313bf14d.19c77247d06",
    from: { address: process.env.FROM_EMAIL || "noreply@pickopick.com", name: "PickoPick" },
    to: [{ email_address: { address: email, name } }],
    cc: [{ email_address: { address: "sales@pickopick.com", name: "Pick O Pick Sales" } }],
    merge_info: { pickID },
  });
}

function parseBody(req) {
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body || {};
}

export default async function handler(req, res) {
  const action = req.query.action || getActionFromUrl(req.url);

  switch (action) {
    case "register":
      return handleRegister(req, res);
    case "google":
      return handleGoogle(req, res);
    case "google-phone":
      return handleGooglePhone(req, res);
    case "check-user-email":
    case "check-email":
      return handleCheckEmail(req, res);
    default:
      return res.status(400).json({ error: "Unknown auth action: " + (action || "none") });
  }
}

function getActionFromUrl(url = "") {
  const p = url.split("?")[0];
  if (p.includes("register")) return "register";
  if (p.includes("google-phone")) return "google-phone";
  if (p.includes("google")) return "google";
  if (p.includes("check-user-email") || p.includes("check-email")) return "check-user-email";
  return "";
}

async function handleCheckEmail(req, res) {
  try {
    const body = parseBody(req);
    let email = body.email || req.query.email;
    if (!email) return res.status(400).json({ error: "Email required" });
    email = email.trim().toLowerCase();

    const { data, error } = await supabase
      .from("customerList")
      .select("customerID")
      .eq("emailID", email)
      .maybeSingle();

    if (error) throw error;
    return res.json({ exists: !!data });
  } catch (err) {
    console.error("CHECK EMAIL ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

async function handleRegister(req, res) {
  try {
    const body = parseBody(req);
    const { name, email, password, phoneNumber } = body;
    const cleanEmail = (email || "").trim().toLowerCase();

    if (!cleanEmail || !password || !name || !phoneNumber) {
      return res.status(400).json({ error: "All fields required" });
    }

    const { data: otpData } = await supabase
      .from("otp_store")
      .select("*")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (!otpData || !otpData.verified) {
      return res.status(400).json({ error: "OTP not verified" });
    }

    const { data: existing } = await supabase
      .from("customerList")
      .select("customerID")
      .eq("emailID", cleanEmail)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from("customerList")
      .insert([{ firstName: name, emailID: cleanEmail, password: hashedPassword, phoneNumber: phoneNumber }])
      .select();

    if (error) return res.status(500).json({ error: error.message });

    const user = data[0];
    const pickID = user.pickID;

    try {
      await fetch("https://apps.cratiocrm.com/Customize/Webhooks/webhook.php?id=79915", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "Contact name": name,
          "Contact number ": phoneNumber,
          "email": cleanEmail,
          "City": "",
          "Address": "",
          "Country": "India",
          "Region": "",
          "Picopick id": pickID,
        }),
      });
    } catch (crmError) {
      console.error("CRATIO CRM ERROR:", crmError);
    }

    await supabase.from("otp_store").delete().eq("email", cleanEmail);

    const mailClient = getMailClient();
    await mailClient.sendMailWithTemplate({
      template_key: "2518b.5f1360f6e8e70412.k1.14d4fa60-0dc0-11f1-8966-62df313bf14d.19c77247d06",
      from: { address: process.env.FROM_EMAIL || "noreply@pickopick.com", name: "PickoPick" },
      to: [{ email_address: { address: cleanEmail, name: name } }],
      cc: [{ email_address: { address: "sales@pickopick.com", name: "Pick O Pick Sales" } }],
      merge_info: { pickID: pickID },
    });

    return res.json({ user });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// "Continue with Google" — the Firebase client has already authenticated the
// user; this only syncs their Google email with customerList:
//   existing email  -> return that row (same Pick ID / orders — nothing breaks)
//   new email       -> create the row (DB generates the Pick ID), fire the CRM
//                      webhook and the welcome + team emails, then return it
async function handleGoogle(req, res) {
  try {
    const body = parseBody(req);
    const email = (body.email || "").trim().toLowerCase();
    const name = (body.name || "").trim() || "Customer";
    const photoUrl = body.photoUrl || "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "A valid Google email is required." });
    }

    const { data: existing, error: findError } = await supabase
      .from("customerList")
      .select("*")
      .eq("emailID", email)
      .maybeSingle();

    if (findError) {
      console.error("GOOGLE FIND ERROR:", findError);
      return res.status(500).json({ error: "Could not verify your account. Please try again." });
    }

    if (existing) {
      return res.json({ user: existing, isNew: false });
    }

    // New customer — Google accounts never get a usable password, but a valid
    // bcrypt hash keeps password-login attempts failing cleanly.
    const unusablePassword = await bcrypt.hash(randomUUID(), 10);
    const { data, error: insertError } = await supabase
      .from("customerList")
      .insert([{ firstName: name, emailID: email, password: unusablePassword, phoneNumber: "" }])
      .select();

    if (insertError || !data || !data[0]) {
      console.error("GOOGLE INSERT ERROR:", insertError);
      return res.status(500).json({ error: "Could not create your account. Please try again." });
    }

    const user = data[0];
    const pickID = user.pickID;

    // Same CRM webhook the email registration uses.
    try {
      await fetch("https://apps.cratiocrm.com/Customize/Webhooks/webhook.php?id=79915", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "Contact name": name,
          "Contact number ": "",
          "email": email,
          "City": "",
          "Address": "",
          "Country": "India",
          "Region": "",
          "Picopick id": pickID,
        }),
      });
    } catch (crmError) {
      console.error("CRATIO CRM ERROR:", crmError);
    }

    // Welcome email with the Pick ID + internal team notification — same
    // templates as normal registration (no OTP involved).
    let welcomeEmailSent = false;
    try {
      await sendPickIdWelcomeEmail(email, name, pickID);
      welcomeEmailSent = true;
    } catch (mailError) {
      console.error("GOOGLE WELCOME EMAIL ERROR:", mailError?.message || mailError);
    }

    return res.json({ user, isNew: true, welcomeEmailSent, photoUrl });
  } catch (err) {
    console.error("GOOGLE AUTH ERROR:", err);
    return res.status(500).json({ error: "Google sign-in failed. Please try again." });
  }
}

// Second step of "Continue with Google": save the mobile number the user
// entered (accounts created via Google have no phone), update the CRM contact
// and return the completed profile.
async function handleGooglePhone(req, res) {
  try {
    const body = parseBody(req);
    const email = (body.email || "").trim().toLowerCase();
    const phoneNumber = (body.phoneNumber || "").trim();

    if (!email) return res.status(400).json({ error: "Email required" });
    if (phoneNumber.replace(/\D/g, "").length < 8) {
      return res.status(400).json({ error: "Please provide a valid mobile number." });
    }

    const { data, error } = await supabase
      .from("customerList")
      .update({ phoneNumber })
      .eq("emailID", email)
      .select();

    if (error || !data || !data[0]) {
      console.error("GOOGLE PHONE UPDATE ERROR:", error);
      return res.status(500).json({ error: "Could not save your mobile number. Please try again." });
    }

    const user = data[0];

    try {
      await fetch("https://apps.cratiocrm.com/Customize/Webhooks/webhook.php?id=79915", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "Contact name": user.firstName || "Customer",
          "Contact number ": phoneNumber,
          "email": email,
          "City": "",
          "Address": "",
          "Country": "India",
          "Region": "",
          "Picopick id": user.pickID,
        }),
      });
    } catch (crmError) {
      console.error("CRATIO CRM ERROR:", crmError);
    }

    return res.json({ user });
  } catch (err) {
    console.error("GOOGLE PHONE ERROR:", err);
    return res.status(500).json({ error: "Could not save your mobile number. Please try again." });
  }
}
