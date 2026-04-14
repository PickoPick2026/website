// api/shipments/[id].js

export default async function handler(req, res) {
  try {
    const { id } = req.query; // ✅ get dynamic param

    const response = await fetch(
      `https://admin.pickopick.com/api/tracking_api/get_tracking_data?api_company_id=20&customer_code=superadmin&tracking_no=${id}`
    );

    const data = await response.json();

    console.log("API RESPONSE:", JSON.stringify(data, null, 2));

    // ✅ validation
    if (!data || data.length === 0 || data[0]?.errors === true) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    const raw = data[0];

    // ✅ convert array to object
    const info = Object.fromEntries(raw.docket_info || []);

    const shipment = {
      id: raw.tracking_no,
      status: info["Status"],
      from: info["Origin"],
      to: info["Destination"],
      arrivalDate: info["Delivery Date and Time"] || "Not Delivered",
      progress: raw.docket_events?.length > 1 ? 70 : 30,
      events: raw.docket_events || []
    };

    res.json(shipment);

  } catch (error) {
    console.error("SHIPMENT ERROR:", error);
    res.status(500).json({ error: "Failed to fetch tracking data" });
  }
}