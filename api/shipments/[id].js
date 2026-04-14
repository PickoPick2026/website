export default async function handler(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Tracking ID required" });
    }

    const response = await fetch(
      `https://admin.pickopick.com/api/tracking_api/get_tracking_data?api_company_id=20&customer_code=superadmin&tracking_no=${id}`
    );

    if (!response.ok) {
      return res.status(500).json({ error: "External API failed" });
    }

    const data = await response.json();

    console.log("API RESPONSE:", JSON.stringify(data));

    if (!data || !Array.isArray(data) || data.length === 0) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    const raw = data[0];

    if (!raw || raw.errors === true) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    // ✅ SAFE parsing
    const info = Array.isArray(raw.docket_info)
      ? Object.fromEntries(raw.docket_info)
      : {};

    const shipment = {
      id: raw.tracking_no,
      status: info?.["Status"] || "Unknown",
      from: info?.["Origin"] || "-",
      to: info?.["Destination"] || "-",
      arrivalDate: info?.["Delivery Date and Time"] || "Not Delivered",
      progress: raw?.docket_events?.length > 1 ? 70 : 30,
      events: raw?.docket_events || []
    };

    res.json(shipment);

  } catch (error) {
    console.error("SHIPMENT ERROR:", error);
    res.status(500).json({
      error: "Failed to fetch tracking data",
      details: error.message
    });
  }
}