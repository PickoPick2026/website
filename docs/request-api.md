# Shared customer request API

## Frontend services

- `src/services/shippingEstimateService.ts`: synchronous indicative rate calculation, including actual/volumetric weight. No network request. These rates and the fixed exchange rate are public guidance, not courier quotations.
- `src/services/pickupSlotService.ts`: preferred pickup windows. No quotas or verified availability; dispatch confirms the requested time.
- `src/services/requestService.ts`: all customer request forms POST to `/api/requests`.

The removed `/api/estimate` and `/api/slots/availability` handlers and local server routes are no longer used. The real estimate enquiry flow is preserved.

## Request shape

```json
{
  "serviceType": "buy_and_ship",
  "payload": {
    "customerName": "Customer name",
    "phone": "+91…",
    "email": "customer@example.com",
    "location": "United Kingdom",
    "productUrl": "https://www.amazon.in/…",
    "itemNotes": "Size, colour, quantity and instructions"
  }
}
```

Use exactly one of `serviceType` or `requestType`:

| Type selector | Values | Saved request |
| --- | --- | --- |
| `serviceType` | `buy_and_ship`, `order_and_send`, `assisted_buy`, `exclusive_sourcing`, `contact` | `service_requests` |
| `requestType` | `consultation`, `slot_reservation`, `pickup_request` | `nri_requests` |
| `requestType` | `estimate_request` | `estimate_leads` |
| `requestType` | `cart_quote` | Existing cart flow saves `orders` and `order_items` before requesting CRM sync/email |

Payload fields are form-specific. Existing validation and full payload preservation remain in the individual handlers. Authentication/registration is a separate flow.

## CRM setup

The supplied API key is embedded directly in the server-only `createCrmLead` function in `lib/crmLead.js`. No CRM environment variables or dotenv configuration are needed. The key is visible to anyone with access to that source file. Existing database and email integrations still require their own environment settings.

The connector uses HTTPS with `operation=insertRecords`, `formname=Leads`, and `overwrite=true`, matching the supplied Create Lead example. Duplicates can therefore update an existing CRM lead. No segment map, reference field, detail field or assigned-to environment variables are needed.

CRM receives the documented Contact Name, Email, Mobile, Lead Date (India timezone), Lead Source = Website, and Company Name when supplied. The account's actual assignee was not provided, so Assigned To is omitted. Service categories, references and complete submission details remain in the website database; undocumented custom CRM fields are not invented.

Confirmation email CC is `sales@pickopick.com`. Mail continues through the existing ZeptoMail integration; no Gmail password is required.

No live leads or email deliveries are triggered by starting the application.

## Delivery behavior

The existing request is saved and its confirmation email attempted first. CRM is then attempted with an eight-second timeout. The response preserves `requestId`, `emailSent`, and `whatsappUrl`, and adds `crmStatus` and `crmLeadId`.

- `sent`: the CRM returned an insertion/update success.
- `duplicate`: the CRM reported an existing/skipped lead; this does not mean a new CRM record was created.
- `failed`: CRM was unavailable or rejected the request. The application's saved request remains available for follow-up.
- `invalid_contact`: CRM contact requirements are missing.

Apply `supabase/migrations/20261003_crm_request_status.sql` to expose CRM status/lead ID on request records and orders. The API tolerates a missing migration, but cannot persist sync status until it is applied. The schema migration is not executed by this change.

There is no automatic CRM retry worker in this version. Failed/pending records require team follow-up or a future server-side retry worker. Do not resubmit the whole customer form to retry CRM, because that can create another local request.

Legacy real request endpoints remain available for compatibility; current forms use the new shared endpoint. Legacy callers do not receive the new CRM sync behavior until they migrate.
