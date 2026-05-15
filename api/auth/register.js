import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";
import { SendMailClient } from "zeptomail";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  try {
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body || {};

    const { name, email, password, phoneNumber } = body;

    const cleanEmail = email.trim().toLowerCase();
    
    if (!email || !password || !name || !phoneNumber) {
      return res.status(400).json({ error: "All fields required" });
    }

    // ✅ CHECK OTP
    const { data: otpData } = await supabase
      .from("otp_store")
      .select("*")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (!otpData || !otpData.verified) {
      return res.status(400).json({ error: "OTP not verified" });
    }

    // ✅ CHECK EXISTING USER
    const { data: existing } = await supabase
      .from("customerList")
      .select("customerID")
      .eq("emailID", cleanEmail)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // ✅ HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ INSERT USER
    const { data, error } = await supabase
      .from("customerList")
      .insert([
        {
          firstName: name,
          emailID: cleanEmail,
          password: hashedPassword,
          phoneNumber: phoneNumber,
        },
      ])
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const user = data[0];

    // ✅ DELETE OTP
    await supabase.from("otp_store").delete().eq("email", cleanEmail);

    // ✅ SEND WELCOME EMAIL (YOUR CODE)
    const mailClient = new SendMailClient({
      url: "https://api.zeptomail.in/v1.1/email/template",
      token: process.env.ZEPTO_TOKEN,
    });

    await mailClient.sendMailWithTemplate({
      template_key: "2518b.5f1360f6e8e70412.k1.14d4fa60-0dc0-11f1-8966-62df313bf14d.19c77247d06",
      from: {
        address: "noreply@pickopick.com",
        name: "PickoPick"
      },
      to: [
        {
          email_address: {
            address: cleanEmail,
            name: name,
          }
        }
      ],
      merge_info: {}
    });

     const mailClient1 = new SendMailClient({
      url: "https://api.zeptomail.in/v1.1/email/template",
      token: process.env.ZEPTO_TOKEN,
    });


    await mailClient1.sendMailWithTemplate({
      template_key: "2518b.5f1360f6e8e70412.k1.ef76b6b0-5026-11f1-8706-e256a66a52e4.19e2a502d9b",
      from: {
        address: "noreply@pickopick.com",
        name: "PickoPick"
      },
      to: [
        {
          email_address: {
            address: "kathirvel@pickopick.com",
            name: "Info",
          },
        },
        {
          email_address: {
            address: "dm1@pickopick.com",
            name: "Support",
          },
        },
      ],
      "merge_info": {"name":"name","email":"cleanEmail"},
    });


    

    res.json({ user });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
}