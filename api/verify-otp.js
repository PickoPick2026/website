// api/verify-otp.js
import otpStore from "./_otpStore";

export default function handler(req, res) {
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

  otpStore[email].verified = true;

  res.json({ message: "OTP verified" });
}