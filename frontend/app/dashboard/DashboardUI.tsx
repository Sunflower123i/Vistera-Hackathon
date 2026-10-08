"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PhoneCall, AlertTriangle, Users, BotIcon as Robot, Activity } from "lucide-react"

const recentCalls = [
  { id: 1, patientName: "John Doe", agent: "Cardiac Agent", duration: "5:23", status: "completed" },
  { id: 2, patientName: "Jane Smith", agent: "Post-operative Agent", duration: "3:45", status: "ongoing" },
  { id: 3, patientName: "Alice Johnson", agent: "Diabetes Agent", duration: "7:12", status: "completed" },
]

interface DashboardUIProps {
  patientsCount: number
  alertsCount: number
  agentsCount: number
  callsCount: number
}

export default function DashboardUI({ patientsCount, alertsCount, agentsCount, callsCount }: DashboardUIProps) {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-blue-600">Patients Followed</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{patientsCount}</div>
            <p className="text-xs text-blue-600 mt-1">+2 since last week</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-red-600">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{alertsCount}</div>
            <p className="text-xs text-red-600 mt-1">2 high priority</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-green-600">AI Agents</CardTitle>
            <Robot className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{agentsCount}</div>
            <p className="text-xs text-green-600 mt-1">All active</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-purple-600">Phone Conversations</CardTitle>
            <PhoneCall className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{callsCount}</div>
            <p className="text-xs text-purple-600 mt-1">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700 flex items-center">
            <Activity className="mr-2 h-5 w-5 text-blue-500" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCalls.map((call) => (
              <div key={call.id} className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${call.status === "ongoing" ? "bg-green-500" : "bg-gray-300"}`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{call.patientName}</p>
                  <p className="text-xs text-gray-500">
                    {call.agent} - {call.duration}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    call.status === "ongoing" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {call.status}
                </span>
              </div>
            ))}
          </div>
          <Link href="/dashboard/calls" className="mt-4 inline-block">
            <Button variant="outline" size="sm">
              View all conversations
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

