import { createClient } from "@/lib/supabase/server";
import CategoriesManager from "./CategoriesManager";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("order_index");

  return <CategoriesManager categories={data ?? []} />;
}
