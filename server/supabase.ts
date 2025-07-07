
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://snqlviehipbgswztrwhw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNucWx2aWVoaXBiZ3N3enRyd2h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4OTU5MzIsImV4cCI6MjA2NzQ3MTkzMn0.n8aaWZfg81hD9Fr26pFQcR33brpdzMpUMkkna61V2nI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
