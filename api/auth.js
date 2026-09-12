import bcrypt from "bcryptjs";
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
    case "check-user-email":
    case "check-email":
      return handleCheckEmail(req, res);
    case "send-otp":
      return handleSendOtp(req, res);
    case "verify-otp":
      return handleVerifyOtp(req, res);
    case "forgot-password":
      return handleForgotPassword(req, res);
    case "reset-password":
      return handleResetPassword(req, res);
    default:
      return res.status(400).json({ error: "Unknown auth action: " + (action || "none") });
  }
}

function getActionFromUrl(url = "") {
  const p = url.split("?")[0];
  if (p.includes("register")) return "register";
  if (p.includes("check-user-email") || p.includes("check-email")) return "check-user-email";
  if (p.includes("send-otp")) return "send-otp";
  if (p.includes("verify-otp")) return "verify-otp";
  if (p.includes("forgot-password")) return "forgot-password";
  if (p.includes("reset-password")) return "reset-password";
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

async function handleSendOtp(req, res) {
  try {
    const body = parseBody(req);
    let { email, name } = body;
    if (!email) return res.status(400).json({ error: "Email required" });
    email = email.trim().toLowerCase();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await supabase.from("otp_store").upsert({
      email,
      otp,
      expiry: Date.now() + 5 * 60 * 1000,
      verified: false,
    });

    const client = getMailClient();
    await client.sendMailWithTemplate({
      template_key: "2518b.5f1360f6e8e70412.k1.510d86e0-2cc0-11f1-85bc-8e9a6c33ddc2.19d424f664e",
      from: {
        address: process.env.FROM_EMAIL || "noreply@pickopick.com",
        name: "PickoPick",
      },
      to: [{ email_address: { address: email, name: name || "User" } }],
      merge_info: { name: name || "User", OTP: otp },
    });

    return res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
}

async function handleVerifyOtp(req, res) {
  try {
    const body = parseBody(req);
    let { email, otp } = body;
    if (!email || !otp) return res.status(400).json({ error: "Email and OTP required" });
    email = email.trim().toLowerCase();
    otp = String(otp).trim();

    const { data } = await supabase
      .from("otp_store")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (!data) return res.status(400).json({ error: "OTP not generated" });
    if (data.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });
    if (data.expiry < Date.now()) return res.status(400).json({ error: "OTP expired" });

    await supabase.from("otp_store").update({ verified: true }).eq("email", email);
    return res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

async function handleForgotPassword(req, res) {
  try {
    if (req.method !== "POST") return res.status(200).json({ message: "Use POST request" });
    const body = parseBody(req);
    let { email, name } = body;
    if (!email) return res.status(400).json({ error: "Email required" });
    email = email.trim().toLowerCase();

    const { data: user } = await supabase
      .from("customerList")
      .select("customerID")
      .eq("emailID", email)
      .maybeSingle();

    if (!user) return res.status(400).json({ error: "Email not registered" });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await supabase.from("otp_store").upsert({
      email,
      otp,
      expiry: Date.now() + 10 * 60 * 1000,
      verified: false,
    });

    const mailClient = getMailClient();
    await mailClient.sendMailWithTemplate({
      template_key: "2518b.5f1360f6e8e70412.k1.510d86e0-2cc0-11f1-85bc-8e9a6c33ddc2.19d424f664e",
      from: {
        address: process.env.FROM_EMAIL || "noreply@pickopick.com",
        name: "PickoPick",
      },
      to: [{ email_address: { address: email, name: name || "User" } }],
      merge_info: { name: name || "User", OTP: otp },
    });

    return res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
}

async function handleResetPassword(req, res) {
  try {
    const body = parseBody(req);
    let { email, otp, newPassword } = body;
    email = email.trim().toLowerCase();

    const { data } = await supabase
      .from("otp_store")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (!data) return res.status(400).json({ error: "OTP not generated" });
    if (data.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });
    if (data.expiry < Date.now()) return res.status(400).json({ error: "OTP expired" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await supabase.from("customerList").update({ password: hashedPassword }).eq("emailID", email);
    await supabase.from("otp_store").delete().eq("email", email);

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
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
      merge_info: { pickID: pickID },
    });

    const mailClient1 = getMailClient();
    await mailClient1.sendMailWithTemplate({
      template_key: "2518b.5f1360f6e8e70412.k1.ef76b6b0-5026-11f1-8706-e256a66a52e4.19e2a502d9b",
      from: { address: process.env.FROM_EMAIL || "noreply@pickopick.com", name: "PickoPick" },
      to: [
        { email_address: { address: "dm2@pickopick.com", name: "Info" } },
        { email_address: { address: "dm1@pickopick.com", name: "Support" } },
      ],
      merge_info: { name: name, email: cleanEmail, phoneNumber: phoneNumber, pickID: pickID },
    });

    return res.json({ user });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
