import { createClient } from '@supabase/supabase-js';

//const supabaseUrl = 'https://bpiljdcxvjgsnuvkxbyo.supabase.co';
//const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwaWxqZGN4dmpnc251dmt4YnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTM2MzQsImV4cCI6MjA3NjU2OTYzNH0.8LFwsDKDDMp9DBRugrmDYlSz993LEXBYZs9tzcjBjUQ';

//const supabaseUrl = 'https://mikyiulygbodgysiyzwr.supabase.co';
//const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pa3lpdWx5Z2JvZGd5c2l5endyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzODg5MjIsImV4cCI6MjA3Njk2NDkyMn0.Azw7BzPG-BFfB2N9iG0geeDF6LrJxuBJJagUSDt5TR4';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("Supabase Key:", import.meta.env.VITE_SUPABASE_ANON_KEY ? "Loaded ✅" : "Missing ❌");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

