// api/send-otp.js
import otpStore from "./_otpStore";

export default async function handler(req, res) {
  try {
    let { email } = req.body;

    email = email.trim().toLowerCase();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = {
      otp,
      expiry: Date.now() + 5 * 60 * 1000,
    };

    console.log("OTP:", otp);

    res.json({ message: "OTP sent successfully" });

  } catch (err) {
    res.status(500).json({ error: "Failed to send OTP" });
  }
}