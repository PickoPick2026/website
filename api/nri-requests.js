
export default function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
  const { requestType, payload = {} } = req.body || {};
  if (!requestType || !payload)
    return res.status(400).json({ error: "Request details are required." });
  const phone =
    payload.whatsappNumber || payload.customerWhatsapp || payload.pickupPhone;
  if (!phone)
    return res.status(400).json({ error: "Please provide a contact number." });
  const requestId = `POP-${String(requestType).slice(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  return res.status(201).json({
    success: true,
    requestId,
    consultationId: requestId,
    emailSent: false,
    whatsappUrl: `https://wa.me/919790361222?text=${encodeURIComponent(`Hello Pick O Pick, my request reference is ${requestId}.`)}`,
  });
}
