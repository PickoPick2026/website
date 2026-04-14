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
        ? JSON.parse(body)
        : req.body || {};

    let { email, otp, newPassword } = body;

    email = email.trim().toLowerCase();

    const { data } = await supabase
      .from("otp_store")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (!data) {
      return res.status(400).json({ error: "OTP not generated" });
    }

    if (data.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (data.expiry < Date.now()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    // ✅ update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await supabase
      .from("customerList")
      .update({ password: hashedPassword })
      .eq("emailID", email);

    // ✅ delete OTP
    await supabase.from("otp_store").delete().eq("email", email);

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error("RESET ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
}