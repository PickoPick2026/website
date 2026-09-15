import {
  cleanText,
  sendConfirmationEmail,
  whatsappUrl,
} from "./_request-utils.js";

// Shared lightweight endpoint for confirmation emails and cart quote requests.
export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const {
    type,
    requestType,
    payload = {},
    email,
    name,
    phone,
    code,
    items = [],
  } = req.body || {};

  // 1. Cart quote request flow (immediate confirmation email with products + CC info@pickopick.com)
  if (type === "cart_quote" || type === "quote_request") {
    const customerEmail = cleanText(
      email || payload.customerEmail || payload.email,
    );
    const customerName = cleanText(
      name || payload.customerName || payload.name || "Valued Customer",
    );
    const customerPhone = cleanText(
      phone || payload.customerPhone || payload.phone || payload.whatsappNumber,
    );
    const orderCode = cleanText(
      code ||
        payload.orderCode ||
        payload.code ||
        `POP-QUOTE-${Date.now().toString(36).toUpperCase()}`,
    );
    const productItems =
      Array.isArray(items) && items.length
        ? items
        : Array.isArray(payload.items)
          ? payload.items
          : [];

    const totalQty = productItems.reduce(
      (sum, item) => sum + (Number(item.quantity) || 1),
      0,
    );
    const customerWhatsappUrl = whatsappUrl(
      `Hello Pick O Pick, my quote request reference is ${orderCode}.`,
    );

    const emailSent = await sendConfirmationEmail({
      email: customerEmail,
      name: customerName,
      code: orderCode,
      subject: `Your Pick O Pick product quote request (${orderCode})`,
      message:
        "We have received your product quote request. Our concierge team is verifying availability, packaging, and the best shipping rates, and will contact you shortly with the verified quote.",
      whatsappUrlValue: customerWhatsappUrl,
      details: [
        ["Reference ID", orderCode],
        ["Customer Name", customerName],
        ["Contact Phone", customerPhone],
        [
          "Total Products",
          `${productItems.length} item${productItems.length === 1 ? "" : "s"} (${totalQty} units)`,
        ],
      ],
      items: productItems,
    });

    return res.status(200).json({
      success: true,
      orderCode,
      emailSent,
      whatsappUrl: customerWhatsappUrl,
    });
  }

  // 2. NRI rewrite backward compatibility
  if (requestType) {
    const contactPhone =
      payload.whatsappNumber || payload.customerWhatsapp || payload.pickupPhone;
    if (!contactPhone)
      return res
        .status(400)
        .json({ error: "Please provide a contact number." });
    const requestId = `POP-${String(requestType).slice(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    return res.status(201).json({
      success: true,
      requestId,
      consultationId: requestId,
      emailSent: false,
      whatsappUrl: `https://wa.me/919790361222?text=${encodeURIComponent(`Hello Pick O Pick, my request reference is ${requestId}.`)}`,
    });
  }

  // 3. Fallback generic email
  console.log("Send email to:", email);
  return res.status(200).json({ success: true });
}
