import { createClient } from "@supabase/supabase-js";
import { SendMailClient } from "zeptomail";

// Vite uses the VITE_ names locally; Vercel deployments commonly use the
// server-only names. Accept both so the API and browser use the same project.
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);
const mailToken = process.env.ZEPTO_TOKEN || process.env.ZEPTOMAIL_TOKEN || process.env.VITE_ZEPTO_TOKEN;

export const cleanText = (value) => typeof value === "string" ? value.trim() : "";

export const requestCode = (prefix) =>
  `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

const escapeHtml = (value) => String(value || "").replace(/[&<>'"]/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
}[char]));

export function brandedEmailHtml({ name, code, message, details = [], whatsappUrlValue }) {
  const rows = details
    .filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== "")
    .map(([label, value]) => `<tr><td style="padding:9px 0;color:#64748b;font-size:12px;width:42%;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:9px 0;color:#0a1931;font-size:13px;font-weight:600;vertical-align:top;">${escapeHtml(value)}</td></tr>`)
    .join("");
  const button = whatsappUrlValue ? `<a href="${escapeHtml(whatsappUrlValue)}" style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;border-radius:999px;padding:13px 22px;font-size:13px;font-weight:700;">Continue on WhatsApp</a>` : "";
  return `<!doctype html><html><body style="margin:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#0a1931;"><div style="padding:28px 12px;background:#f1f5f9;"><div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 8px 30px rgba(10,25,49,.10);"><div style="padding:22px 28px;background:#0b56d9;text-align:center;"><img src="https://pickopick.com/PICKLogo.png" alt="Pick O Pick" style="display:block;width:170px;max-width:70%;height:auto;margin:0 auto;background:#ffffff;border-radius:8px;padding:7px;"></div><div style="padding:28px;"><p style="margin:0 0 8px;color:#64748b;font-size:13px;">Hello ${escapeHtml(name || "there")},</p><h1 style="margin:0 0 14px;font-size:24px;line-height:1.25;color:#0a1931;">Your request is received</h1><p style="margin:0;color:#475569;font-size:14px;line-height:1.7;">${escapeHtml(message)}</p><div style="margin:22px 0;padding:14px 16px;border-radius:12px;background:#eff6ff;border:1px solid #bfdbfe;"><span style="display:block;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:.08em;font-weight:700;">Reference ID</span><strong style="display:block;margin-top:5px;color:#0b56d9;font-family:monospace;font-size:18px;">${escapeHtml(code)}</strong></div>${rows ? `<div style="border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;margin-bottom:22px;"><h2 style="margin:0;padding-top:14px;font-size:13px;color:#475569;text-transform:uppercase;letter-spacing:.06em;">Request summary</h2><table role="presentation" style="width:100%;border-collapse:collapse;">${rows}</table></div>` : ""}<div style="text-align:center;">${button}</div></div><div style="padding:18px 28px;background:#f8fafc;text-align:center;border-top:1px solid #e2e8f0;"><p style="margin:0;color:#64748b;font-size:11px;line-height:1.6;">Pick O Pick · International logistics from India<br>Questions? Reply to this email or contact our concierge team.</p></div></div></div></body></html>`;
}

export async function sendConfirmationEmail({ email, name, code, subject, message, details, whatsappUrlValue }) {
  if (!email || !mailToken) return false;

  try {
    const client = new SendMailClient({
      url: "https://api.zeptomail.in/v1.1/email",
      token: mailToken,
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
      htmlbody: brandedEmailHtml({ name, code, message, details, whatsappUrlValue }),
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
