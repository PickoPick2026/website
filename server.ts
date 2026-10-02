import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { GoogleGenAI } from "@google/genai";
import { SendMailClient } from "zeptomail";
import { supabase } from './supabase.js';
import { brandedEmailHtml } from './api/_request-utils.js';
import customerRequests from './api/requests.js';


const otpStore: Record<string, { otp: string; expiry: number }> = {};


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const db = new Database("database.db");


db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS shipping_rates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    destination TEXT NOT NULL,
    base_rate REAL NOT NULL,
    per_kg_rate REAL NOT NULL,
    days TEXT NOT NULL
  );

  INSERT OR IGNORE INTO shipping_rates (destination, base_rate, per_kg_rate, days) VALUES
  ('US', 25, 10, '3-5'),
  ('UK', 20, 8, '4-6'),
  ('CA', 22, 9, '3-5'),
  ('AU', 28, 12, '5-7'),
  ('AE', 15, 5, '2-4'),
  ('SG', 12, 4, '2-3');

  CREATE TABLE IF NOT EXISTS shipments (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    distance TEXT NOT NULL,
    arrival_date TEXT NOT NULL,
    status TEXT NOT NULL,
    progress INTEGER NOT NULL
  );

  INSERT OR IGNORE INTO shipments (id, type, origin, destination, distance, arrival_date, status, progress) VALUES
  ('AA-845', 'air', 'USA', 'COL', '3780 ml', 'Jun 5, 2024', 'Pending', 75),
  ('JL-748', 'sea', 'CHN', 'KOR', '620 ml', 'Jun 3, 2024', 'Pending', 60),
  ('MU-131', 'air', 'JPN', 'DEU', '5875 ml', 'Apr 25, 2024', 'Arrived', 100);
`);

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";
const geminiKey = process.env.GEMINI_API_KEY || "";
let ai: any = null;
try {
  if (geminiKey) {
    ai = new GoogleGenAI({ apiKey: geminiKey });
    console.log("✅ Gemini AI initialized");
  } else {
    console.warn("⚠️ GEMINI_API_KEY not set — AI features will use Supabase-only fallback");
  }
} catch (e) {
  console.error("❌ Failed to initialize Gemini:", e);
}

const mailUrl = "https://api.zeptomail.in/v1.1/email/template";
const mailToken = process.env.ZEPTO_TOKEN || process.env.ZEPTOMAIL_TOKEN || process.env.VITE_ZEPTO_TOKEN || "YOUR_TOKEN";

const mailClient = new SendMailClient({
  url: mailUrl,
  token: mailToken
});

const transactionalMailClient = new SendMailClient({
  url: "https://api.zeptomail.in/v1.1/email",
  token: mailToken
});

async function sendNriConsultationConfirmation(email: string, name: string, requestCode: string, subject = "Your Pick O Pick NRI consultation is booked", message = "Your free Pick O Pick NRI shipping consultation has been booked. Our concierge team will contact you at your selected time.", details: Array<[string, unknown]> = [], whatsappUrlValue = "") {
  if (!email || mailToken === "YOUR_TOKEN") return false;
  try {
    await transactionalMailClient.sendMail({
      from: { address: "noreply@pickopick.com", name: "Pick O Pick" },
      to: [{ email_address: { address: email, name } }],
      cc: [{ email_address: { address:  "sales@pickopick.com", name: "Pick O Pick Team" } }],
      subject,
      htmlbody: brandedEmailHtml({ name, code: requestCode, message, details, whatsappUrlValue }),
    });
    return true;
  } catch (error) {
    console.error("NRI consultation email error:", error);
    return false;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3006;

 
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API Routes
  app.post('/api/requests', (req, res) => customerRequests(req, res));
  app.get("/api/shipments", (req, res) => {
    const shipments = db.prepare("SELECT * FROM shipments").all();
    res.json(shipments);
  });

 app.get("/api/shipments/:id", async (req, res) => {
  const trackingNo = req.params.id;

  try {
    const response = await fetch(
      `https://admin.pickopick.com/api/tracking_api/get_tracking_data?api_company_id=20&customer_code=superadmin&tracking_no=${trackingNo}`
    );

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("External API returned non-JSON:", text.slice(0, 200));
      return res.status(502).json({ error: "External API returned invalid response" });
    }

    console.log("API RESPONSE:", JSON.stringify(data, null, 2));

    if (!data || data.length === 0 || data[0].errors === true) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    const raw = data[0];
    const info = Object.fromEntries(raw.docket_info);

    const shipment = {
      id: raw.tracking_no,
      status: info["Status"],
      from: info["Origin"],
      to: info["Destination"],
      arrivalDate: info["Delivery Date and Time"] || "Not Delivered",
      consigneeName: info["Consignee Name"] || "",
      shipperName: info["Shipper Name"] || "",
      shipperCity: info["Shipper City"] || "",
      consigneeCity: info["Consignee City"] || "",
      bookingDate: info["Booking Date"] || "",
      weight: raw.chargeable_weight || "",
      originHub: info["Origin Hub"] || "",
      progress: raw.docket_events.length > 1 ? 70 : 30,
      events: raw.docket_events
    };

    res.json(shipment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch tracking data" });
  }
});


app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, otpVerified, phoneNumber } = req.body;

  if (!otpVerified) {
    return res.status(400).json({ error: "OTP not verified" });
  }

  try {
    const cleanEmail = email.trim().toLowerCase();

    // ✅ CHECK EMAIL IN SUPABASE
    const { data: existingUser, error: checkError } = await supabase
      .from("customerList")
      .select("id")
      .eq("emailID", cleanEmail)
      .maybeSingle();

    if (checkError) {
      console.error("CHECK ERROR:", checkError);
    }

    if (existingUser) {
      return res.status(400).json({
        error: "Email already registered"
      });
    }

    // ✅ HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ INSERT INTO SUPABASE
    const { data, error } = await supabase
      .from("customerList")
      .insert([
        {
          firstName: name,
          emailID: cleanEmail,
          password: hashedPassword,
          phoneNumber: phoneNumber,
        }
      ])
      .select();

    if (error) {
      console.error("INSERT ERROR:", error);
      return res.status(500).json({ error: error.message });
    }

    const user = data[0];

    // ✅ DELETE OTP
    delete otpStore[cleanEmail];

    // ✅ RESPONSE
    res.json({
      user
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({
      error: "Internal server error"
    });
  }
});

app.post("/api/auth/google", async (req, res) => {
  // "Continue with Google" — Firebase client already authenticated the user;
  // sync the Google email with customerList (find existing / create + welcome).
  try {
    const { email: rawEmail, name: rawName } = req.body || {};
    const email = (rawEmail || "").trim().toLowerCase();
    const name = (rawName || "").trim() || "Customer";

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
    const pickID = (user as any).pickID;

    // Welcome email with the Pick ID + internal notification (same templates
    // as normal registration). Mail failure must not block sign-in.
    try {
      await mailClient.sendMailWithTemplate({
        template_key: "2518b.5f1360f6e8e70412.k1.14d4fa60-0dc0-11f1-8966-62df313bf14d.19c77247d06",
        from: { address: process.env.FROM_EMAIL || "noreply@pickopick.com", name: "PickoPick" },
        to: [{ email_address: { address: email, name } }],
        merge_info: { pickID: pickID },
      });
      await mailClient.sendMailWithTemplate({
        template_key: "2518b.5f1360f6e8e70412.k1.ef76b6b0-5026-11f1-8706-e256a66a52e4.19e2a502d9b",
        from: { address: process.env.FROM_EMAIL || "noreply@pickopick.com", name: "PickoPick" },
        to: [
          { email_address: { address: "dm2@pickopick.com", name: "Info" } },
          { email_address: { address: "dm1@pickopick.com", name: "Support" } },
        ],
        merge_info: { name: name, email: email, phoneNumber: "", pickID: pickID },
      });
    } catch (mailError: any) {
      console.error("GOOGLE WELCOME EMAIL ERROR:", mailError?.message || mailError);
    }

    return res.json({ user, isNew: true });
  } catch (err) {
    console.error("GOOGLE AUTH ERROR:", err);
    return res.status(500).json({ error: "Google sign-in failed. Please try again." });
  }
});

app.post("/api/auth/google-phone", async (req, res) => {
  // Second step of "Continue with Google": save the mobile number.
  try {
    const { email: rawEmail, phoneNumber: rawPhone } = req.body || {};
    const email = (rawEmail || "").trim().toLowerCase();
    const phoneNumber = (rawPhone || "").trim();

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

    return res.json({ user: data[0] });
  } catch (err) {
    console.error("GOOGLE PHONE ERROR:", err);
    return res.status(500).json({ error: "Could not save your mobile number. Please try again." });
  }
});

app.post("/api/change-password", async (req, res) => {
  try {
    let { email, currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({ error: "All fields required" });
    }

    email = email.trim().toLowerCase();

    const { data: user, error } = await supabase
      .from("customerList")
      .select("*")
      .eq("emailID", email)
      .maybeSingle();

    if (error || !user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Current password incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const { error: updateError } = await supabase
      .from("customerList")
      .update({ password: hashedPassword })
      .eq("emailID", email);

    if (updateError) {
      console.error(updateError);
      return res.status(500).json({ error: "Failed to update password" });
    }

    return res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
});
// app.post("/api/verify-otp", (req, res) => {
//   let { email, otp } = req.body;

//   email = email.trim().toLowerCase();
//   otp = String(otp).trim();

//   const record = otpStore[email];

//   if (!record) {
//     return res.status(400).json({ error: "OTP not generated" });
//   }

//   if (record.otp !== otp) {
//     return res.status(400).json({ error: "Invalid OTP" });
//   }

//   if (record.expiry < Date.now()) {
//     return res.status(400).json({ error: "OTP expired" });
//   }

//   // success → delete OTP
//   delete otpStore[email];

//   res.json({ message: "OTP verified" });
// });
type OtpRecord = {
  otp: string;
  expiry: number;
  verified?: boolean;
  nextAllowedTime?: number;
};

const otpStore: Record<string, OtpRecord> = {};;


app.post("/api/verify-otp", (req, res) => {
  let { email, otp } = req.body;

  email = email.trim().toLowerCase();
  otp = String(otp).trim();

  const record = otpStore[email];

  if (!record) {
    return res.status(400).json({ error: "OTP not generated" });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  if (record.expiry < Date.now()) {
    return res.status(400).json({ error: "OTP expired" });
  }

  // ✅ mark as verified instead of deleting
  otpStore[email].verified = true;

  res.json({ message: "OTP verified" });
});
 app.post("/api/send-email", async (req, res) => {
  try {
    const { email, name } = req.body;

    console.log("📩 Incoming email request:", req.body);

    const response = await mailClient.sendMailWithTemplate({
      template_key: "2518b.5f1360f6e8e70412.k1.14d4fa60-0dc0-11f1-8966-62df313bf14d.19c77247d06",
      from: {
        address: "noreply@pickopick.com",
        name: "PickoPick"
      },
      to: [
        {
          email_address: {
            address: email,
            name: name
          }
        }
      ],
      merge_info: {}
    });

    console.log("✅ EMAIL SUCCESS:", response);

    res.json({ success: true });

  } catch (error: any) {
    console.error("🔥 FULL EMAIL ERROR:", error);

    res.status(500).json({
      error: error?.error?.message || error?.message || "Email failed"
    });
  }
});

app.post("/api/check-user-email", async (req, res) => {
  let { email } = req.body;

  email = email.trim().toLowerCase();

  const { data, error } = await supabase
    .from("customerList")
    .select("customerID")
    .eq("emailID", email)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: "Server error" });
  }

  res.json({ exists: !!data });
});
app.post("/api/forgot-password", async (req, res) => {
  try {
    let { email, name } = req.body;

    email = email.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    // ✅ CHECK USER EXISTS
    const { data: user } = await supabase
      .from("customerList")
      .select("customerID")
      .eq("emailID", email)
      .maybeSingle();

    if (!user) {
      return res.status(400).json({
        error: "Email not registered"
      });
    }

    // ✅ GENERATE OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = {
      otp,
      expiry: Date.now() + 10 * 60 * 1000,
      nextAllowedTime: Date.now() + 60 * 1000
    };

    console.log("FORGOT OTP:", otp);

    // ✅ SEND EMAIL
    await mailClient.sendMailWithTemplate({
      template_key: "2518b.5f1360f6e8e70412.k1.510d86e0-2cc0-11f1-85bc-8e9a6c33ddc2.19d424f664e",
      from: {
        address: "noreply@pickopick.com",
        name: "PickoPick"
      },
      to: [
        {
          email_address: {
            address: email,
            name: name || "User"
          }
        }
      ],
      merge_info: {
        name: name || "User",
        OTP: otp
      }
    });

    res.json({ message: "OTP sent successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

app.post("/api/reset-password", async (req, res) => {
  let { email, otp, newPassword } = req.body;

  email = email.trim().toLowerCase();
  otp = String(otp).trim();

  const record = otpStore[email];

  if (!record) {
    return res.status(400).json({ error: "OTP not generated" });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  if (record.expiry < Date.now()) {
    return res.status(400).json({ error: "OTP expired" });
  }

  // 🔐 update password in DB
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await supabase
    .from("customerList")
    .update({ password: hashedPassword })
    .eq("emailID", email);

  // remove OTP after use
  delete otpStore[email];

  res.json({ message: "Password updated" });
});

// app.post("/api/send-otp", (req, res) => {
//   let { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ error: "Email required" });
//   }

//   email = email.trim().toLowerCase();

//   const otp = Math.floor(100000 + Math.random() * 900000).toString();

//   // store in memory
//   otpStore[email] = {
//     otp,
//     expiry: Date.now() + 5 * 60 * 1000, // 5 mins
//   };

//   console.log("OTP:", otp); // 🔥 check in terminal

//   res.json({ message: "OTP sent" });
// });

app.post("/api/check-email", (req, res) => {
  const { email } = req.body;

  const user = db
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(email.trim().toLowerCase());

  res.json({ exists: !!user });
});

app.post("/api/send-otp", async (req, res) => {
  try {
    let { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    email = email.trim().toLowerCase();

   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

   
    const existingUser = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email);

    if (existingUser) {
      return res.status(400).json({
        error: "Email already registered"
      });
    }

   
   const existingOtp = otpStore[email];

    if (
      existingOtp &&
      existingOtp.nextAllowedTime &&
      Date.now() < existingOtp.nextAllowedTime
    ) {
      const waitTime = Math.ceil(
        (existingOtp.nextAllowedTime - Date.now()) / 1000
      );

      return res.status(429).json({
        error: `Wait ${waitTime}s before requesting again`,
      });
    }

   
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    
    otpStore[email] = {
      otp,
      expiry: Date.now() + 5 * 60 * 1000, // 5 min
      nextAllowedTime: Date.now() + 60 * 1000 // 60 sec cooldown
    };

    console.log("OTP:", otp);

   
    await mailClient.sendMailWithTemplate({
      template_key: "2518b.5f1360f6e8e70412.k1.510d86e0-2cc0-11f1-85bc-8e9a6c33ddc2.19d424f664e",
      from: {
        address: "noreply@pickopick.com",
        name: "noreply"
      },
      to: [
        {
          email_address: {
            address: email,
            name: name || "User"
          }
        }
      ],
      merge_info: {
        name: name || "User",
        OTP: otp
      }
    });

    
    res.json({
      message: "OTP sent successfully"
    });

  } catch (err: any) {
    console.error("ERROR:", err);

    res.status(500).json({
      error: "Failed to send OTP"
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const cleanEmail = email.trim().toLowerCase();

    // ✅ GET USER FROM SUPABASE
    const { data, error } = await supabase
      .from("customerList")
      .select("*")
      .eq("emailID", cleanEmail)
      .maybeSingle();

    if (error) {
      console.error("FETCH ERROR:", error);
      return res.status(500).json({ error: "Server error" });
    }

    const user = data;

    // ❌ USER NOT FOUND
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // ❌ PASSWORD WRONG
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // ✅ CREATE TOKEN
    const token = jwt.sign(
      { id: user.id, email: user.emailID },
      JWT_SECRET
    );

    // ✅ RESPONSE
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.emailID
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

  app.post("/api/shipping/calculate", (req, res) => {
    const { destination, weight } = req.body;
    const rate = db.prepare("SELECT * FROM shipping_rates WHERE destination = ?").get(destination) as any;
    if (!rate) {
      return res.status(404).json({ error: "Destination not supported" });
    }
    const cost = rate.base_rate + (parseFloat(weight) * rate.per_kg_rate);
    res.json({ cost, days: rate.days });
  });

  app.post("/api/service-requests", async (req, res) => {
    const serviceConfig: Record<string, { prefix: string; subject: string; message: string }> = {
      buy_and_ship: {
        prefix: "BUY",
        subject: "Your Pick O Pick Buy & Ship Request Has Been Received",
        message: "We received your Buy & Ship request. Our personal shopper will verify the item, store availability, and delivery options before sharing a quote.",
      },
      order_and_send: {
        prefix: "SEND",
        subject: "Your Pick O Pick Order & Send Request Has Been Received",
        message: "We received your Order & Send request. Our logistics team will review the pickup and destination details and contact you with the next steps.",
      },
      exclusive_sourcing: {
        prefix: "EXCL",
        subject: "Your Pick O Pick Exclusive Sourcing Request Has Been Received",
        message: "We received your exclusive sourcing request. Our India-side team will check availability for the requested regional items and contact you with a quote.",
      },
      contact: {
        prefix: "CONT",
        subject: "Your Pick O Pick Contact Request Has Been Received",
        message: "We received your message. A Pick O Pick team member will get back to you shortly.",
      },
      assisted_buy: {
        prefix: "ABUY",
        subject: "Your Pick O Pick Assisted Buy Request Has Been Received",
        message: "We received your assisted buying request. Our personal shopper will verify the product and send the next steps shortly.",
      },
    };

    try {
      const { serviceType, payload } = req.body || {};
      const config = serviceConfig[String(serviceType || "")];
      const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
      if (!config || !payload || typeof payload !== "object") {
        return res.status(400).json({ error: "A valid service request is required." });
      }

      const dataPayload = payload as Record<string, unknown>;
      const customerName = text(dataPayload.customerName || dataPayload.fullName || dataPayload.name);
      const phone = text(dataPayload.phone || dataPayload.whatsappNumber || dataPayload.mobileNumber);
      const email = text(dataPayload.email || dataPayload.customerEmail);
      const location = text(dataPayload.location || dataPayload.destinationLocation || dataPayload.destinationCountry || dataPayload.country);
      if (!customerName || !phone || !email || !location) {
        return res.status(400).json({ error: "Please provide your name, phone number, email, and location." });
      }

      const requestCode = `POP-${config.prefix}-${Date.now().toString().slice(-8)}-${Math.floor(100 + Math.random() * 900)}`;
      const record = {
        request_code: requestCode,
        service_type: String(serviceType),
        status: "NEW",
        customer_name: customerName,
        phone,
        email,
        location,
        payload: dataPayload,
      };
      const { data, error } = await supabase.from("service_requests").insert(record).select("request_code, created_at").single();
      if (error) {
        console.error("Service request insert error:", error);
        return res.status(500).json({ error: "We could not save your request. Please try again shortly." });
      }

      const requestWhatsAppUrl = `https://wa.me/919790361222?text=${encodeURIComponent(`Hello Pick O Pick, my ${String(serviceType).replace(/_/g, " ")} reference is ${data.request_code}.`)}`;
      const details: Array<[string, unknown]> = [
        ["Service", String(serviceType).replace(/_/g, " ")],
        ["Customer", customerName],
        ["Phone", phone],
        ["Email", email],
        ["Location", location],
      ];
      Object.entries(dataPayload).forEach(([key, value]) => {
        if (!["customerName", "fullName", "name", "phone", "whatsappNumber", "mobileNumber", "email", "customerEmail", "location", "destinationLocation", "destinationCountry", "country"].includes(key) && value !== null && value !== undefined && text(String(value))) {
          details.push([key.replace(/([A-Z])/g, " $1"), String(value)]);
        }
      });
      const emailSent = await sendNriConsultationConfirmation(email, customerName, data.request_code, config.subject, config.message, details.slice(0, 17), requestWhatsAppUrl);
      return res.status(201).json({ success: true, requestId: data.request_code, createdAt: data.created_at, emailSent, whatsappUrl: requestWhatsAppUrl });
    } catch (error) {
      console.error("Service request API error:", error);
      return res.status(500).json({ error: "Unable to submit your request right now." });
    }
  });

  // Separate public endpoints, while retaining shared validation/persistence locally.
  // The complete form is retained in JSONB so staff can review every submitted detail.
  app.post(["/api/nri-requests", "/api/estimate-request"], async (req, res) => {
    try {
      const { requestType, payload } = req.body || {};
      const estimateEndpoint = req.path === "/api/estimate-request";
      const allowedTypes = estimateEndpoint
        ? ["estimate_request"]
        : ["consultation", "slot_reservation", "pickup_request"];
      if (!allowedTypes.includes(requestType) || !payload || typeof payload !== "object") {
        return res.status(400).json({ error: "A valid NRI request type and form data are required." });
      }

      const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
      const consultation = requestType === "consultation";
      const slotReservation = requestType === "slot_reservation";
      const estimateRequest = requestType === "estimate_request";
      const name = text(consultation ? payload.fullName : ((slotReservation || estimateRequest) ? payload.customerName : (payload.customerName || payload.pickupName)));
      const phone = text((consultation || slotReservation || estimateRequest) ? payload.whatsappNumber : (payload.customerWhatsapp || payload.pickupPhone));
      const country = text(consultation ? payload.currentCountry : payload.destinationCountry);

      if (!phone || (consultation && !name) || (!consultation && !country)) {
        return res.status(400).json({ error: "Please complete the required contact and request details." });
      }

      // Shipping estimate requests get their own table + admin queue (estimate_leads).
      // The request_code is the verification code the customer confirms with our team.
      if (estimateRequest) {
        if (!name) {
          return res.status(400).json({ error: "Please tell us your name so we can verify the request." });
        }
        const weightRaw = payload.approxWeightKg ?? payload.weightKg;
        const approxWeightKg = weightRaw !== undefined && weightRaw !== null && String(weightRaw).trim() !== "" && !Number.isNaN(Number(weightRaw))
          ? Number(weightRaw)
          : null;
        const estimateCode = `POP-EST-${Date.now().toString().slice(-8)}-${Math.floor(100 + Math.random() * 900)}`;
        const estimateRecord = {
          request_code: estimateCode,
          status: "NEW",
          customer_name: name,
          whatsapp_number: phone,
          email: text(payload.customerEmail || payload.email) || null,
          destination_country: country,
          package_type: text(payload.packageType) || null,
          approx_weight_kg: approxWeightKg,
          dimensions: text(payload.dimensions) || null,
          requirement_description: text(payload.requirementDescription) || null,
          payload,
        };

        const { data: estimateData, error: estimateError } = await supabase
          .from("estimate_leads")
          .insert(estimateRecord)
          .select("id, request_code, created_at")
          .single();

        if (estimateError) {
          console.error("Estimate lead insert error:", estimateError);
          return res.status(500).json({ error: "We could not save your request. Please try again shortly.", details: process.env.NODE_ENV === "production" ? undefined : estimateError.message });
        }

        const estimateMessage = encodeURIComponent(`Hello Pick O Pick! I requested a shipping estimate.\nVerification code: ${estimateData.request_code}\nDestination: ${country}`);
        const estimateWhatsAppUrl = `https://wa.me/919876543210?text=${estimateMessage}`;
        const emailSent = await sendNriConsultationConfirmation(
          estimateRecord.email || "",
          estimateRecord.customer_name,
          estimateData.request_code,
          "Your Pick O Pick Shipping Estimate Request Has Been Received",
          "We received your shipping estimate request and will contact you with a verified quotation.",
          [["Destination", country], ["Package", estimateRecord.package_type], ["Approx. weight", approxWeightKg ? `${approxWeightKg} kg` : ""], ["Dimensions", estimateRecord.dimensions], ["Requirement", estimateRecord.requirement_description]],
          estimateWhatsAppUrl,
        );
        return res.status(201).json({
          success: true,
          requestId: estimateData.request_code,
          createdAt: estimateData.created_at,
          emailSent,
          whatsappUrl: estimateWhatsAppUrl,
          noticeText: "Your estimate request has been received. Our team will verify your code and share your quotation.",
        });
      }

      const prefix = consultation ? "NRI-CON" : slotReservation ? "NRI-SLOT" : estimateRequest ? "NRI-EST" : "NRI-PICK";
      const requestCode = `${prefix}-${Date.now().toString().slice(-8)}-${Math.floor(100 + Math.random() * 900)}`;
      const record = {
        request_code: requestCode,
        request_type: requestType,
        status: "PENDING",
        customer_name: name || "NRI customer",
        whatsapp_number: phone,
        email: text(payload.email || payload.customerEmail) || null,
        country,
        preferred_date: text(consultation ? payload.preferredDate : (slotReservation ? payload.preferredDate : payload.preferredPickupDate)) || null,
        preferred_time: text(consultation ? payload.preferredTime : (slotReservation ? payload.preferredTimeSlot : payload.preferredPickupSlotLabel)) || null,
        payload,
      };

      const { data, error } = await supabase.from("nri_requests").insert(record).select("id, request_code, created_at").single();
      if (error) {
        console.error("NRI request insert error:", error);
        return res.status(500).json({ error: "We could not save your request. Please try again shortly.", details: process.env.NODE_ENV === "production" ? undefined : error.message });
      }

      const message = encodeURIComponent(`Hello Pick O Pick! I submitted an NRI ${requestType.replace(/_/g, " ")} request.\nReference: ${data.request_code}`);
      const requestWhatsAppUrl = `https://wa.me/919876543210?text=${message}`;
      const emailSent = await sendNriConsultationConfirmation(
        record.email || "",
        record.customer_name,
        data.request_code,
        consultation ? "Your Pick O Pick Consultation Booking Request Has Been Received" : slotReservation ? "Your Pick O Pick Slot Reservation Request Has Been Received" : "Your Pick O Pick Shipment Booking Request Has Been Received",
        consultation ? "Your free shipping consultation has been booked. Our concierge team will contact you at your selected time." : "We received your NRI service request. Our team will contact you on WhatsApp.",
        [["Request type", requestType.replace(/_/g, " ")], ["Country", country], ["Preferred date", record.preferred_date], ["Preferred time", record.preferred_time], ["WhatsApp", phone]],
        requestWhatsAppUrl,
      );
      return res.status(201).json({
        success: true,
        requestId: data.request_code,
        createdAt: data.created_at,
        emailSent,
        whatsappUrl: requestWhatsAppUrl,
        noticeText: slotReservation ? "Slot request received — our team will confirm availability shortly." : "Your request has been received. Our NRI team will contact you on WhatsApp.",
      });
    } catch (error) {
      console.error("NRI request API error:", error);
      return res.status(500).json({ error: "Unable to submit your request right now." });
    }
  });

  // 🔍 Helper: Search Supabase productTable for matching products
  async function searchSupabaseProducts(query: string) {
    if (!query || query === "Product") return [];
    try {
      const keywords = query.trim().split(/\s+/).filter(k => k.length >= 3);
      
      // Attempt 1: Full phrase match (highest relevance)
      let { data, error } = await supabase
        .from("productTable")
        .select(`
          productID,
          productName,
          price,
          stock,
          imageURL,
          category:categoryID (
            categoryName
          )
        `)
        .ilike("productName", `%${query.trim()}%`)
        .limit(5);

      if (error) throw error;
      
      let results = data || [];

      // Attempt 2: If no full match, try matching ANY significant keyword
      if (results.length === 0 && keywords.length > 0) {
        // We'll search for the longest keyword as it is likely the most specific
        const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);
        const searchKeyword = sortedKeywords[0];

        const { data: keywordData } = await supabase
          .from("productTable")
          .select(`
            productID,
            productName,
            price,
            stock,
            imageURL,
            category:categoryID (
              categoryName
            )
          `)
          .ilike("productName", `%${searchKeyword}%`)
          .limit(5);
        
        if (keywordData) results = keywordData;
      }

      // Format and deduplicate results
      return results.map((item: any) => {
        let imageUrl = "";
        try {
          const parsed = typeof item.imageURL === "string" ? JSON.parse(item.imageURL) : item.imageURL;
          if (Array.isArray(parsed)) imageUrl = parsed[0];
          else if (typeof parsed === "string") imageUrl = parsed;
        } catch { imageUrl = ""; }
        
        if (imageUrl.startsWith("blob:")) imageUrl = "";
        
        return {
          id: item.productID,
          name: item.productName,
          price: `₹${Number(item.price).toLocaleString("en-IN")}`,
          store: "PickoPick",
          source: "pickopick",
          image: imageUrl,
          category: item.category?.categoryName || "Other",
          inStock: Number(item.stock) > 0,
          url: "/products"
        };
      });
    } catch (error) {
      console.error("Supabase search error:", error);
      return [];
    }
  }

  // 🔍 Helper: Build real Amazon/Flipkart search URLs
  function buildStoreUrl(store: string, productName: string): string {
    const query = encodeURIComponent(productName);
    const storeLower = store.toLowerCase();
    if (storeLower.includes("amazon")) return `https://www.amazon.in/s?k=${query}`;
    if (storeLower.includes("flipkart")) return `https://www.flipkart.com/search?q=${query}`;
    if (storeLower.includes("myntra")) return `https://www.myntra.com/${query.replace(/%20/g, '-')}`;
    return `https://www.google.com/search?q=${query}+buy+online+india`;
  }

  // 🔍 Helper: Extract product name from link without AI (Fallback)
  function extractProductFromUrl(link: string): string {
    try {
      const url = new URL(link);
      const host = url.hostname.toLowerCase();
      
      // Manual Search Fallback
      if (host === 'manual-search.com') {
        return decodeURIComponent(url.pathname.substring(1));
      }
      
      if (host.includes('amazon')) {
        const pathParts = url.pathname.split('/');
        const namePart = pathParts.find(p => p.length > 5 && !p.includes('.') && p !== 'dp' && p !== 'gp' && p !== 'product-reviews');
        if (namePart) return decodeURIComponent(namePart.replace(/-/g, ' '));
      }
      
      if (host.includes('flipkart')) {
        const pathParts = url.pathname.split('/');
        if (pathParts[1]) return decodeURIComponent(pathParts[1].replace(/-/g, ' '));
      }

      if (host.includes('myntra')) {
        const pathParts = url.pathname.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        return decodeURIComponent(lastPart.replace(/-/g, ' ').replace(/\.html$/, '').replace(/\d+$/, ''));
      }

      const parts = url.pathname.split('/').filter(p => p.length > 3);
      if (parts.length > 0) return decodeURIComponent(parts.sort((a, b) => b.length - a.length)[0].replace(/[-_]/g, ' '));
    } catch (e) {}
    return "Product";
  }

  app.post("/api/analyze-image", async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) return res.status(400).json({ error: "No image provided" });

      let identified: any = { productName: "Product", category: "General", estimatedPriceINR: "Check Store" };
      let geminiWorking = !!ai;

      // Try AI silently, if it fails, we just don't populate 'identified'
      if (ai) {
        try {
          const identifyResponse = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [{
              parts: [
                { text: "Identify this product specifically including brand and model. Return JSON: { productName, category, estimatedPriceINR }" },
                { inlineData: { mimeType: "image/jpeg", data: image.split(",")[1] } }
              ]
            }],
            config: { responseMimeType: "application/json" }
          });
          identified = JSON.parse(identifyResponse.text || "{}");
        } catch (e) {
          console.warn("AI ID failed, continuing to manual fallback silently");
          geminiWorking = false;
        }
      }

      const productName = identified.productName || "Product";
      
      // Always return a valid response, even if AI failed
      const localProducts = await searchSupabaseProducts(productName);
      const stores = ["Amazon India", "Flipkart", "Google Shopping"];
      const universalResults = stores.map((store, i) => ({
        id: `universal-${i}`,
        name: productName,
        price: identified.estimatedPriceINR || "Check Price",
        store: store,
        source: store.toLowerCase().split(' ')[0],
        image: "",
        category: identified.category || "General",
        inStock: true,
        url: buildStoreUrl(store, productName),
        description: `Find ${productName} on ${store}`
      }));

      res.json({
        source: localProducts.length > 0 ? "mixed" : "universal",
        identified: productName === "Product" ? "" : productName, // Send empty if generic
        results: [...localProducts, ...universalResults],
        aiFailed: !geminiWorking
      });

    } catch (error) {
      console.error("Analyze Image Error:", error);
      res.json({ source: "universal", identified: "", results: [], error: "Search ready" });
    }
  });

  app.post("/api/analyze-link", async (req, res) => {
    try {
      const { link } = req.body;
      if (!link) return res.status(400).json({ error: "No link provided" });

      // 100% Reliable URL Extraction (Zero AI Quota used)
      const productName = extractProductFromUrl(link);
      console.log("🛠️ Link Analysis (URL extraction):", productName);

      // Extract real product image from page
      let productImage = "";
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3500);
        const pageRes = await fetch(link, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
          },
          signal: controller.signal
        });
        clearTimeout(timeout);
        if (pageRes.ok) {
          const html = await pageRes.text();
          const match = html.match(/<meta[^>]+property=["'](?:og:image|og:image:secure_url)["'][^>]+content=["']([^"']+)["']/i)
            || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["'](?:og:image|og:image:secure_url)["']/i)
            || html.match(/<meta[^>]+name=["'](?:twitter:image|twitter:image:src)["'][^>]+content=["']([^"']+)["']/i)
            || html.match(/<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/i)
            || html.match(/id=["']landingImage["'][^>]*src=["']([^"']+)["']/i)
            || html.match(/data-old-hires=["']([^"']+)["']/i);
          if (match && match[1]) {
            productImage = match[1].replace(/&amp;/g, "&");
          }
        }
      } catch (e) {
        console.warn("Could not fetch page og:image:", e);
      }

      const localProducts = await searchSupabaseProducts(productName);
      const stores = ["Amazon India", "Flipkart", "Google Shopping"];
      const universalResults = stores.map((store, i) => ({
        id: `link-universal-${i}`,
        name: productName,
        price: "Check Store",
        store: store,
        source: store.toLowerCase().split(' ')[0],
        image: productImage || (localProducts[0]?.image || ""),
        category: "E-commerce",
        inStock: true,
        url: buildStoreUrl(store, productName),
        description: `View ${productName} details on ${store}`
      }));

      res.json({
        source: localProducts.length > 0 ? "mixed" : "universal",
        identified: productName,
        image: productImage || (localProducts[0]?.image || ""),
        results: [...localProducts, ...universalResults]
      });

    } catch (error) {
      console.error("Analyze Link Error:", error);
      res.json({ source: "universal", identified: "", results: [] });
    }
  });

  app.post("/api/search", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) return res.status(400).json({ error: "No query provided" });

      console.log("🔍 Direct Search Query:", query);

      // Priority 1: Search local DB
      const localProducts = await searchSupabaseProducts(query);
      
      // Priority 2: Always generate Universal Search Links
      const stores = ["Amazon India", "Flipkart", "Google Shopping"];
      const universalResults = stores.map((store, i) => ({
        id: `universal-search-${i}`,
        name: query,
        price: "Check Store",
        store: store,
        source: store.toLowerCase().split(' ')[0],
        image: "",
        category: "Marketplace",
        inStock: true,
        url: buildStoreUrl(store, query),
        description: `Find ${query} on ${store}`
      }));

      res.json({
        source: localProducts.length > 0 ? "mixed" : "universal",
        identified: query,
        results: [...localProducts, ...universalResults]
      });

    } catch (error) {
      console.error("Search API Error:", error);
      res.status(500).json({ error: "Search failed" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
