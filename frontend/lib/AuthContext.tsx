"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext, useMemo } from "react"
import type { User } from "@supabase/supabase-js"
import { createBrowserSupabaseClient } from "./supabase"
import { UUID } from "crypto"

type AuthContextType = {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  getUserId: () => Promise<string>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession() // Use session instead of user
      setUser(session?.user ?? null)
  
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })
  
      return () => {
        authListener.subscription.unsubscribe()
      }
    }
  
    initAuth()
  }, [supabase.auth])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    setUser(data.user)
  }

  const getUserId = async () => {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return data.user.id as UUID;
  }

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
    setUser(data.user)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const value = useMemo(() => ({ user, signIn, signUp, signOut, getUserId }), [user, signIn, signUp, signOut, getUserId])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

