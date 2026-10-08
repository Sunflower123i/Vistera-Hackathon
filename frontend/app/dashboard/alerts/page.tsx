"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import { useI18N } from "@/lib/i18n"

// Mock data for alerts
const alerts = [
  {
    id: 1,
    patientName: "John Doe",
    agent: "Cardiac Agent",
    type: "High Blood Pressure",
    severity: "high",
    status: "open",
    date: "2023-06-15",
  },
  {
    id: 2,
    patientName: "Jane Smith",
    agent: "Post-operative Agent",
    type: "Abnormal Pain Levels",
    severity: "medium",
    status: "open",
    date: "2023-06-14",
  },
  {
    id: 3,
    patientName: "Alice Johnson",
    agent: "Diabetes Agent",
    type: "Low Blood Sugar",
    severity: "high",
    status: "resolved",
    date: "2023-06-13",
  },
  {
    id: 4,
    patientName: "Bob Williams",
    agent: "Orthopedic Agent",
    type: "Missed Medication",
    severity: "low",
    status: "open",
    date: "2023-06-12",
  },
  {
    id: 5,
    patientName: "Carol Brown",
    agent: "Respiratory Agent",
    type: "Breathing Difficulty",
    severity: "high",
    status: "resolved",
    date: "2023-06-11",
  },
]

export default function AlertsPage() {
  const { t } = useI18N()

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-200 text-red-800"
      case "medium":
        return "bg-yellow-200 text-yellow-800"
      case "low":
        return "bg-green-200 text-green-800"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "resolved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/dashboard" className="flex items-center mb-4 text-blue-500 hover:underline">
        <ArrowLeft className="mr-2" />
        {t("backToDashboard")}
      </Link>
      <h1 className="text-3xl font-bold mb-8">{t("alerts")}</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2" />
            {t("activeAlerts")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("patient")}</TableHead>
                <TableHead>{t("agent")}</TableHead>
                <TableHead>{t("alertType")}</TableHead>
                <TableHead>{t("severity")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("date")}</TableHead>
                <TableHead>{t("action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>{alert.patientName}</TableCell>
                  <TableCell>{alert.agent}</TableCell>
                  <TableCell>{alert.type}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(alert.severity)}`}>
                      {t(alert.severity)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getStatusIcon(alert.status)}
                      <span className="ml-2">{t(alert.status)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{alert.date}</TableCell>
                  <TableCell>
                    <Link href={`/dashboard/alerts/${alert.id}`}>
                      <Button variant="outline" size="sm">
                        {t("viewDetails")}
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

