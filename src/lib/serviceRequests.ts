export type ServiceRequestType =
  | "buy_and_ship"
  | "order_and_send"
  | "exclusive_sourcing"
  | "contact"
  | "assisted_buy";

export interface ServiceRequestResponse {
  success: boolean;
  requestId: string;
  emailSent: boolean;
  whatsappUrl: string;
}

export async function submitServiceRequest(
  serviceType: ServiceRequestType,
  payload: Record<string, unknown>,
): Promise<ServiceRequestResponse> {
  const response = await fetch("/api/service-requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ serviceType, payload }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Unable to submit your request right now.");
  }

  return data as ServiceRequestResponse;
}
