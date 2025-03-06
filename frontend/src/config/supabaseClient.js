import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://skzjcvdwoveuczvshzka.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrempjdmR3b3ZldWN6dnNoemthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzNjkyNjgsImV4cCI6MjA1NTk0NTI2OH0.Mw81723wNFVaNWqnS1QwQ_LdEGCcff-GBtHHT-oRZvE"; // ⚠️ Replace with env variable in production

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
