import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    const { name, surname, email } = req.body;

    const { data, error } = await supabase
        .from("users")
        .insert({ name, surname, email });

    if(error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
}
