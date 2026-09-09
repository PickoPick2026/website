// Shared lightweight endpoint for confirmation emails and NRI quote/consultation requests.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { requestType, payload = {}, email } = req.body || {};

  // `/api/nri-requests` is rewritten here in vercel.json to stay within the
  // serverless-function limit without changing any client-side API URLs.
  if (requestType) {
    const phone = payload.whatsappNumber || payload.customerWhatsapp || payload.pickupPhone;
    if (!phone) return res.status(400).json({ error: 'Please provide a contact number.' });
    const requestId = `POP-${String(requestType).slice(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    return res.status(201).json({
      success: true,
      requestId,
      consultationId: requestId,
      emailSent: false,
      whatsappUrl: `https://wa.me/919790361222?text=${encodeURIComponent(`Hello Pick O Pick, my request reference is ${requestId}.`)}`,
    });
  }

  console.log('Send email to:', email);
  return res.status(200).json({ success: true });
}
