// api/verify-otp.js

export default function handler(req, res) {
  try {
    // ✅ allow only POST
    if (req.method !== "POST") {
      return res.status(200).json({ message: "Use POST request" });
    }

    // ✅ safe body parsing
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body || {};

    let { email, otp } = body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP required" });
    }

    email = email.trim().toLowerCase();
    otp = String(otp).trim();

    // ✅ use global store (same as send-otp)
    const otpStore = global.otpStore || {};
    global.otpStore = otpStore;

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

    // ✅ mark verified
    otpStore[email].verified = true;

    res.json({ message: "OTP verified successfully" });

  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
}