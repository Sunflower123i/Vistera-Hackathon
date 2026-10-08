"use client"

// Import the CSS for react-phone-number-input
import "react-phone-number-input/style.css"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import PhoneInput from "react-phone-number-input"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, UserPlus } from "lucide-react"
import { useI18N } from "@/lib/i18n"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { useAuth } from "@/lib/AuthContext"

export default function AddPatient() {
  const router = useRouter()
  const { t } = useI18N()
  const supabase = createBrowserSupabaseClient()
  const { getUserId } = useAuth()

  const [userID, setUserID] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserID = async () => {
      const id = await getUserId()
      setUserID(id)
    }

    fetchUserID()
  }, [getUserId])

  const [patient, setPatient] = useState({
    name: "",
    dateOfBirth: "",
    gender: "",
    contactNumber: "",
    email: "",
    address: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPatient((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setPatient((prev) => ({ ...prev, gender: value }))
  }

  const handlePhoneChange = (value: string | undefined) => {
    setPatient((prev) => ({ ...prev, contactNumber: value || "" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from("patients")
      .insert([{
        docuuid: userID,
        name: patient.name,
        date_of_birth: patient.dateOfBirth,
        gender: patient.gender,
        contact_number: patient.contactNumber,
        email: patient.email,
        address: patient.address,
      }])

    if (error) {
      console.error("Error adding patient:", error.message)
      setError(error.message)
    } else {
      console.log("Patient created:", data)
      router.push("/dashboard/patients") // Redirect to patients list
    }

    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/dashboard/patients" className="flex items-center mb-4 text-blue-500 hover:underline">
        <ArrowLeft className="mr-2" />
        {t("backToPatientsList")}
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center">
            <UserPlus className="mr-2" />
            {t("addNewPatient")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">{t("name")}</Label>
                <Input id="name" name="name" value={patient.name} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">{t("dateOfBirth")}</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={patient.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="gender">{t("gender")}</Label>
                <Select onValueChange={handleSelectChange} value={patient.gender}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectGender")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t("male")}</SelectItem>
                    <SelectItem value="female">{t("female")}</SelectItem>
                    <SelectItem value="other">{t("other")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="contactNumber">{t("contactNumber")}</Label>
                <PhoneInput
                  international
                  countryCallingCodeEditable={false}
                  defaultCountry="US"
                  value={patient.contactNumber}
                  onChange={handlePhoneChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div>
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={patient.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address">{t("address")}</Label>
              <Textarea
                id="address"
                name="address"
                value={patient.address}
                onChange={handleInputChange}
                rows={3}
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? t("creatingPatient") : t("createPatient")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
