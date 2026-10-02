alter table public.service_requests
  add column if not exists crm_sync_status text not null default 'pending',
  add column if not exists crm_lead_id text;
alter table public.nri_requests
  add column if not exists crm_sync_status text not null default 'pending',
  add column if not exists crm_lead_id text;
alter table public.estimate_leads
  add column if not exists crm_sync_status text not null default 'pending',
  add column if not exists crm_lead_id text;
alter table public.orders
  add column if not exists crm_sync_status text not null default 'pending',
  add column if not exists crm_lead_id text;
