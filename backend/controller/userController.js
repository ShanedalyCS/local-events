//import required libraries
import { supabase } from '../supabaseClient.js';

// const bcrypt = require('bcrypt');

const TABLE = 'Users';

export async function users(req, res){
    const {data, error} = await supabase 
    .from(TABLE)
    .select('*')

    if(error) return error; 
    res.json(data);
} 