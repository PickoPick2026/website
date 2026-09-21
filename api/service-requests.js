import {
  cleanText,
  requestCode,
  sendConfirmationEmail,
  supabase,
  whatsappUrl,
} from "./_request-utils.js";

const SERVICE_CONFIG = {
  buy_and_ship: {
    prefix: "BUY",
    subject: "Your Pick O Pick Buy & Ship Request Has Been Received",
    message:
      "We received your Buy & Ship request. Our personal shopper will verify the item, store availability, and delivery options before sharing a quote.",
  },
  order_and_send: {
    prefix: "SEND",
    subject: "Your Pick O Pick Order & Send Request Has Been Received",
    message:
      "We received your Order & Send request. Our logistics team will review the pickup and destination details and contact you with the next steps.",
  },
  exclusive_sourcing: {
    prefix: "EXCL",
    subject: "Your Pick O Pick Exclusive Sourcing Request Has Been Received",
    message:
      "We received your exclusive sourcing request. Our India-side team will check availability for the requested regional items and contact you with a quote.",
  },
  contact: {
    prefix: "CONT",
    subject: "Your Pick O Pick Contact Request Has Been Received",
    message:
      "We received your message. A Pick O Pick team member will get back to you shortly.",
  },
  assisted_buy: {
    prefix: "ABUY",
    subject: "Your Pick O Pick Assisted Buy Request Has Been Received",
    message:
      "We received your assisted buying request. Our personal shopper will verify the product and send the next steps shortly.",
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { serviceType, payload } = req.body || {};
    const config = SERVICE_CONFIG[serviceType];
    if (!config || !payload || typeof payload !== "object") {
      return res.status(400).json({ error: "A valid service request is required." });
    }

    const customerName = cleanText(
      payload.customerName || payload.fullName || payload.name,
    );
    const phone = cleanText(
      payload.phone || payload.whatsappNumber || payload.mobileNumber,
    );
    const email = cleanText(payload.email || payload.customerEmail);
    const location = cleanText(
      payload.location ||
        payload.destinationLocation ||
        payload.destinationCountry ||
        payload.country,
    );

    if (!customerName || !phone || !email || !location) {
      return res.status(400).json({
        error: "Please provide your name, phone number, email, and location.",
      });
    }

    const code = requestCode(`POP-${config.prefix}`);
    const { data, error } = await supabase
      .from("service_requests")
      .insert({
        request_code: code,
        service_type: serviceType,
        status: "NEW",
        customer_name: customerName,
        phone,
        email,
        location,
        payload,
      })
      .select("request_code, created_at")
      .single();

    if (error) {
      console.error("Service request insert failed:", error);
      return res.status(500).json({
        error: "We could not save your request. Please try again shortly.",
      });
    }

    const customerWhatsappUrl = whatsappUrl(
      `Hello Pick O Pick, my ${serviceType.replace(/_/g, " ")} reference is ${data.request_code}.`,
    );
    const details = [
      ["Service", serviceType.replace(/_/g, " ")],
      ["Customer", customerName],
      ["Phone", phone],
      ["Email", email],
      ["Location", location],
      ...Object.entries(payload)
        .filter(
          ([key, value]) =>
            !["customerName", "fullName", "name", "phone", "whatsappNumber", "mobileNumber", "email", "customerEmail", "location", "destinationLocation", "destinationCountry", "country"].includes(key) &&
            value !== null &&
            value !== undefined &&
            String(value).trim() !== "",
        )
        .slice(0, 12)
        .map(([key, value]) => [key.replace(/([A-Z])/g, " $1"), String(value)]),
    ];
    const emailSent = await sendConfirmationEmail({
      email,
      name: customerName,
      code: data.request_code,
      subject: config.subject,
      message: config.message,
      whatsappUrlValue: customerWhatsappUrl,
      details,
    });

    return res.status(201).json({
      success: true,
      requestId: data.request_code,
      createdAt: data.created_at,
      emailSent,
      whatsappUrl: customerWhatsappUrl,
    });
  } catch (error) {
    console.error("Service request API error:", error);
    return res.status(500).json({ error: "Unable to submit your request right now." });
  }
}
