import { cleanText, requestCode, sendConfirmationEmail, supabase, whatsappUrl } from "./_request-utils.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const payload = req.body?.payload;
    if (!payload || typeof payload !== "object") return res.status(400).json({ error: "Estimate details are required." });

    const customerName = cleanText(payload.customerName);
    const whatsappNumber = cleanText(payload.whatsappNumber);
    const email = cleanText(payload.customerEmail);
    const destinationCountry = cleanText(payload.destinationCountry);
    const weight = Number(payload.approxWeightKg);
    if (!customerName || !whatsappNumber || !email || !destinationCountry || !Number.isFinite(weight) || weight <= 0) {
      return res.status(400).json({ error: "Please complete the required estimate details." });
    }

    const code = requestCode("POP-EST");
    const { data, error } = await supabase.from("estimate_leads").insert({
      request_code: code,
      customer_name: customerName,
      whatsapp_number: whatsappNumber,
      email,
      destination_country: destinationCountry,
      package_type: cleanText(payload.packageType) || null,
      approx_weight_kg: weight,
      dimensions: cleanText(payload.dimensions) || null,
      requirement_description: cleanText(payload.requirementDescription) || null,
      payload,
    }).select("request_code, created_at").single();

    if (error) {
      console.error("Estimate lead insert failed:", error);
      return res.status(500).json({ error: "We could not save your estimate request. Please try again shortly." });
    }

    const customerWhatsappUrl = whatsappUrl(`Hello Pick O Pick, my shipping estimate reference is ${data.request_code}.`);
    const emailSent = await sendConfirmationEmail({
      email,
      name: customerName,
      code: data.request_code,
      subject: "Your Pick O Pick shipping estimate request",
      message: "We received your shipping estimate request and will contact you with a verified quotation.",
      whatsappUrlValue: customerWhatsappUrl,
      details: [
        ["Destination", destinationCountry],
        ["Package", cleanText(payload.packageType)],
        ["Approx. weight", `${weight} kg`],
        ["Dimensions", cleanText(payload.dimensions)],
        ["Requirement", cleanText(payload.requirementDescription)],
      ],
    });
    return res.status(201).json({
      success: true,
      requestId: data.request_code,
      createdAt: data.created_at,
      emailSent,
      whatsappUrl: customerWhatsappUrl,
    });
  } catch (error) {
    console.error("Estimate request API error:", error);
    return res.status(500).json({ error: "Unable to submit your estimate request right now." });
  }
}
