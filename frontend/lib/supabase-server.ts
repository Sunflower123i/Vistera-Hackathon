/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      async get(name: string) {
        return (await cookieStore).get(name)?.value
      },
      async set(name: string, value: string, options: any) {
        try {
          (await cookieStore).set({ name, value, ...options })
        } catch {
          // Handle cookie setting error
        }
      },
      async remove(name: string, options: any) {
        try {
          (await cookieStore).set({ name, value: "", ...options })
        } catch {
          // Handle cookie removal error
        }
      },
    },
  })
}

