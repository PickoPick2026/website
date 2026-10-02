import type { ShippingEstimateResult } from '../app/components/NRI/types';

const rates: Record<string, { base: number; perKg: number; days: string }> = {
  USA: { base: 1450, perKg: 560, days: '5–8 business days' },
  Canada: { base: 1550, perKg: 590, days: '6–9 business days' },
  'United Kingdom': { base: 1350, perKg: 510, days: '4–7 business days' },
  UAE: { base: 950, perKg: 390, days: '3–5 business days' },
  Australia: { base: 1650, perKg: 610, days: '6–10 business days' },
  Singapore: { base: 1050, perKg: 430, days: '3–6 business days' },
};
const aliases: Record<string, string> = { UK: 'United Kingdom', 'United States': 'USA', 'United Arab Emirates': 'UAE' };

// Indicative guidance only. This does not fetch a courier rate or create a lead.
export function calculateShippingEstimate(input: {
  destinationCountry: string;
  weightKg: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
}): ShippingEstimateResult {
  const { destinationCountry, weightKg, lengthCm = 0, widthCm = 0, heightCm = 0 } = input;
  if (!destinationCountry || !Number.isFinite(weightKg) || weightKg <= 0 || [lengthCm, widthCm, heightCm].some(value => !Number.isFinite(value) || value < 0)) {
    throw new Error('Provide a destination and valid package measurements.');
  }
  const rate = rates[aliases[destinationCountry] || destinationCountry] || { base: 1750, perKg: 650, days: '6–12 business days' };
  const volumetricWeightKg = lengthCm * widthCm * heightCm / 5000;
  const billableWeightKg = Math.max(weightKg, volumetricWeightKg);
  const midpoint = rate.base + billableWeightKg * rate.perKg;
  const estimatedInrMin = Math.round(midpoint * 0.9);
  const estimatedInrMax = Math.round(midpoint * 1.12);
  return {
    origin: 'India', destinationCountry,
    actualWeightKg: Number(weightKg.toFixed(2)),
    volumetricWeightKg: Number(volumetricWeightKg.toFixed(2)),
    billableWeightKg: Number(billableWeightKg.toFixed(2)),
    estimatedInrMin, estimatedInrMax,
    estimatedUsdMin: Number((estimatedInrMin / 84).toFixed(2)),
    estimatedUsdMax: Number((estimatedInrMax / 84).toFixed(2)),
    transitDays: rate.days, serviceLevel: 'International express',
    notes: ['Indicative guidance only; the team confirms the final quotation.', 'Chargeable weight is the higher of actual and volumetric weight.'],
  };
}
