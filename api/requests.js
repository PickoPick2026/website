import serviceRequests from './service-requests.js';
import nriRequests from './nri-requests.js';
import estimateRequest from './estimate-request.js';
import sendEmail from './send-email.js';
import { createCrmLead } from '../lib/crmLead.js';
import { supabase } from './_request-utils.js';

const SERVICE_TYPES = new Set(['buy_and_ship', 'order_and_send', 'assisted_buy', 'exclusive_sourcing', 'contact']);
const NRI_TYPES = new Set(['consultation', 'slot_reservation', 'pickup_request']);

// All customer request forms use this entry point. Existing handlers retain
// their validation, database queues, reference IDs and confirmation emails.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); }
    catch { return res.status(400).json({ error: 'Invalid JSON request.' }); }
  }
  const { serviceType, requestType, payload } = body || {};
  if (!payload || typeof payload !== 'object' || Array.isArray(payload) || (serviceType && requestType)) {
    return res.status(400).json({ error: 'Provide one request type and its form details.' });
  }
  const kind = serviceType || requestType;
  let submit;
  let table;
  let handlerBody = body;
  if (SERVICE_TYPES.has(serviceType)) { submit = serviceRequests; table = 'service_requests'; }
  else if (NRI_TYPES.has(requestType)) { submit = nriRequests; table = 'nri_requests'; }
  else if (requestType === 'estimate_request') { submit = estimateRequest; table = 'estimate_leads'; }
  else if (requestType === 'cart_quote') {
    if (!payload.customerName || !payload.customerEmail || !payload.customerPhone || !payload.orderCode || !Array.isArray(payload.items) || !payload.items.length) {
      return res.status(400).json({ error: 'Complete your quote contact details and products.' });
    }
    submit = sendEmail;
    table = 'orders';
    handlerBody = { type: 'cart_quote', payload };
  } else return res.status(400).json({ error: 'Unsupported request type.' });

  let status = 200;
  let result;
  const capture = {
    status(code) { status = code; return this; },
    json(value) { result = value; return this; },
  };
  try {
    await submit({ ...req, method: 'POST', body: handlerBody }, capture);
    if (!result) return res.status(500).json({ error: 'Unable to process your request.' });
    if (status >= 400 || !result.success) return res.status(status).json(result);
    const reference = result.requestId || result.orderCode;
    const crm = await createCrmLead(kind, payload, reference);
    // Optional migration exposes delivery state for admin follow-up. A CRM
    // outage does not erase the saved customer request or claim a successful sync.
    if (table) {
      try {
        const { error } = await supabase.from(table).update({ crm_sync_status: crm.status, crm_lead_id: crm.leadId ? String(crm.leadId) : null }).eq(table === 'orders' ? 'order_code' : 'request_code', reference);
        if (error) console.warn('CRM sync status could not be stored; apply the CRM status migration.');
      } catch { console.warn('CRM sync status could not be stored.'); }
    }
    return res.status(status).json({ ...result, requestId: reference, crmStatus: crm.status, crmLeadId: crm.leadId });
  } catch {
    return res.status(500).json({ error: 'Unable to process your request right now.' });
  }
}
