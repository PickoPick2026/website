import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { GoogleGenAI } from "@google/genai";
import { SendMailClient } from "zeptomail";
import { supabase } from './supabase.js';


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
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const mailUrl = "https://api.zeptomail.in/v1.1/email/template";
const mailToken = process.env.ZEPTO_TOKEN || "YOUR_TOKEN";

const mailClient = new SendMailClient({
  url: mailUrl,
  token: mailToken
});

async function startServer() {
  const app = express();
  const PORT = 3000;

 
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API Routes
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

    const data = await response.json();
    console.log("API RESPONSE:", JSON.stringify(data, null, 2));

    // ✅ FIXED CONDITION
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

  app.post("/api/analyze-image", async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) {
        return res.status(400).json({ error: "No image provided" });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          {
            parts: [
              {
                text: "Identify the product in this image and suggest 3 similar products that can be bought from major Indian e-commerce sites like Amazon India, Myntra, or Flipkart. For each product, provide: 1. Name, 2. Estimated Price in INR, 3. Store Name, 4. A brief description. Format the output as a JSON array of objects with keys: id, name, price, store, description.",
              },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: image.split(",")[1],
                },
              },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
        },
      });

      res.json(JSON.parse(response.text || "[]"));
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to analyze image" });
    }
  });

  app.post("/api/analyze-link", async (req, res) => {
    try {
      const { link } = req.body;
      if (!link) {
        return res.status(400).json({ error: "No link provided" });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          {
            parts: [
              {
                text: `Analyze this product link: ${link}. Identify the product and suggest 3 similar products that can be bought from major Indian e-commerce sites like Amazon India, Myntra, or Flipkart. For each product, provide: 1. Name, 2. Estimated Price in INR, 3. Store Name, 4. A brief description. Format the output as a JSON array of objects with keys: id, name, price, store, description.`,
              },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
        },
      });

      res.json(JSON.parse(response.text || "[]"));
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to analyze link" });
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
