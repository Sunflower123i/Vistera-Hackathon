"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PhoneCall, ArrowLeft, Search } from "lucide-react"
import { useI18N } from "@/lib/i18n"
import { Input } from "@/components/ui/input"
import { useState } from "react"

// Mock data for recent calls
const recentCalls = [
  { id: 1, patientName: "John Doe", agent: "Cardiac Agent", duration: "5:23", date: "2023-06-15", status: "completed" },
  {
    id: 2,
    patientName: "Jane Smith",
    agent: "Post-operative Agent",
    duration: "3:45",
    date: "2023-06-14",
    status: "ongoing",
  },
  {
    id: 3,
    patientName: "Alice Johnson",
    agent: "Diabetes Agent",
    duration: "7:12",
    date: "2023-06-13",
    status: "completed",
  },
  {
    id: 4,
    patientName: "Bob Williams",
    agent: "Orthopedic Agent",
    duration: "4:30",
    date: "2023-06-12",
    status: "completed",
  },
  {
    id: 5,
    patientName: "Carol Brown",
    agent: "Respiratory Agent",
    duration: "6:15",
    date: "2023-06-11",
    status: "ongoing",
  },
]

export default function CallsPage() {
  const { t } = useI18N()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCalls = recentCalls.filter((call) => call.patientName.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/dashboard" className="flex items-center mb-4 text-blue-500 hover:underline">
        <ArrowLeft className="mr-2" />
        {t("backToDashboard")}
      </Link>
      <h1 className="text-3xl font-bold mb-8">{t("phoneConversations")}</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <PhoneCall className="mr-2" />
              {t("recentCalls")}
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder={t("searchPatients")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("patient")}</TableHead>
                <TableHead>{t("agent")}</TableHead>
                <TableHead>{t("duration")}</TableHead>
                <TableHead>{t("date")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCalls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell>{call.patientName}</TableCell>
                  <TableCell>{call.agent}</TableCell>
                  <TableCell>{call.duration}</TableCell>
                  <TableCell>{call.date}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        call.status === "ongoing" ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {t(call.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link href={`/dashboard/calls/${call.id}`}>
                      <Button variant="outline" size="sm">
                        {t("details")}
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

