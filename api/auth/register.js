import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

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

    const { name, email, password } = body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "All fields required" });
    }

    const cleanEmail = email.trim().toLowerCase();

    // ✅ CHECK OTP FROM DB
    const { data: otpData } = await supabase
      .from("otp_store")
      .select("*")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (!otpData || !otpData.verified) {
      return res.status(400).json({ error: "OTP not verified" });
    }

    // ✅ CHECK USER EXISTS
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
        },
      ])
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // ✅ DELETE OTP AFTER USE
    await supabase.from("otp_store").delete().eq("email", cleanEmail);

    res.json({ user: data[0] });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
}