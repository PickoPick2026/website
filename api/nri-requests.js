import { cleanText, requestCode, sendConfirmationEmail, supabase, whatsappUrl } from "./_request-utils.js";

const ALLOWED_TYPES = new Set(["consultation", "slot_reservation", "pickup_request"]);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { requestType, payload } = req.body || {};
    if (!ALLOWED_TYPES.has(requestType) || !payload || typeof payload !== "object") {
      return res.status(400).json({ error: "A valid NRI request type and form details are required." });
    }

    const consultation = requestType === "consultation";
    const slot = requestType === "slot_reservation";
    const customerName = cleanText(consultation ? payload.fullName : (payload.customerName || payload.pickupName)) || "NRI customer";
    const whatsappNumber = cleanText(consultation || slot ? payload.whatsappNumber : (payload.customerWhatsapp || payload.pickupPhone));
    const country = cleanText(consultation ? payload.currentCountry : payload.destinationCountry);
    const email = cleanText(payload.email || payload.customerEmail) || null;
    const preferredDate = cleanText(consultation || slot ? payload.preferredDate : payload.preferredPickupDate) || null;
    const preferredTime = cleanText(consultation ? payload.preferredTime : (slot ? payload.preferredTimeSlot : payload.preferredPickupSlotLabel)) || null;

    if (!whatsappNumber || !country || (consultation && !cleanText(payload.fullName))) {
      return res.status(400).json({ error: "Please complete the required contact and request details." });
    }

    const prefix = consultation ? "NRI-CON" : slot ? "NRI-SLOT" : "NRI-PICK";
    const { data, error } = await supabase.from("nri_requests").insert({
      request_code: requestCode(prefix), request_type: requestType, customer_name: customerName,
      whatsapp_number: whatsappNumber, email, country, preferred_date: preferredDate,
      preferred_time: preferredTime, payload,
    }).select("request_code, created_at").single();

    if (error) {
      console.error("NRI request insert failed:", error);
      return res.status(500).json({ error: "We could not save your request. Please try again shortly." });
    }

    const emailSent = await sendConfirmationEmail({
      email, name: customerName, code: data.request_code,
      subject: "Your Pick O Pick NRI request is received",
      message: consultation ? "Your free shipping consultation has been booked. Our concierge team will contact you at your selected time." : "We received your NRI service request. Our team will contact you on WhatsApp.",
    });
    return res.status(201).json({
      success: true, requestId: data.request_code, createdAt: data.created_at, emailSent,
      whatsappUrl: whatsappUrl(`Hello Pick O Pick, my NRI ${requestType.replace(/_/g, " ")} reference is ${data.request_code}.`),
      noticeText: slot ? "Slot request received — our team will confirm availability shortly." : "Your request has been received. Our NRI team will contact you on WhatsApp.",
    });
  } catch (error) {
    console.error("NRI request API error:", error);
    return res.status(500).json({ error: "Unable to submit your request right now." });
  }
}
