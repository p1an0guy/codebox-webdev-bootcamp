import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    "https://eimkkctpbqsoqxxdlvjv.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpbWtrY3RwYnFzb3F4eGRsdmp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxODYxMDYsImV4cCI6MjA3NDc2MjEwNn0.m-sIZMlMMAT4pWhre0B3t4jQBNd2PnuRkJqEqVow7i8"
)

export default supabase