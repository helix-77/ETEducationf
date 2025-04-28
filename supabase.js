import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://octajpjsdvorcrvolbgk.supabase.co"; // Replace with your Supabase URL
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jdGFqcGpzZHZvcmNydm9sYmdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4ODUwMzgsImV4cCI6MjA1NzQ2MTAzOH0.Vc434asbwqh95-m89A1DdctVx19FBfP8T9o2vXDlfpU"; // Replace with your anon public key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
