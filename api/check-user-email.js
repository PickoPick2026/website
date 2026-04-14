import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    email = email.trim().toLowerCase();

    const { data, error } = await supabase
      .from("customerList")
      .select("customerID")
      .eq("emailID", email)
      .maybeSingle();

    if (error) throw error;

    res.json({ exists: !!data });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
}