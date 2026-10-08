"use client";

import Link from "next/link"
import { MapPin, ArrowRight, Bot, Brain, Bell, Activity, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useI18N } from "@/lib/i18n"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import Image from "next/image";

export default function Home() {
  const { t } = useI18N()

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-10">
          <Link href="/" className="text-white text-2xl font-bold flex items-center">
            <Image src="/icon.png" alt="Agentic CareGivers" width={60} height={40} />
            Agentic CareGivers
          </Link>
        <div className="flex gap-4 items-center">
          <span className="text-white">{t("areYouADoctor")}</span>
          <Link href="/login">
            <Button variant="secondary" className="bg-white text-primary hover:bg-gray-100">
              {t("login")}
            </Button>
          </Link>
          <LanguageSwitcher />
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">{t("heroTitle")}</h1>
              <p className="text-xl text-blue-100">{t("heroSubtitle")}</p>

              {/* Search Bar */}
              <div className="bg-white rounded-lg p-2 shadow-lg flex gap-2">
                <div className="flex-1 flex items-center gap-2 border-r px-2">
                  <Bot className="w-5 h-5 text-gray-400" />
                  <Input type="text" placeholder={t("aiAgentType")} className="border-0 focus-visible:ring-0" />
                </div>
                <div className="flex-1 flex items-center gap-2 px-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <Input type="text" placeholder={t("medicalSpecialty")} className="border-0 focus-visible:ring-0" />
                </div>
                <Link href="/login">
                  <Button className="bg-primary hover:bg-primary/90">{t("getStarted")}</Button>
                </Link>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <Image
                src="/medical-professional.jpg"
                alt="Medical Professional"
                width={600}
                height={600}
                className="w-full h-auto object-contain rounded-lg shadow-lg"
              />
              <div className="absolute top-1/2 right-0 transform translate-x-1/4 -translate-y-1/2">
                <div className="bg-white rounded-lg shadow-lg p-4 w-48">
                  <div className="flex items-center gap-2">
                    <Bot className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-semibold">{t("activeAgent")}</p>
                      <p className="text-sm text-gray-600">{t("247Monitoring")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-tl-full opacity-10 transform translate-y-1/2"></div>
        <div className="absolute top-20 right-40 w-24 h-24 bg-yellow-300 rounded-lg opacity-10 transform -rotate-12"></div>
      </div>

      {/* Feature Cards */}
      <div className="container mx-auto max-w-6xl px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{t("customizedAI")}</h3>
                  <p className="text-sm text-gray-600">{t("customizedAIDesc")}</p>
                </div>
                <ArrowRight className="ml-auto w-5 h-5 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{t("continuousMonitoring")}</h3>
                  <p className="text-sm text-gray-600">{t("continuousMonitoringDesc")}</p>
                </div>
                <ArrowRight className="ml-auto w-5 h-5 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{t("proactiveAlerts")}</h3>
                  <p className="text-sm text-gray-600">{t("proactiveAlertsDesc")}</p>
                </div>
                <ArrowRight className="ml-auto w-5 h-5 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Value Propositions */}
      <div className="container mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-2xl font-bold text-center mb-12">{t("valueProposition")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-lg mx-auto flex items-center justify-center">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold">{t("intelligentAIAgents")}</h3>
            <p className="text-sm text-gray-600">{t("intelligentAIAgentsDesc")}</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-lg mx-auto flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold">{t("maximumSecurity")}</h3>
            <p className="text-sm text-gray-600">{t("maximumSecurityDesc")}</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-lg mx-auto flex items-center justify-center">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold">{t("efficientCollaboration")}</h3>
            <p className="text-sm text-gray-600">{t("efficientCollaborationDesc")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

