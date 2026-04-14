import otpStore from "./_otpStore";

export default async function handler(req, res) {
  try {
    // ✅ Only allow POST
    if (req.method !== "POST") {
      return res.status(200).json({ message: "Use POST request" });
    }

    // ✅ Safe body parsing
    const body = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body || {};

    let { email } = body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    email = email.trim().toLowerCase();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = {
      otp,
      expiry: Date.now() + 5 * 60 * 1000,
    };

    console.log("OTP:", otp);

    res.json({ message: "OTP sent successfully" });

  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
}