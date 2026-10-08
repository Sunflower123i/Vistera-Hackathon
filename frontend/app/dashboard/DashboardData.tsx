import { createServerSupabaseClient } from "@/lib/supabase-server"

export async function DashboardData() {
  const supabase = await createServerSupabaseClient()
  const { data: patients } = await supabase.from("patients").select("id", { count: "exact" })
  const { data: alerts } = await supabase.from("alerts").select("id", { count: "exact" })
  const { data: agents } = await supabase.from("agents").select("id", { count: "exact" })
  const { data: calls } = await supabase.from("calls").select("id", { count: "exact" })

  return {
    patientsCount: patients?.length || 0,
    alertsCount: alerts?.length || 0,
    agentsCount: agents?.length || 0,
    callsCount: calls?.length || 0,
  }
}

