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

    let { email, otp } = body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP required" });
    }

    email = email.trim().toLowerCase();
    otp = String(otp).trim();

    // ✅ FETCH FROM DB
    const { data, error } = await supabase
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

    // ✅ MARK VERIFIED
    await supabase
      .from("otp_store")
      .update({ verified: true })
      .eq("email", email);

    res.json({ message: "OTP verified successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}