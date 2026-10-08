"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Phone, Clock, User, BotIcon as Robot, MessageCircle, CheckCircle } from "lucide-react"
import { useI18N } from "@/lib/i18n"

// Simulate a function to fetch call details
function getCallDetails(id: string) {
  // In a real application, this would make an API call or database query
  return {
    id,
    patientName: "John Doe",
    agent: "Cardiac Agent",
    duration: "5:23",
    status: "completed",
    date: "2023-06-15",
    transcript: [
      { speaker: "Agent", text: "Hello, how are you feeling today?" },
      { speaker: "Patient", text: "I'm feeling a bit tired, but okay." },
      { speaker: "Agent", text: "Have you taken your medications as prescribed?" },
      { speaker: "Patient", text: "Yes, I took them this morning." },
      { speaker: "Agent", text: "That's good. How would you rate your energy levels on a scale of 1 to 10?" },
      { speaker: "Patient", text: "I'd say about a 6. I'm not as energetic as usual, but I can still do most things." },
      { speaker: "Agent", text: "I see. Have you been experiencing any shortness of breath or chest discomfort?" },
      { speaker: "Patient", text: "No, nothing like that. Just the tiredness." },
      { speaker: "Agent", text: "Alright. Are you following the diet plan we discussed in your last appointment?" },
      { speaker: "Patient", text: "Yes, I've been sticking to it pretty well. It's been helpful." },
      { speaker: "Agent", text: "Excellent. Keep it up. Now, let's talk about your exercise routine..." },
    ],
    recommendedActions: [
      "Schedule a follow-up appointment",
      "Adjust dosage of medication X",
      "Recommend more rest",
      "Increase monitoring frequency",
    ],
  }
}

const downloadTranscript = (transcript: { speaker: string; text: string }[]) => {
  const content = transcript.map((entry) => `${entry.speaker}: ${entry.text}`).join("\n\n")
  const blob = new Blob([content], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "call_transcript.txt"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function getSummaryDetails() {
  return {
    summary: [
      { label: "Condition", value: "Patient reports mild fatigue, otherwise stable." }, { label: "Medications", value: "Administered as per prescription, morning dose." }, { label: "Energy", value: "6/10, reduced from baseline but functional." }, { label: "Symptoms", value: "No dyspnea or chest discomfort." }, { label: "Diet", value: "Adhering to prescribed nutritional plan, beneficial." }, { label: "Exercise", value: "Discussion on exercise regimen initiated." }
    ]
  }
}

export default function CallDetails() {
  const { t } = useI18N()
  const params = useParams()
  const call = getCallDetails(params.id as string)

  const summary = getSummaryDetails(); // Get the summary details

  if (!call) {
    // You can handle the not found case here
    return <div>Call not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Link href="/dashboard/calls" className="flex items-center text-blue-500 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("backToCallList")}
        </Link>
        <h1 className="text-3xl font-bold">{t("callDetails")}</h1>
      </div>

      {/* Display the summary */}
      <div className="p-4 border rounded-md bg-white">
        <h2 className="text-lg font-semibold mb-4">Summary</h2>
        <ul className="list-disc pl-5 space-y-2">
          {summary.summary.map((item, index) => (
            <li key={index} className="text-gray-700">
              <strong>{item.label}:</strong> {item.value}
            </li>
          ))}
        </ul>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Phone className="mr-2 h-5 w-5 text-blue-500" />
            {t("callInformation")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <User className="mr-2 h-5 w-5 text-gray-400" />
              <span className="font-semibold mr-2">{t("patient")}:</span> {call.patientName}
            </div>
            <div className="flex items-center">
              <Robot className="mr-2 h-5 w-5 text-gray-400" />
              <span className="font-semibold mr-2">{t("agent")}:</span> {call.agent}
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-gray-400" />
              <span className="font-semibold mr-2">{t("duration")}:</span> {call.duration}
            </div>
            <div className="flex items-center">
              <span className="font-semibold mr-2">{t("status")}:</span>
              <Badge variant={call.status === "completed" ? "default" : "destructive"}>{t(call.status)}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <MessageCircle className="mr-2 h-5 w-5 text-blue-500" />
            {t("callTranscript")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] rounded-md border p-4">
            {call.transcript.map((entry, index) => (
              <div key={index} className={`mb-4 flex ${entry.speaker === "Patient" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    entry.speaker === "Patient" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p className="text-sm font-semibold mb-1">{entry.speaker}</p>
                  <p>{entry.text}</p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            {t("recommendedActions")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            {call.recommendedActions.map((action, index) => (
              <li key={index} className="text-gray-700">
                {action}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => downloadTranscript(call.transcript)}>
          {t("downloadTranscript")}
        </Button>
        <Button>{t("scheduleFollowUp")}</Button>
      </div>
    </div>
  )
}
