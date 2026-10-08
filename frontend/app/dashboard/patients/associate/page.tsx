/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, User, Bot, FileText, Shield } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Patient = {
  id: string
  name: string
  dateOfBirth: string
}

type Agent = {
  id: string
  name: string
  type: string
}

// Mock function to fetch patients (in a real app, this would be an API call)
const fetchPatients = (): Patient[] => [
  { id: "P001", name: "John Doe", dateOfBirth: "1980-05-15" },
  { id: "P002", name: "Jane Smith", dateOfBirth: "1992-11-23" },
  { id: "P003", name: "Alice Johnson", dateOfBirth: "1975-08-30" },
]

// Mock function to fetch agents (in a real app, this would be an API call)
const fetchAgents = (): Agent[] => [
  { id: "A001", name: "Cardiac Care Specialist", type: "Specialized" },
  { id: "A002", name: "General Recovery Assistant", type: "General" },
  { id: "A003", name: "Mental Health Support", type: "Specialized" },
]

const DraggableItem = ({ item, type }: { item: Patient | Agent; type: string }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { id: item.id, type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          ref={drag as unknown as React.Ref<HTMLDivElement>}
          className={`p-4 mb-2 bg-white rounded-lg shadow cursor-move ${isDragging ? "opacity-50" : "opacity-100"}`}
        >
          <div className="flex items-center">
            {type === "patient" ? (
              <User className="mr-2 h-5 w-5 text-blue-500" />
            ) : (
              <Bot className="mr-2 h-5 w-5 text-green-500" />
            )}
            <span>{item.name}</span>
          </div>
          {type === "patient" && <div className="text-sm text-gray-500">DoB: {(item as Patient).dateOfBirth}</div>}
          {type === "agent" && <div className="text-sm text-gray-500">Type: {(item as Agent).type}</div>}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{item.name}</h4>
            {type === "patient" && (
              <>
                <p className="text-sm text-muted-foreground">Date of Birth: {(item as Patient).dateOfBirth}</p>
                <p className="text-sm text-muted-foreground">Patient ID: {item.id}</p>
              </>
            )}
            {type === "agent" && (
              <>
                <p className="text-sm text-muted-foreground">Type: {(item as Agent).type}</p>
                <p className="text-sm text-muted-foreground">Agent ID: {item.id}</p>
              </>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

const DropZone = ({ onDrop, type }: { onDrop: (item: any) => void; type: string }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: type,
    drop: (item: any) => onDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  return (
    <div
      ref={drop as unknown as React.Ref<HTMLDivElement>}
      className={`border-2 border-dashed rounded-lg p-4 ${isOver ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
    >
      <p className="text-center text-gray-500">Drop {type === "patient" ? "patient" : "agent"} here</p>
    </div>
  )
}

const FileDropZone = ({ onFileDrop }: { onFileDrop: (file: File) => void }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "file",
    drop: (item: any) => onFileDrop(item.files[0]),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    onFileDrop(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileDrop(file)
    }
  }

  return (
    <div
      ref={drop as unknown as React.Ref<HTMLDivElement>}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 ${isOver ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
    >
      <p className="text-center text-gray-500">Drag and drop medical record file here</p>
      
      {/* Clickable file input */}
      <div className="text-center mt-4">
        <label
          htmlFor="file-upload"
          className="cursor-pointer text-blue-500 hover:underline"
        >
          Or click to select a file
        </label>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  )
}


export default function AssociatePatient() {
  const router = useRouter()
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [medicalRecordFile, setMedicalRecordFile] = useState<File | null>(null)
  const [callFrequency, setCallFrequency] = useState<string>("")

  const patients = fetchPatients()
  const agents = fetchAgents()

  const handlePatientDrop = useCallback(
    (item: Patient) => {
      setSelectedPatient(patients.find((p) => p.id === item.id) || null)
    },
    [patients],
  )

  const handleAgentDrop = useCallback(
    (item: Agent) => {
      setSelectedAgent(agents.find((a) => a.id === item.id) || null)
    },
    [agents],
  )

  const handleFileDrop = useCallback((file: File) => {
    setMedicalRecordFile(file)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient || !selectedAgent || !medicalRecordFile || !callFrequency) {
        alert("Please fill out all fields before submitting.");
        return;
    }

    try {
        const formData = new FormData();
        formData.append('userId', selectedPatient.id);  // Assuming patient ID is used as userId
        formData.append('userName', selectedPatient.name);
        formData.append('text', `Patient ${selectedPatient.name} is now associated with agent ${selectedAgent.name}`);
        if (medicalRecordFile) {
            formData.append('file', medicalRecordFile);
        }

        // Call your backend API to send data to the agent message API
        const response = await fetch(`/api/message/${selectedAgent.id}`, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            console.log('Association successful');
            router.push("/dashboard/patients");
        } else {
            const errorData = await response.json();
            alert(errorData.error || "An error occurred");
        }
    } catch (error) {
        console.error("Error associating patient with agent:", error);
    }
};


  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto px-4 py-8">
        <Link href="/dashboard/patients" className="flex items-center mb-4 text-blue-500 hover:underline">
          <ArrowLeft className="mr-2" />
          Back to patients list
        </Link>
        <h1 className="text-3xl font-bold mb-8">Associate Patient with AI Agent</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Patients</CardTitle>
            </CardHeader>
            <CardContent>
              {patients.map((patient) => (
                <DraggableItem key={patient.id} item={patient} type="patient" />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Agents</CardTitle>
            </CardHeader>
            <CardContent>
              {agents.map((agent) => (
                <DraggableItem key={agent.id} item={agent} type="agent" />
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Selected Patient</CardTitle>
            </CardHeader>
            <CardContent>
              <DropZone onDrop={handlePatientDrop} type="patient" />
              {selectedPatient && (
                <div className="mt-4">
                  <h3 className="font-semibold">{selectedPatient.name}</h3>
                  <p className="text-sm text-gray-500">DoB: {selectedPatient.dateOfBirth}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Selected AI Agent</CardTitle>
            </CardHeader>
            <CardContent>
              <DropZone onDrop={handleAgentDrop} type="agent" />
              {selectedAgent && (
                <div className="mt-4">
                  <h3 className="font-semibold">{selectedAgent.name}</h3>
                  <p className="text-sm text-gray-500">Type: {selectedAgent.type}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Call Frequency</CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={setCallFrequency} value={callFrequency}>
              <SelectTrigger>
                <SelectValue placeholder="Select call frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Medical Record</CardTitle>
          </CardHeader>
          <CardContent>
            <FileDropZone onFileDrop={handleFileDrop} />
            {medicalRecordFile && <p className="mt-4 text-sm text-gray-600">File selected: {medicalRecordFile.name}</p>}
          </CardContent>
        </Card>

        <div className="mt-8">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
            <div className="flex">
              <div className="py-1">
                <Shield className="h-6 w-6 text-yellow-500 mr-4" />
              </div>
              <div>
                <p className="font-bold">Privacy Notice</p>
                <p className="text-sm">
                  Ensure you have the patient&apos;s consent before sharing their medical information. All data shared with
                  the AI Agent is encrypted and handled in compliance with HIPAA regulations.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={!selectedPatient || !selectedAgent || !medicalRecordFile || !callFrequency}
          >
            <FileText className="mr-2 h-4 w-4" />
            Associate Patient and Share Record
          </Button>
        </div>
      </div>
    </DndProvider>
  )
}

