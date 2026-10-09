import { FormEvent, useState } from "react";
import { submitCustomerRequest } from '../../services/requestService';
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  MessageCircle,
  Package,
  Boxes,
  PhoneCall,
  ShieldCheck,
  ShoppingBasket,
  Send,
  UserCheck,
} from "lucide-react";
import {
  BluePanel,
  FieldLabel,
  FormGroup,
  fieldClass,
} from "../components/ServicePage";

type FormState = {
  customerName: string;
  whatsappNumber: string;
  customerEmail: string;
  destinationCountry: string;
  packageType: string;
  approxWeightKg: string;
  dimensions: string;
  requirementDescription: string;
};
type Dimensions = { length: string; width: string; height: string };

const PACKAGE_TYPES = [
  { value: "Parcel", icon: Package },
  { value: "Documents", icon: FileText },
  { value: "Multiple packages", icon: Boxes },
  { value: "Food & groceries", icon: ShoppingBasket },
];

const QUOTE_STEPS = [
  { icon: Send, text: "Submit your package and destination details." },
  { icon: UserCheck, text: "Our team contacts you on WhatsApp to verify the request." },
  { icon: MessageCircle, text: "Receive the best suitable quotation by WhatsApp or email." },
];

export default function ShippingEstimatePage() {
  const [form, setForm] = useState<FormState>({
    customerName: "",
    whatsappNumber: "",
    customerEmail: "",
    destinationCountry: "",
    packageType: "Parcel",
    approxWeightKg: "",
    dimensions: "",
    requirementDescription: "",
  });
  const [dimensions, setDimensions] = useState<Dimensions>({
    length: "",
    width: "",
    height: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    requestId: string;
    whatsappUrl: string;
    emailSent: boolean;
  } | null>(null);
  const [error, setError] = useState("");
  const update = (key: keyof FormState, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const dimensionText = [
        dimensions.length,
        dimensions.width,
        dimensions.height,
      ].some(Boolean)
        ? `${dimensions.length || 0} × ${dimensions.width || 0} × ${dimensions.height || 0} cm`
        : "";
      const data = await submitCustomerRequest({
          requestType: "estimate_request",
          payload: { ...form, dimensions: dimensionText },
      });
      setResult({ requestId: data.requestId, whatsappUrl: data.whatsappUrl, emailSent: Boolean(data.emailSent) });
      window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
    } catch (requestError: any) {
      setError(requestError.message || "Please try again shortly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F9FF] text-[#0A1931]">
      {/* ───────── Hero ───────── */}
      <BluePanel>
        <section className="mx-auto max-w-6xl px-4 pb-36 pt-28 text-center sm:px-8 sm:pt-32 lg:pt-36">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest">
            <ShieldCheck className="h-4 w-4" /> Verified quote request
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.06] tracking-tight">
            Get your shipping estimate
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-blue-50 sm:text-lg">
            Tell us about your shipment. Our contact centre verifies each
            request first, then shares the right quotation on WhatsApp or email
            - never public pricing.
          </p>

          <ol className="mx-auto mt-10 grid max-w-4xl gap-3 text-left sm:grid-cols-3">
            {QUOTE_STEPS.map(({ icon: Icon, text }, index) => (
              <li
                key={text}
                className="flex items-start gap-3 rounded-2xl border border-white/20 bg-white/10 p-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0B56D9]">
                  <Icon size={16} />
                </span>
                <span>
                  <span className="block text-[10px] font-black uppercase tracking-widest text-blue-100">
                    Step 0{index + 1}
                  </span>
                  <span className="mt-0.5 block text-sm font-semibold leading-snug">
                    {text}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </section>
      </BluePanel>

      {/* ───────── Form ───────── */}
      <section className="relative z-10 mx-auto -mt-24 max-w-6xl px-4 pb-20 sm:px-8">
        <div className="grid items-start gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-9">
            {result ? (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-[#0B56D9]">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="mt-5 text-2xl font-extrabold text-[#0A1931]">
                  Request received
                </h2>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-600">
                  Your verification code is
                </p>
                <p className="mx-auto mt-2 inline-block rounded-xl border border-dashed border-[#0B56D9]/40 bg-blue-50 px-5 py-2 font-mono text-lg font-bold text-[#0B56D9]">
                  {result.requestId}
                </p>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-600">
                  Keep it handy - our team will confirm your quotation on
                  WhatsApp.
                </p>
                <p className="mx-auto mt-2 max-w-sm text-xs text-slate-500">
                  {result.emailSent
                    ? "A confirmation email was sent to you, with sales@pickopick.com copied."
                    : "Your request was saved. The confirmation email could not be sent, so our team will contact you on WhatsApp."}
                </p>
                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                  <a
                    href={result.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0B56D9] px-6 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white hover:bg-[#0849B7]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Continue on WhatsApp
                  </a>
                  <a
                    href="tel:+919790361222"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-200 px-6 py-3.5 text-xs font-extrabold uppercase tracking-wider text-[#0B56D9] hover:bg-blue-50"
                  >
                    <PhoneCall className="h-4 w-4" />
                    Call contact centre
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-8">
                {error && (
                  <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
                    {error}
                  </p>
                )}

                <FormGroup step="1" title="Your contact details">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Your name"
                      value={form.customerName}
                      onChange={(value) => update("customerName", value)}
                    />
                    <Input
                      label="WhatsApp number"
                      type="tel"
                      value={form.whatsappNumber}
                      onChange={(value) => update("whatsappNumber", value)}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Email ID"
                      type="email"
                      value={form.customerEmail}
                      onChange={(value) => update("customerEmail", value)}
                    />
                    <Input
                      label="Destination country"
                      value={form.destinationCountry}
                      onChange={(value) => update("destinationCountry", value)}
                    />
                  </div>
                </FormGroup>

                <div className="border-t border-dashed border-slate-200" />

                <FormGroup step="2" title="Your package">
                  <div>
                    <span className="mb-1.5 block text-xs font-bold text-slate-700">
                      Package type <span className="text-red-500">*</span>
                    </span>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {PACKAGE_TYPES.map(({ value, icon: Icon }) => {
                        const isActive = form.packageType === value;
                        return (
                          <button
                            key={value}
                            type="button"
                            aria-pressed={isActive}
                            onClick={() => update("packageType", value)}
                            className={`flex flex-col items-center gap-2 rounded-2xl border p-3 text-xs font-bold transition-colors ${
                              isActive
                                ? "border-[#0B56D9] bg-[#0B56D9] text-white"
                                : "border-slate-200 bg-[#F8FAFC] text-slate-700 hover:border-[#0B56D9]/40"
                            }`}
                          >
                            <Icon size={18} />
                            {value}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-[0.8fr_1.2fr]">
                    <Input
                      label="Approx. weight (kg)"
                      type="number"
                      value={form.approxWeightKg}
                      onChange={(value) => update("approxWeightKg", value)}
                    />
                    <div>
                      <span className="mb-1.5 block text-xs font-bold text-slate-700">
                        Dimensions (optional, cm)
                      </span>
                      <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2">
                        {(["length", "width", "height"] as const).map((key, index) => (
                          <span key={key} className="contents">
                            {index > 0 && (
                              <span className="text-sm font-bold text-slate-400">×</span>
                            )}
                            <input
                              type="number"
                              min="0"
                              step="any"
                              aria-label={key}
                              placeholder={key.charAt(0).toUpperCase()}
                              value={dimensions[key]}
                              onChange={(event) =>
                                setDimensions((current) => ({
                                  ...current,
                                  [key]: event.target.value,
                                }))
                              }
                              className={`${fieldClass.replace("px-4", "px-2")} text-center`}
                            />
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <FieldLabel label="What are you shipping or sourcing?">
                    <textarea
                      rows={3}
                      value={form.requirementDescription}
                      onChange={(event) =>
                        update("requirementDescription", event.target.value)
                      }
                      placeholder="Items, quantities or special handling requirements"
                      className={`${fieldClass.replace("h-12 ", "")} resize-none py-3`}
                    />
                  </FieldLabel>
                </FormGroup>

                <button
                  disabled={submitting}
                  className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#0B56D9] text-sm font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-[#0849B7] disabled:opacity-60"
                >
                  {submitting ? "Sending request..." : "Request a verified quote"}
                  {!submitting && (
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-28">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6">
              <img
                src="/images/nri-trust/professional-packing.webp"
                alt="Pick O Pick quality, packaging and weight checks"
                loading="lazy"
                className="mx-auto aspect-square w-full max-w-[220px] object-contain"
              />
              <h2 className="mt-4 text-lg font-extrabold tracking-tight text-[#0A1931]">
                A real quote, not a public calculator.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Every request is checked by our contact centre so the price you
                get fits your actual parcel.
              </p>
            </div>
            <div className="flex items-center gap-4 rounded-[24px] border border-slate-200 bg-white p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#0B56D9]">
                <PhoneCall size={20} />
              </span>
              <span>
                <span className="block text-sm font-extrabold text-[#0A1931]">
                  Prefer to talk?
                </span>
                <a
                  href="tel:+919790361222"
                  className="block text-xs font-semibold text-[#0B56D9] hover:underline"
                >
                  Call our contact centre
                </a>
              </span>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

const Input = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) => (
  <FieldLabel label={label} required>
    <input
      required
      type={type}
      min={type === "number" ? "0" : undefined}
      step={type === "number" ? "any" : undefined}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={fieldClass}
    />
  </FieldLabel>
);
