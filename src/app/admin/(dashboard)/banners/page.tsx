import { createClient } from "@/lib/supabase/server";
import BannersManager from "./BannersManager";

export default async function AdminBannersPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("banners").select("*").order("order_index");

  return <BannersManager banners={data ?? []} />;
}
