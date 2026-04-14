import { supabase } from '../src/lib/supabase'

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let { email } = req.body;

  email = email.trim().toLowerCase();

  const { data, error } = await supabase
    .from("customerList")
    .select("customerID")
    .eq("emailID", email)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: "Server error" });
  }

  res.json({ exists: !!data });
}