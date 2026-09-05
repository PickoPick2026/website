// GET /api/shipments — list of shipments shown in the "Live Activities" table.
//
// Locally this is served by the Express route in server.ts (backed by the
// `shipments` table in SQLite, which is just seeded with the rows below).
// On Vercel there is no long-running server / SQLite, so this serverless
// function returns the same seed data to keep the home page identical to local.

const SHIPMENTS = [
  { id: "AA-845", type: "air", origin: "USA", destination: "COL", distance: "3780 ml", arrival_date: "Jun 5, 2024", status: "Pending", progress: 75 },
  { id: "JL-748", type: "sea", origin: "CHN", destination: "KOR", distance: "620 ml", arrival_date: "Jun 3, 2024", status: "Pending", progress: 60 },
  { id: "MU-131", type: "air", origin: "JPN", destination: "DEU", distance: "5875 ml", arrival_date: "Apr 25, 2024", status: "Arrived", progress: 100 },
];

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.status(200).json(SHIPMENTS);
}
