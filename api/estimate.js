// Instant rate guidance used by the NRI calculator modal. This does not create
// a lead; the dedicated /api/estimate-request endpoint saves customer requests.
const ZONE_RATES = {
  USA: { base: 1450, perKg: 560, days: "5–8 business days" },
  Canada: { base: 1550, perKg: 590, days: "6–9 business days" },
  "United Kingdom": { base: 1350, perKg: 510, days: "4–7 business days" },
  UAE: { base: 950, perKg: 390, days: "3–5 business days" },
  Australia: { base: 1650, perKg: 610, days: "6–10 business days" },
  Singapore: { base: 1050, perKg: 430, days: "3–6 business days" },
};

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { destinationCountry, weightKg, lengthCm = 0, widthCm = 0, heightCm = 0 } = req.body || {};
  const actualWeightKg = Number(weightKg);
  const dimensions = [lengthCm, widthCm, heightCm].map(Number);
  if (!destinationCountry || !Number.isFinite(actualWeightKg) || actualWeightKg <= 0 || dimensions.some((value) => !Number.isFinite(value) || value < 0)) {
    return res.status(400).json({ error: "Provide a destination and valid package measurements." });
  }

  const volumetricWeightKg = (dimensions[0] * dimensions[1] * dimensions[2]) / 5000;
  const billableWeightKg = Math.max(actualWeightKg, volumetricWeightKg);
  const rate = ZONE_RATES[destinationCountry] || { base: 1750, perKg: 650, days: "6–12 business days" };
  const midpoint = rate.base + billableWeightKg * rate.perKg;
  const estimatedInrMin = Math.round(midpoint * 0.9);
  const estimatedInrMax = Math.round(midpoint * 1.12);

  return res.status(200).json({
    origin: "India", destinationCountry, actualWeightKg: Number(actualWeightKg.toFixed(2)),
    volumetricWeightKg: Number(volumetricWeightKg.toFixed(2)), billableWeightKg: Number(billableWeightKg.toFixed(2)),
    estimatedInrMin, estimatedInrMax,
    estimatedUsdMin: Number((estimatedInrMin / 84).toFixed(2)), estimatedUsdMax: Number((estimatedInrMax / 84).toFixed(2)),
    transitDays: rate.days, serviceLevel: "International express",
    notes: ["This is an indicative rate only; the final quotation follows shipment verification.", "Chargeable weight is the higher of actual and volumetric weight."],
  });
}
