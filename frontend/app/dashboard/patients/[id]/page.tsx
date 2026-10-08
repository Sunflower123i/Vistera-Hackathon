"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Phone, User, Calendar, Activity, ClipboardList } from "lucide-react"
import { useI18N } from "@/lib/i18n"

type Patient = {
  id: string
  name: string
  dateOfBirth: string
  contactNumber: string
  email: string
  address: string
  medicalHistory: string[]
  currentMedications: string[]
  recentAppointments: {
    date: string
    reason: string
  }[]
  upcomingAppointments: {
    date: string
    reason: string
  }[]
  status: "stable" | "critical" | "improving"
}

async function fetchPatientDetails(id: string): Promise<Patient | null> {
  const res = await fetch(`/api/patients/${id}`)
  if (!res.ok) {
    return null
  }
  return res.json()
}

export default function PatientDetailsPage() {
    const router = useRouter()
    const params = useParams()
    const { t } = useI18N()
    const [patient, setPatient] = useState<Patient | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const sampleAgent: Patient = {
        id: "sample-001",
        name: "John Doe",
        dateOfBirth: "1980-01-01",
        contactNumber: "+1 (555) 123-4567",
        email: "john.doe@example.com",
        address: "123 Main St, Anytown, AN 12345",
        medicalHistory: ["Hypertension diagnosed in 2015", "Appendectomy in 2010", "Allergic to penicillin"],
        currentMedications: ["Lisinopril 10mg daily", "Metformin 500mg twice daily", "Aspirin 81mg daily"],
        recentAppointments: [
            { date: "2023-05-15", reason: "Annual check-up" },
            { date: "2023-03-10", reason: "Follow-up on blood pressure" },
        ],
        upcomingAppointments: [
            { date: "2023-08-20", reason: "Diabetes management review" },
            { date: "2023-09-05", reason: "Routine blood work" },
        ],
        status: "stable",
    }


    useEffect(() => {
        const loadPatientDetails = async () => {
        setIsLoading(true)
        try {
            // const details = await fetchPatientDetails(params.id as string)
            const details = sampleAgent
            setPatient(details)
        } catch (error) {
            console.error("Failed to fetch patient details:", error)
        } finally {
            setIsLoading(false)
        }
        }
        loadPatientDetails()
    }, [params.id, sampleAgent])

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">{t("loading")}</div>
    }

    if (!patient) {
        return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl font-bold mb-4">{t("patientNotFound")}</h2>
            <Button onClick={() => router.back()}>{t("goBack")}</Button>
        </div>
        )
    }

    return (
        <div className="flex flex-col space-y-4 p-4">
        <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">{t("patientDetails")}</h1>
        </div>
        <Card>
            <CardHeader>
            <CardTitle>{t("personalInformation")}</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <p>
                    {t("name")}: {patient.name}
                </p>
                </div>
                <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <p>
                    {t("dateOfBirth")}: {patient.dateOfBirth}
                </p>
                </div>
                <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <p>
                    {t("contactNumber")}: {patient.contactNumber}
                </p>
                </div>
                <div className="flex items-center space-x-2">
                <Badge
                    variant={
                    patient.status === "critical"
                        ? "destructive"
                        : patient.status === "improving"
                        ? "default"
                        : "secondary"
                    }
                >
                    {t(patient.status)}
                </Badge>
                </div>
            </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
            <CardTitle>{t("medicalInformation")}</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="flex flex-col space-y-4">
                <div>
                <h3 className="font-semibold mb-2">{t("medicalHistory")}</h3>
                <ul className="list-disc pl-5">
                    {patient.medicalHistory.map((item, index) => (
                    <li key={index}>{item}</li>
                    ))}
                </ul>
                </div>
                <div>
                <h3 className="font-semibold mb-2">{t("currentMedications")}</h3>
                <ul className="list-disc pl-5">
                    {patient.currentMedications.map((medication, index) => (
                    <li key={index}>{medication}</li>
                    ))}
                </ul>
                </div>
            </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
            <CardTitle>{t("appointments")}</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="flex flex-col space-y-4">
                <div>
                <h3 className="font-semibold mb-2">{t("recentAppointments")}</h3>
                <ul className="space-y-2">
                    {patient.recentAppointments.map((appointment, index) => (
                    <li key={index} className="flex items-center space-x-2">
                        <Activity className="h-4 w-4" />
                        <span>
                        {appointment.date}: {appointment.reason}
                        </span>
                    </li>
                    ))}
                </ul>
                </div>
                <div>
                <h3 className="font-semibold mb-2">{t("upcomingAppointments")}</h3>
                <ul className="space-y-2">
                    {patient.upcomingAppointments.map((appointment, index) => (
                    <li key={index} className="flex items-center space-x-2">
                        <ClipboardList className="h-4 w-4" />
                        <span>
                        {appointment.date}: {appointment.reason}
                        </span>
                    </li>
                    ))}
                </ul>
                </div>
            </div>
            </CardContent>
        </Card>
        <div className="mt-8 flex justify-end space-x-4">
            <Button variant="outline" onClick={() => router.push(`/dashboard/patients/${patient.id}/edit`)}>
            {t("editPatientDetails")}
            </Button>
            <Button variant="default" onClick={() => router.push(`/dashboard/patients/${patient.id}/schedule`)}>
            {t("scheduleAppointment")}
            </Button>
        </div>
        </div>
    )
}

