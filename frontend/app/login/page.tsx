/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useI18N } from "@/lib/i18n"
import { useAuth } from "@/lib/AuthContext"

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const isValidPassword = (password: string) => {
  return password.length >= 6 // Minimum 6 characters
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { t } = useI18N()
  const { user, signIn, signUp } = useAuth()

  useEffect(() => {
    if (user) {
      router.replace("/dashboard") // Avoid push() to prevent history stacking
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!isValidEmail(email)) {
      setError(t("invalidEmail"))
      return
    }

    if (!isValidPassword(password)) {
      setError(t("invalidPassword"))
      return
    }

    try {
      if (isLogin) {
        await signIn(email.trim(), password)
      } else {
        await signUp(email.trim(), password)
      }
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Authentication error:", error)
      setError(error.message || t("authError"))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-primary hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("backToHome")}
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {isLogin ? t("doctorLogin") : t("doctorSignUp")}
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                placeholder={t("emailPlaceholder")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <p className="text-sm text-gray-500">{t("passwordRequirements")}</p>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              {isLogin ? t("login") : t("signUp")}
            </Button>
            <Button type="button" variant="link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? t("needAccount") : t("alreadyHaveAccount")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

