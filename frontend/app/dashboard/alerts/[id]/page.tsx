"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation" // Changed from next/router
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Phone } from "lucide-react"
import { useI18N } from "@/lib/i18n"

type Alert = {
  createdAt: string
  message: string
  id: string
  patientName: string
  agent: string
  type: string
  severity: "low" | "medium" | "high"
  status: "open" | "resolved"
  date: string
  description: string
  vitalSigns: {
    bloodPressure: string
    heartRate: string
    temperature: string
  }
  recommendedActions: string[]
}

// async function fetchAlertDetails(id: string): Promise<Alert | null> {
//   const res = await fetch(`/api/alerts/${id}`)
//   if (!res.ok) {
//     return null
//   }
//   return res.json()
// }

const sampleAlerts: Alert = {
  "id": "123",
  "patientName": "John Doe",
  "agent": "Agent 1",
  "severity": "high",
  "status": "open",
  "message": "Patient's heart rate is abnormal.",
  "createdAt": "2025-02-14 08:45:00",
  "description": "The patient's heart rate has been above normal range for the last 15 minutes.",
  "vitalSigns": {
    "bloodPressure": "130/85 mmHg",
    "heartRate": "120 bpm",
    "temperature": "38.2 °C"
  },
  "recommendedActions": ["Monitor heart rate", "Administer medication"],
  "type": "cardiac",
  "date": "2025-02-14"
}


export default function AlertDetailsPage() {
  const router = useRouter()
  const params = useParams() // Add useParams hook
  const { t } = useI18N()
  const [alert, setAlert] = useState<Alert | null>(null)

  useEffect(() => {
    // fetchAlertDetails(params.id).then((alert) => {
    //   setAlert(alert)
    // })
    setAlert(sampleAlerts)
  }, [params.id])

  if (!alert) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <Button onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{t("alertDetails")}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("alertDetails")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Badge
                variant={
                  alert.severity === "high" ? "destructive" : alert.severity === "medium" ? "default" : "secondary"
                }
              >
                {alert.severity}
              </Badge>
              <p>{alert.message}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <p>
                {t("patient")}: {alert.patientName}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span>
                {t("createdAt")}: {alert.createdAt}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span>
                {t("status")}: {alert.status}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mt-8 flex justify-end space-x-4">
        <Button variant="outline" onClick={() => router.push(`/dashboard/patients/${alert.patientName}`)}>
          {t("viewPatientDetails")}
        </Button>
        <Button variant="destructive">{t("deleteAlert")}</Button>
      </div>
    </div>
  )
}

