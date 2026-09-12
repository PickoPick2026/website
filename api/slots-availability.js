// Pickup-slot guidance for the booking form. A submitted request is still
// reviewed by the dispatch team before a slot is finally confirmed.
const SLOTS = [
  { id: "morning", timeRange: "09:00 AM – 11:00 AM", label: "Morning", status: "AVAILABLE", remainingQuota: 4 },
  { id: "midday", timeRange: "11:00 AM – 01:00 PM", label: "Midday", status: "AVAILABLE", remainingQuota: 3 },
  { id: "afternoon", timeRange: "01:00 PM – 03:00 PM", label: "Afternoon", status: "LIMITED", remainingQuota: 2, badge: "Limited" },
  { id: "evening", timeRange: "03:00 PM – 05:00 PM", label: "Evening", status: "AVAILABLE", remainingQuota: 3 },
  { id: "late-evening", timeRange: "05:00 PM – 07:00 PM", label: "Late evening", status: "AVAILABLE", remainingQuota: 2 },
];

export default function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const date = String(req.query?.date || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ error: "A valid pickup date is required." });
  return res.status(200).json({ date, slots: SLOTS });
}
