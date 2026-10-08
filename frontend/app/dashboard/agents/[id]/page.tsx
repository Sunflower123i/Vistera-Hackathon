"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bot, Brain, Users, Activity, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useI18N } from "@/lib/i18n";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { useAuth } from "@/lib/AuthContext";
import { UUID } from "crypto";

type Agent = {
  id: UUID;
  name: string;
  type: string;
  description: string;
  capabilities: string[];
  assignedPatients: number;
  callsMade: number;
};

type Patient = {
  id: UUID;
  name: string;
  dateOfBirth: string;
  lastContact: string;
  status: "Stable" | "Needs Attention" | "Critical";
};

type Activity = {
  id: string;
  type: "Call" | "Alert" | "Update";
  description: string;
  date: string;
  patientName: string;
};

type Alert = {
  id: string;
  patientName: string;
  type: string;
  severity: "Low" | "Medium" | "High";
  status: "Open" | "Resolved";
};

const AgentStatisticsCard = ({ assignedPatients, callsMade }: { assignedPatients: number, callsMade: number }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">
        <Activity className="mr-2 h-5 w-5 text-green-500" />
        Agent Statistics
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-2xl font-bold">{assignedPatients}</p>
          <p className="text-sm text-gray-500">Assigned Patients</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{callsMade}</p>
          <p className="text-sm text-gray-500">Calls Made</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const PatientTable = ({ patients, router, t }: { patients: Patient[], router: any, t: any }) => (
  <Card className="mb-8 shadow-lg">
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="mr-2 h-5 w-5 text-blue-500" />
          <span className="text-lg font-semibold">{t("assignedPatients")}</span>
        </div>
        <Button
          onClick={() => router.push("/dashboard/patients/associate")}
          className="bg-blue-500 text-white hover:bg-blue-600"
        >
          {t("assignNewPatient")}
        </Button>
      </CardTitle>
    </CardHeader>
    <CardContent className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">{t("name")}</TableHead>
            <TableHead className="text-left">{t("dateOfBirth")}</TableHead>
            <TableHead className="text-left">{t("lastContact")}</TableHead>
            <TableHead className="text-left">{t("status")}</TableHead>
            <TableHead className="text-left">{t("action")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id} className="hover:bg-gray-50 transition-all">
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.dateOfBirth}</TableCell>
              <TableCell>{patient.lastContact}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    patient.status === "Stable"
                      ? "bg-green-200 text-green-800"
                      : patient.status === "Needs Attention"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {t(`patients.status.${patient.status}`)}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/dashboard/patients/${patient.id}`)}
                  className="text-blue-500 hover:bg-blue-100"
                >
                  {t("viewDetails")}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);


const AlertTable = ({ alerts, router, t }: { alerts: Alert[], router: any, t: any }) => (
  <Card className="mb-8 shadow-lg">
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
          <span className="text-lg font-semibold">{t("alertMapping")}</span>
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">{t("alertId")}</TableHead>
            <TableHead className="text-left">{t("name")}</TableHead>
            <TableHead className="text-left">{t("alertType")}</TableHead>
            <TableHead className="text-left">{t("severity")}</TableHead>
            <TableHead className="text-left">{t("status")}</TableHead>
            <TableHead className="text-left">{t("action")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.map((alert) => (
            <TableRow key={alert.id} className="hover:bg-gray-50 transition-all">
              <TableCell>{alert.id}</TableCell>
              <TableCell>{alert.patientName}</TableCell>
              <TableCell>{alert.type}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    alert.severity === "Low"
                      ? "bg-green-200 text-green-800"
                      : alert.severity === "Medium"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {t(`common.severity.${alert.severity}`)}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    alert.status === "Open" ? "bg-blue-200 text-blue-800" : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {t(`common.status.${alert.status}`)}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/dashboard/alerts/${alert.id}`)}
                  className="text-blue-500 hover:bg-blue-100"
                >
                  {t("viewDetails")}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);


export default function AgentDetailsPage() {
  const router = useRouter();
  const { t } = useI18N();
  const { id } = useParams();
  const { getUserId } = useAuth();

  const [agent, setAgent] = useState<Agent | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("week");

  useEffect(() => {
    const fetchAgentData = async () => {
      setLoading(true);  // Set loading to true initially
      const supabase = createBrowserSupabaseClient();
      const userID = await getUserId() as UUID;
  
      try {
        const { data: agentData, error: agentError } = await supabase
          .from("agents")
          .select("*")
          .eq("docuuid", userID)
          .eq("id", id)
          .single();
  
        if (agentError) throw new Error(agentError.message);
  
        if (agentData) {
          setAgent(agentData);
        }
  
        const { data: patientsData } = await supabase
          .from("patients")
          .select("*")
          .eq("assignedAgentId", id);
  
        setPatients(patientsData || []);
  
        const { data: activitiesData } = await supabase
          .from("activities")
          .select("*")
          .eq("agentId", id);
  
        setActivities(activitiesData || []);
  
        const { data: alertsData } = await supabase
          .from("alerts")
          .select("*")
          .eq("agentId", id);
  
        setAlerts(alertsData || []);
      } catch (error) {
        console.error("Error fetching agent data:", error);
      } finally {
        setLoading(false);  // Set loading to false after fetching data
      }
    };
  
    if (id) {
      fetchAgentData();
    }
  }, [id, getUserId]);
  

  // if (loading) {
  //   return <div className="container mx-auto px-4 py-8">Loading...</div>;
  // }

  if (!agent) {
    return <div className="container mx-auto px-4 py-8">Error fetching agent data.</div>;
  }


    return (
      <div className="container mx-auto px-8 py-12">
        <Link href="/dashboard/agents" className="flex items-center mb-6 text-blue-500 hover:underline">
          <ArrowLeft className="mr-2" />
          {t("backToAgents")}
        </Link>
        <h1 className="text-4xl font-bold mb-10 flex items-center space-x-4">
          <Bot className="h-8 w-8 text-blue-500" />
          <span>{agent.name}</span>
        </h1>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <Card className="space-y-6 p-6">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-semibold">
                <Brain className="mr-3 h-6 w-6 text-blue-500" />
                {t("agentDetails")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>{t("agentType")}:</strong> {agent.type}
              </p>
              <p>
                <strong>{t("description")}:</strong> {agent.description}
              </p>
              <div>
                <strong>{t("capabilities")}:</strong>
                <ul className="list-disc list-inside space-y-2">
                  {(agent.capabilities || []).map((capability, index) => (
                    <li key={index}>{capability}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
  
          <AgentStatisticsCard assignedPatients={agent.assignedPatients} callsMade={agent.callsMade} />
        </div>
  
        <PatientTable patients={patients} router={router} t={t} />
        <AlertTable alerts={alerts} router={router} t={t} />
      </div>
  );
}
