export interface CustomerRequestResponse {
  success: boolean;
  requestId: string;
  emailSent: boolean;
  whatsappUrl: string;
  noticeText?: string;
  crmStatus?: 'sent' | 'duplicate' | 'failed' | 'not_configured' | 'invalid_contact';
  crmLeadId?: string | number | null;
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
  return result;
}
