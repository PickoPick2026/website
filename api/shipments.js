const SHIPMENTS = [
  { id: "AA-845", type: "air", origin: "USA", destination: "COL", distance: "3780 ml", arrival_date: "Jun 5, 2024", status: "Pending", progress: 75 },
  { id: "JL-748", type: "sea", origin: "CHN", destination: "KOR", distance: "620 ml", arrival_date: "Jun 3, 2024", status: "Pending", progress: 60 },
  { id: "MU-131", type: "air", origin: "JPN", destination: "DEU", distance: "5875 ml", arrival_date: "Apr 25, 2024", status: "Arrived", progress: 100 },
];

export default async function handler(req, res) {
  const { id } = req.query;

  if (id) {
    try {
      const response = await fetch(
        `https://admin.pickopick.com/api/tracking_api/get_tracking_data?api_company_id=20&customer_code=superadmin&tracking_no=${encodeURIComponent(id)}`
      );

      if (!response.ok) {
        return res.status(500).json({ error: "External API failed" });
      }

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("External API returned non-JSON:", text.slice(0, 200));
        return res.status(502).json({ error: "External API returned invalid response" });
      }

      if (!data || !Array.isArray(data) || data.length === 0) {
        return res.status(404).json({ error: "Shipment not found" });
      }

      const raw = data[0];
      if (!raw || raw.errors === true) {
        return res.status(404).json({ error: "Shipment not found" });
      }

      const info = Array.isArray(raw.docket_info) ? Object.fromEntries(raw.docket_info) : {};

      const shipment = {
        id: raw.tracking_no,
        status: info?.["Status"] || "Unknown",
        from: info?.["Origin"] || "-",
        to: info?.["Destination"] || "-",
        arrivalDate: info?.["Delivery Date and Time"] || "Not Delivered",
        consigneeName: info?.["Consignee Name"] || "",
        shipperName: info?.["Shipper Name"] || "",
        shipperCity: info?.["Shipper City"] || "",
        consigneeCity: info?.["Consignee City"] || "",
        bookingDate: info?.["Booking Date"] || "",
        weight: raw.chargeable_weight || "",
        originHub: info?.["Origin Hub"] || "",
        progress: raw?.docket_events?.length > 1 ? 70 : 30,
        events: raw?.docket_events || [],
      };

      return res.json(shipment);
    } catch (error) {
      console.error("SHIPMENT ERROR:", error);
      return res.status(500).json({ error: "Failed to fetch tracking data", details: error.message });
    }
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  return res.status(200).json(SHIPMENTS);
}
