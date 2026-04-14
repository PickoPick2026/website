export default async function handler(req, res) {
  try {
    const otpStore = global.otpStore || {};
    global.otpStore = otpStore;

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
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
}