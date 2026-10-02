const ENDPOINT = 'https://apps.cratiocrm.com/api/apirequest.php';

// Account defaults from the supplied Create Lead request.
const FORM_NAME = 'Leads';
const OVERWRITE = true;
const text = value => typeof value === 'string' ? value.trim() : '';

// Shared server-only connector. API credentials and CRM field names never come
// from browser requests. Full form data remains in the application's database.
export async function createCrmLead(kind, payload, reference) {
  const apiKey = "NF8xXzUwODkkQDU4IyMyMDI2LTA5LTMwIDE2OjEzOjE0";
  const record = {
    'Contact Name': text(payload.fullName || payload.customerName || payload.name || payload.pickupName),
    Email: text(payload.email || payload.customerEmail),
    Mobile: text(payload.whatsappNumber || payload.customerWhatsapp || payload.phone || payload.customerPhone || payload.mobileNumber || payload.pickupPhone),
    'Lead Date': new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()),
    'Lead Source': 'Website',
  };
  if (!record['Contact Name'] || !record.Mobile) return { status: 'invalid_contact', leadId: null };
  if (text(payload.companyName)) record['Company Name'] = text(payload.companyName);
  // Service type, reference and complete form details stay in our request tables.
  // The provided CRM schema has no documented fields for those values.

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const url = new URL(ENDPOINT);
    url.searchParams.set('operation', 'insertRecords');
    url.searchParams.set('apikey', apiKey);
    url.searchParams.set('formname', FORM_NAME);
    url.searchParams.set('overwrite', String(OVERWRITE));
    const response = await fetch(url, {
      method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ records: [record] }), signal: controller.signal,
    });
    const result = await response.json();
    // Some Cratio accounts return a serialized, nonstandard success array.
    let success = result.success;
    if (typeof success === 'string') {
      try { success = JSON.parse(success); }
      catch {
        const info = success.match(/info\s*:\s*['"]?([^,}\]]+)/i)?.[1]?.trim();
        const formid = success.match(/formid\s*:\s*['"]?(\d+)/i)?.[1];
        success = info ? [{ info, formid }] : [];
      }
    }
    if (!response.ok || result.error || result.errors || !Array.isArray(success) || !success.length) {
      return { status: 'failed', leadId: null };
    }
    const row = success[0];
    const info = String(row.info || row.Info || '').toLowerCase();
    if (!info || /error|fail|reject|not\s+(insert|creat|updat)/.test(info) || !/insert|creat|overwrit|updat|skip|duplicate/.test(info)) return { status: 'failed', leadId: null };
    return { status: /skip|duplicate/.test(info) ? 'duplicate' : 'sent', leadId: row.formid || row.Formid || row['Form ID'] || null };
  } catch {
    // Do not log the URL, API key or upstream response containing contact data.
    return { status: 'failed', leadId: null };
  } finally { clearTimeout(timeout); }
}
