// api/send-email.js
export default async function handler(req, res) {
  const { email } = req.body;

  console.log("Send email to:", email);

  res.json({ success: true });
}