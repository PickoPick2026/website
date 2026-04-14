// api/auth/register.js
import bcrypt from "bcryptjs";
import otpStore from "../_otpStore";
import { supabase } from "../../src/lib/supabase";

export default async function handler(req, res) {
  try {
    const { name, email, password } = req.body;

    const cleanEmail = email.trim().toLowerCase();

    // OTP check
    const record = otpStore[cleanEmail];

    if (!record || !record.verified) {
      return res.status(400).json({ error: "OTP not verified" });
    }

    // Check existing user
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

    delete otpStore[cleanEmail];

    res.json({ user: data[0] });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}