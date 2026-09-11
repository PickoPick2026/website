import { createClient } from "@supabase/supabase-js";
import { SendMailClient } from "zeptomail";

export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export const cleanText = (value) => typeof value === "string" ? value.trim() : "";

export const requestCode = (prefix) =>
  `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

const escapeHtml = (value) => String(value || "").replace(/[&<>'"]/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
}[char]));

export async function sendConfirmationEmail({ email, name, code, subject, message }) {
  if (!email || !process.env.ZEPTO_TOKEN) return false;

  try {
    const client = new SendMailClient({
      url: "https://api.zeptomail.in/v1.1/email",
      token: process.env.ZEPTO_TOKEN,
    });
    await client.sendMail({
      from: { address: process.env.FROM_EMAIL || "noreply@pickopick.com", name: "Pick O Pick" },
      to: [{ email_address: { address: email, name: name || "Customer" } }],
      cc: [{
        email_address: {
          address: "info@pickopick.com",
          name: "Pick O Pick Team",
        },
      }],
      subject,
      htmlbody: `<p>Hi ${escapeHtml(name || "there")},</p><p>${escapeHtml(message)}</p><p>Your reference ID is <strong>${escapeHtml(code)}</strong>.</p><p>— Pick O Pick</p>`,
    });
    return true;
  } catch (error) {
    // The request is already saved. A mail-provider outage must not lose a lead.
    console.error("Customer confirmation email failed:", error);
    return false;
  }
}

export function whatsappUrl(message) {
  const number = (process.env.WHATSAPP_BUSINESS_NUMBER || "919790361222").replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
