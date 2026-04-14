import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  try {
    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body || {};

    let { email, name } = body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    email = email.trim().toLowerCase();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ SAVE OTP IN DB
    await supabase.from("otp_store").upsert({
      email,
      otp,
      expiry: Date.now() + 5 * 60 * 1000,
      verified: false
    });

    // 👉 keep your ZeptoMail email sending here
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
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
}