import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://skzjcvdwoveuczvshzka.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrempjdmR3b3ZldWN6dnNoemthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzNjkyNjgsImV4cCI6MjA1NTk0NTI2OH0.Mw81723wNFVaNWqnS1QwQ_LdEGCcff-GBtHHT-oRZvE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
