import { submitCustomerRequest } from '../services/requestService';

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
  return submitCustomerRequest({ serviceType, payload });
}
