/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"

export type Locale = "en" | "fr"

type I18NContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const I18NContext = createContext<I18NContextType | undefined>(undefined)

export const useI18N = () => {
  const context = useContext(I18NContext)
  if (context === undefined) {
    throw new Error("useI18N must be used within an I18NProvider")
  }
  return context
}

type I18NProviderProps = {
  children: React.ReactNode
}

export const I18NProvider: React.FC<I18NProviderProps> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>("en")
  const router = useRouter()

  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale;
    if (savedLocale && (savedLocale === "en" || savedLocale === "fr")) {
      setLocale(savedLocale);
    } else {
      setLocale("en");
      localStorage.setItem("locale", "en");
    }
  }, []);

  const changeLocale = useCallback((newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem("locale", newLocale);
    router.refresh(); // Refresh content without modifying URL
  }, [router]);

  const t = useCallback(
    (key: string): string => {
      const translations: Record<Locale, Record<string, any>> = {
        en: {
          // Dashboard
          dashboard: "Dashboard",
          patientsFollowed: "Patients Followed",
          alerts: "Alerts",
          aiAgents: "AI Agents",
          viewAllPatients: "View all patients",
          manageAlerts: "Manage alerts",
          manageAgents: "Manage agents",
          phoneConversations: "Phone Conversations",
          patient: "Patient",
          agent: "Agent",
          duration: "Duration",
          status: "Status",
          action: "Action",
          details: "Details",
          ongoing: "Ongoing",
          completed: "Completed",
          viewAllConversations: "View all conversations",
          patientsIncrease: "+2 since last week",
          highPriorityAlerts: "2 high priority",
          allAgentsActive: "All active",
          last24Hours: "Last 24 hours",
          recentActivity: "Recent Activity",
          alertId: "Alert ID",
          alertType: "Alert Type",
          severity: "Severity",
          // assignNewPatient: "Assign New Patient",
          usePreset: "Use a preset",
          createFromScratch: "Create from scratch",
          doctorSignUp: "Doctor Sign Up",

          // Agents
          backToAgents: "Back to Agents",
          createNewAgent: "Create New AI Agent",
          agentInformation: "Agent Information",
          agentName: "Agent Name",
          agentType: "Agent Type",
          selectAgentType: "Select agent type",
          specialized: "Specialized",
          general: "General",
          description: "Description",
          capabilities: "Capabilities",
          onePerLine: "one per line",
          createAgent: "Create Agent",
          agentDetails: "Agent Details",
          assignedPatients: "Assigned Patients",
          callsMade: "Calls Made",
          recentActivities: "Recent Activities",
          agentStatistics: "Agent Statistics",
          alertMapping: "Alert Mapping",
          selectTimeRange: "Select time range",
          lastWeek: "Last Week",
          lastMonth: "Last Month",
          yourAIAgents: "Your AI Agents",
          viewAllAgents: "View all agents",
          patients: "Patients",
          alertsToday: "alerts today",
          viewDetails: "View details",
          agents: {
            backToAgents: "Back to Agents",
            agentDetails: "Agent Details",
            agentType: "Agent Type",
            description: "Description",
            capabilities: "Capabilities",
            agentStatistics: "Agent Statistics",
            assignedPatients: "Assigned Patients",
            callsMade: "Calls Made",
            alertMapping: "Alert Mapping",
            recentActivities: "Recent Activities",
            activityType: {
              Call: "Call",
              Alert: "Alert",
              Update: "Update",
            },
            lastWeek: "Last Week",
          },

          // Patients
          gender: "Gender",
          selectGender: "Select gender",
          contactNumber: "Contact Number",
          email: "Email",
          address: "Address",
          medicalHistory: "Medical History",
          name: "Name",
          dateOfBirth: "Date of Birth",
          condition: "Condition",
          assignedAgent: "Assigned Agent",
          addNewPatient: "Add New Patient",
          patientsList: "Patients List",
          male: "Male",
          female: "Female",
          other: "Other",
          createPatient: "Create Patient",

          // Calls
          backToCallList: "Back to Call List",
          callDetails: "Call Details",
          callInformation: "Call Information",
          callTranscript: "Call Transcript",
          callSummary: "Call Summary",
          downloadTranscript: "Download Transcript",
          scheduleFollowUp: "Schedule Follow-up",
          recentCalls: "Recent Calls",

          // Alerts
          backToAlerts: "Back to Alerts",
          alertDetails: "Alert Details",
          alertInformation: "Alert Information",
          vitalSigns: "Vital Signs",
          bloodPressure: "Blood Pressure",
          heartRate: "Heart Rate",
          temperature: "Temperature",
          recommendedActions: "Recommended Actions",
          markAsResolved: "Mark as Resolved",
          contactPatient: "Contact Patient",
          activeAlerts: "Active Alerts",

          // Landing
          login: "Log In",
          heroTitle: "AI-Powered Post-Hospital Care",
          heroSubtitle: "Revolutionizing patient follow-up with intelligent AI agents",
          getStarted: "Get Started",
          intelligentAIAgents: "Intelligent AI Agents",
          intelligentAIAgentsDesc: "Specialized virtual assistants for each type of follow-up",
          customizedAI: "Customized AI",
          customizedAIDesc: "Tailored solutions for your specific medical practice",
          maximumSecurity: "Maximum Security",
          maximumSecurityDesc: "HIPAA-compliant data protection and privacy",
          efficientCollaboration: "Efficient Collaboration",
          efficientCollaborationDesc: "Seamless communication between medical teams",
          readyToStart: "Ready to Transform Your Post-Operative Care?",
          readyToStartDesc: "Join Agentic CareGivers and experience the future of patient care",
          createAccount: "Create Your Account",
          allRightsReserved: "All rights reserved.",
          areYouADoctor: "Are you a doctor?",
          aiAgentType: "AI Agent Type...",
          medicalSpecialty: "Medical Specialty...",
          activeAgent: "Active Agent",
          "247Monitoring": "24/7 Monitoring",
          valueProposition: "Agentic CareGivers: Innovation at the service of patients",
          continuousMonitoring: "Continuous Monitoring",
          continuousMonitoringDesc: "24/7 patient monitoring for timely interventions",
          proactiveAlerts: "Proactive Alerts",
          proactiveAlertsDesc: "Early warning system for potential health issues",

          // Login
          backToHome: "Back to Home",
          doctorLogin: "Doctor Login",
          emailPlaceholder: "doctor@example.com",
          password: "Password",
          needAccount: "Need an account?",
          passwordRequirements: "At least 6 characters",

          // Common
          backToDashboard: "Back to Dashboard",
          assignNewPatient: "Assign New Patient",
          lastContact: "Last Contact",
          date: "Date",
          type: "Type",
          loading: "Loading...",
          logout: "Logout",
          searchPatients: "Search patients...",

          // Status and Severity
          high: "High",
          medium: "Medium",
          low: "Low",
          open: "Open",
          resolved: "Resolved",
          stable: "Stable",
          needsAttention: "Needs Attention",
          critical: "Critical",
        },
        fr: {
          // Dashboard
          dashboard: "Tableau de Bord",
          patientsFollowed: "Patients suivis",
          alerts: "Alertes",
          aiAgents: "Agents IA",
          viewAllPatients: "Voir tous les patients",
          manageAlerts: "Gérer les alertes",
          manageAgents: "Gérer les agents",
          phoneConversations: "Conversations Téléphoniques",
          patient: "Patient",
          agent: "Agent",
          duration: "Durée",
          status: "Statut",
          action: "Action",
          details: "Détails",
          ongoing: "En cours",
          completed: "Terminé",
          viewAllConversations: "Voir toutes les conversations",
          patientsIncrease: "+2 depuis la semaine dernière",
          highPriorityAlerts: "2 haute priorité",
          allAgentsActive: "Tous actifs",
          last24Hours: "Dernières 24 heures",
          recentActivity: "Activité Récente",
          alertId: "ID d'Alerte",
          alertType: "Type d'Alerte",
          severity: "Gravité",
          // assignNewPatient: "Assigner un Nouveau Patient",
          usePreset: "Utiliser un préréglage",
          createFromScratch: "Créer à partir de zéro",
          doctorSignUp: "Inscription Médecin",

          // Agents
          backToAgents: "Retour aux Agents",
          createNewAgent: "Créer un Nouvel Agent IA",
          agentInformation: "Informations sur l'Agent",
          agentName: "Nom de l'Agent",
          agentType: "Type d'Agent",
          selectAgentType: "Sélectionnez le type d'agent",
          specialized: "Spécialisé",
          general: "Général",
          description: "Description",
          capabilities: "Capacités",
          onePerLine: "une par ligne",
          createAgent: "Créer l'Agent",
          agentDetails: "Détails de l'Agent",
          assignedPatients: "Patients Assignés",
          callsMade: "Appels Effectués",
          recentActivities: "Activités Récentes",
          agentStatistics: "Statistiques de l'Agent",
          alertMapping: "Cartographie des Alertes",
          selectTimeRange: "Sélectionner la période",
          lastWeek: "Semaine Dernière",
          lastMonth: "Mois Dernier",
          yourAIAgents: "Vos Agents IA",
          viewAllAgents: "Voir tous les agents",
          patients: "Patients",
          alertsToday: "alertes aujourd'hui",
          viewDetails: "Voir les détails",
          agents: {
            backToAgents: "Retour aux Agents",
            agentDetails: "Détails de l'Agent",
            agentType: "Type d'Agent",
            description: "Description",
            capabilities: "Capacités",
            agentStatistics: "Statistiques de l'Agent",
            assignedPatients: "Patients Assignés",
            callsMade: "Appels Effectués",
            alertMapping: "Cartographie des Alertes",
            recentActivities: "Activités Récentes",
            activityType: {
              Call: "Appel",
              Alert: "Alerte",
              Update: "Mise à jour",
            },
            lastWeek: "Semaine Dernière",
          },

          // Patients
          gender: "Genre",
          selectGender: "Sélectionnez le genre",
          contactNumber: "Numéro de contact",
          email: "Adresse e-mail",
          address: "Adresse",
          medicalHistory: "Antécédents médicaux",
          name: "Nom",
          dateOfBirth: "Date de Naissance",
          condition: "Condition",
          assignedAgent: "Agent Assigné",
          addNewPatient: "Ajouter un Nouveau Patient",
          patientsList: "Liste des Patients",
          male: "Homme",
          female: "Femme",
          other: "Autre",
          createPatient: "Créer le Patient",

          // Calls
          backToCallList: "Retour à la Liste des Appels",
          callDetails: "Détails de l'Appel",
          callInformation: "Informations sur l'Appel",
          callTranscript: "Transcription de l'Appel",
          callSummary: "Résumé de l'Appel",
          downloadTranscript: "Télécharger la Transcription",
          scheduleFollowUp: "Planifier un Suivi",
          recentCalls: "Appels Récents",

          // Alerts
          backToAlerts: "Back to Alerts",
          alertDetails: "Alert Details",
          alertInformation: "Alert Information",
          vitalSigns: "Vital Signs",
          bloodPressure: "Blood Pressure",
          heartRate: "Heart Rate",
          temperature: "Temperature",
          recommendedActions: "Recommended Actions",
          markAsResolved: "Mark as Resolved",
          contactPatient: "Contact Patient",
          activeAlerts: "Active Alerts",
          // Landing
          login: "Connexion",
          heroTitle: "Suivi post-hospitalisation Assistés par IA",
          heroSubtitle: "Révolutionner le suivi des patients avec des agents IA intelligents",
          getStarted: "Commencer",
          intelligentAIAgents: "Agents IA Intelligents",
          intelligentAIAgentsDesc: "Assistants virtuels spécialisés pour chaque type de suivi",
          customizedAI: "IA Personnalisée",
          customizedAIDesc: "Solutions sur mesure pour votre pratique médicale spécifique",
          maximumSecurity: "Sécurité Maximale",
          maximumSecurityDesc: "Protection des données et confidentialité conformes à HIPAA",
          efficientCollaboration: "Collaboration Efficace",
          efficientCollaborationDesc: "Communication fluide entre les équipes médicales",
          readyToStart: "Prêt à Transformer Vos Soins Post-Opératoires ?",
          readyToStartDesc: "Rejoignez Agentic CareGivers et découvrez l'avenir des soins aux patients",
          createAccount: "Créez Votre Compte",
          allRightsReserved: "Tous droits réservés.",
          areYouADoctor: "Êtes-vous médecin ?",
          aiAgentType: "Type d'agent IA...",
          medicalSpecialty: "Spécialité médicale...",
          activeAgent: "Agent Actif",
          "247Monitoring": "Surveillance 24/7",
          valueProposition: "Agentic CareGivers : L'innovation au service des patients",
          continuousMonitoring: "Surveillance Continue",
          continuousMonitoringDesc: "Suivi des patients 24h/24 et 7j/7 pour des interventions rapides",
          proactiveAlerts: "Alertes Proactives",
          proactiveAlertsDesc: "Système d'alerte précoce pour les problèmes de santé potentiels",

          // Login
          backToHome: "Retour à l'Accueil",
          doctorLogin: "Connexion Médecin",
          emailPlaceholder: "docteur@exemple.com",
          password: "Mot de passe",
          needAccount: "Besoin d'un compte ?",
          passwordRequirements: "Au moins 6 caractères",

          // Common
          backToDashboard: "Retour au Tableau de Bord",
          assignNewPatient: "Assigner un Nouveau Patient",
          lastContact: "Dernier Contact",
          date: "Date",
          type: "Type",
          loading: "Chargement...",
          logout: "Déconnexion",
          searchPatients: "Rechercher des patients...",

          // Status and Severity
          high: "Élevée",
          medium: "Moyenne",
          low: "Faible",
          open: "Ouverte",
          resolved: "Résolue",
          stable: "Stable",
          needsAttention: "Nécessite Attention",
          critical: "Critique",
        },
      }

      const keys = key.split(".")
      let value: any = translations[locale]
      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k]
        } else {
          return key // Return the key if translation is not found
        }
      }
      return typeof value === "string" ? value : key
    },
    [locale],
  )

  return (
    <I18NContext.Provider value={{ locale, setLocale: changeLocale, t }}>
      {children}
    </I18NContext.Provider>
  );
}

