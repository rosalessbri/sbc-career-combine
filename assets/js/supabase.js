
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://sqqmjcgtcrfrqszklcxf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_x1ugQTtqjBM-vHxXxpCJ4Q_nfzQydhT";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
