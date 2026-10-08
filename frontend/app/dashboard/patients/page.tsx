"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, User, Plus } from "lucide-react"
import { useI18N } from "@/lib/i18n"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { useAuth } from "@/lib/AuthContext"
import { useEffect, useState } from "react"

export default function PatientsPage() {
  const { t } = useI18N()
  const { getUserId } = useAuth() // Assuming this returns the userID
  const supabase = createBrowserSupabaseClient()

  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPatients = async () => {
      const userID = await getUserId()
      
      if (!userID) {
        setError("User not authenticated")
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from("patients")
          .select("*")
          .eq("docuuid", userID)

        if (error) {
          setError(error.message)
        } else {
          setPatients(data)
        }
      } catch {
        setError("Failed to fetch patients")
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [getUserId, supabase])

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/dashboard" className="flex items-center mb-4 text-blue-500 hover:underline">
        <ArrowLeft className="mr-2" />
        {t("backToDashboard")}
      </Link>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t("patients")}</h1>
        <Link href="/dashboard/patients/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("addNewPatient")}
          </Button>
        </Link>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2" />
            {t("patientsList")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("dateOfBirth")}</TableHead>
                <TableHead>{t("condition")}</TableHead>
                <TableHead>{t("assignedAgent")}</TableHead>
                <TableHead>{t("action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    {t("loading")}
                  </TableCell>
                </TableRow>
              ) : (
                patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.date_of_birth}</TableCell>
                    <TableCell>{patient.condition}</TableCell>
                    <TableCell>{patient.assigned_agent}</TableCell>
                    <TableCell>
                      <Link href={`/dashboard/patients/${patient.id}`}>
                        <Button variant="outline" size="sm">
                          {t("viewDetails")}
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
