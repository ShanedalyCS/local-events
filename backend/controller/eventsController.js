import { supabase } from '../supabaseClient.js';

// 👇 change this to 'events' or 'event' if needed
const TABLE = 'Event';

export async function list(req, res) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('date_start', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}


export async function listID(req, res){
    const {id} = req.params;
    const {data, error} = await supabase 
        .from(TABLE)
        .select('*')
        .eq('id', id)
        .single();

    if(error ) return res.status(404).json("ERROR 404");
    res.json(data);
}