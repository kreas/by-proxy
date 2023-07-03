import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const { SUPABASE_URL, SUPABASE_KEY } = Deno.env.toObject();

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
export const db = supabase;
