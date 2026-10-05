export interface CustomerRequestResponse {
  success: boolean;
  requestId: string;
  emailSent: boolean;
  whatsappUrl: string;
  noticeText?: string;
  crmStatus?: 'sent' | 'duplicate' | 'failed' | 'not_configured' | 'invalid_contact';
  crmLeadId?: string | number | null;
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

// GTM lead tracking (container GTM-MNPX8ZNQ): every successful form
// submission fires one `generate_lead` event here, so a single Custom Event
// trigger in GTM covers all forms. Analytics must never break a submission.
function pushLeadEvent(options: {
  leadType: string;
  requestId: string;
  emailSent: boolean;
  crmStatus?: string;
}) {
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'generate_lead',
      lead_type: options.leadType,
      request_id: options.requestId,
      email_sent: options.emailSent,
      crm_status: options.crmStatus ?? 'unknown',
    });
  } catch {
    /* ignore */
  }
}

export async function submitCustomerRequest(request: {
  serviceType?: string;
  requestType?: string;
  payload: object;
}): Promise<CustomerRequestResponse> {
  const response = await fetch('/api/requests', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.success) throw new Error(result.error || 'Unable to save your request. Please try again.');
  pushLeadEvent({
    leadType: request.serviceType || request.requestType || 'unknown',
    requestId: String(result.requestId ?? ''),
    emailSent: Boolean(result.emailSent),
    crmStatus: result.crmStatus,
  });
  return result;
}
