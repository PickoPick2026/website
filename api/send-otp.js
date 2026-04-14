import { SendMailClient } from "zeptomail";

export default async function handler(req, res) {
  try {
    // ✅ global store (temporary)
    const otpStore = global.otpStore || {};
    global.otpStore = otpStore;

    // ✅ safe body
    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body || {};

    let { email, name } = body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    email = email.trim().toLowerCase();

    // ✅ generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = {
      otp,
      expiry: Date.now() + 5 * 60 * 1000,
    };

    console.log("OTP:", otp);

    // ✅ ZeptoMail setup (same as your old server)
    const client = new SendMailClient({
      url: "https://api.zeptomail.in/v1.1/email/template",
      token: process.env.ZEPTO_TOKEN, // from Vercel env
    });

    // ✅ SEND EMAIL (your same template)
    await client.sendMailWithTemplate({
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
    console.error("EMAIL ERROR:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
}