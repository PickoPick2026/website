import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://exumyibiflkgylzetzyh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4dW15aWJpZmxrZ3lsemV0enloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MzgxNDUsImV4cCI6MjA5MDExNDE0NX0.kUp1mghw0uhk-a4mCK2Ao8OKvInLHBpx-P1NCitTtYc";

export const supabase = createClient(supabaseUrl, supabaseKey);