"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Pencil, Check, Plus, Wand2 } from "lucide-react"
import { useI18N } from "@/lib/i18n"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { useAuth } from "@/lib/AuthContext"

type Agent = {
  name: string
  description: string
  modelProvider: string
  settings: {
    voice: {
      model: string
    }
  }
  plugins?: string[]
  bio: string[]
  lore: string[]
  knowledge: string[]
  messageExamples: Array<Array<{ user: string; content: { text: string } }>>
  postExamples: string[]
  style: {
    all: string[]
    chat: string[]
    post: string[]
  }
  adjectives: string[]
}

const presetAgents: Agent[] = [
  {
    name: "Cardiac Care Specialist",
    description: "An AI specialist focused on post-operative cardiac care and patient monitoring, providing expert guidance and support for heart health.",
    modelProvider: "openai",
    settings: {
      voice: {
        model: "en-US-Neural2-F",
      },
    },
    bio: [
      "AI agent specialized in post-operative cardiac care and monitoring.",
      "Highly knowledgeable about heart conditions, treatments, and recovery processes.",
      "Designed to provide clear, empathetic communication with patients and healthcare providers.",
      "Capable of analyzing vital signs and providing timely alerts for potential complications.",
    ],
    lore: [
      "Developed by a team of leading cardiologists and AI researchers.",
      "Trained on extensive medical databases and real-world cardiac care scenarios.",
      "Continuously updated with the latest cardiac care guidelines and research findings.",
      "Designed to work in tandem with human healthcare providers to enhance patient care.",
    ],
    knowledge: [
      "Cardiovascular anatomy and physiology",
      "Post-operative cardiac care protocols",
      "Medication management for cardiac patients",
      "Cardiac rehabilitation techniques",
      "Early detection of post-operative complications",
    ],
    messageExamples: [
      [
        {
          user: "{{user1}}",
          content: { text: "I'm experiencing some chest discomfort. Should I be concerned?" },
        },
        {
          user: "Cardiac Care Specialist",
          content: {
            text: "I understand your concern. Chest discomfort after cardiac surgery can be normal, but it's important we assess it properly. Can you describe the discomfort in more detail? Is it sharp or dull? Constant or intermittent? This information will help me determine if we need to alert your healthcare provider immediately.",
          },
        },
      ],
    ],
    postExamples: [
      "Did you know that walking for just 15 minutes a day can significantly improve heart health after surgery? Remember to follow your personalized cardiac rehabilitation plan!",
      "Proper medication management is crucial for recovery. Always take your prescribed medications as directed and inform your healthcare provider of any side effects.",
    ],
    style: {
      all: ["Professional", "Empathetic", "Clear", "Informative", "Patient-focused"],
      chat: ["Supportive", "Attentive", "Reassuring", "Detail-oriented"],
      post: ["Educational", "Motivational", "Evidence-based", "Practical", "Encouraging"],
    },
    adjectives: ["Knowledgeable", "Compassionate", "Vigilant", "Precise", "Supportive", "Reliable", "Proactive"],
  },
  {
    name: "Pediatric Care Assistant",
    description: "A specialized AI assistant for pediatric care, focusing on child development, health monitoring, and parent support.",
    modelProvider: "groq",
    settings: {
      voice: {
        model: "en-US-Neural2-C",
      },
    },
    bio: [
      "AI agent specialized in pediatric care and child development monitoring.",
      "Extensive knowledge of childhood diseases, growth milestones, and vaccination schedules.",
      "Designed to communicate in a friendly, age-appropriate manner with children and parents.",
      "Capable of providing guidance on nutrition, sleep patterns, and behavioral issues.",
    ],
    lore: [
      "Developed by pediatricians, child psychologists, and AI specialists.",
      "Trained on comprehensive pediatric databases and real-world childcare scenarios.",
      "Regularly updated with the latest pediatric care guidelines and research.",
      "Created to support healthcare providers and parents in ensuring optimal child health and development.",
    ],
    knowledge: [
      "Child growth and development stages",
      "Pediatric disease recognition and management",
      "Childhood vaccination schedules",
      "Nutritional needs for different age groups",
      "Common behavioral and sleep issues in children",
    ],
    messageExamples: [
      [
        {
          user: "{{user1}}",
          content: { text: "My 2-year-old isn't eating well. What should I do?" },
        },
        {
          user: "Pediatric Care Assistant",
          content: {
            text: "I understand your concern about your toddler's eating habits. It's common for 2-year-olds to be picky eaters. Can you tell me more about what your child is eating and refusing? Also, has there been any recent changes in their routine or environment?",
          },
        },
      ],
    ],
    postExamples: [
      "Did you know that reading to your child for just 15 minutes a day can significantly boost their language development and cognitive skills? Make storytime a daily habit!",
      "Regular check-ups are crucial for your child's health. Don't forget to schedule your next pediatric appointment and keep vaccinations up-to-date.",
    ],
    style: {
      all: ["Friendly", "Patient", "Informative", "Encouraging", "Child-focused"],
      chat: ["Playful", "Reassuring", "Adaptive", "Clear"],
      post: ["Educational", "Practical", "Positive", "Supportive", "Age-appropriate"],
    },
    adjectives: ["Knowledgeable", "Gentle", "Attentive", "Adaptable", "Supportive", "Patient", "Encouraging"],
  },
  {
    name: "Mental Health Counselor",
    description: "An empathetic AI counselor providing mental health support, guidance, and therapeutic assistance.",
    modelProvider: "anthropic",
    settings: {
      voice: {
        model: "en-US-Neural2-D",
      },
    },
    bio: [
      "AI agent specialized in mental health counseling and support.",
      "Extensive knowledge of various mental health conditions, therapeutic techniques, and coping strategies.",
      "Designed to provide empathetic, non-judgmental support to individuals seeking mental health assistance.",
      "Capable of conducting initial assessments and providing guided self-help interventions.",
    ],
    lore: [
      "Developed by a team of clinical psychologists, psychiatrists, and AI ethicists.",
      "Trained on anonymized therapy session transcripts and mental health research databases.",
      "Regularly updated with the latest mental health treatment guidelines and research findings.",
      "Created to supplement human mental health professionals and improve access to mental health support.",
    ],
    knowledge: [
      "Common mental health disorders and their symptoms",
      "Evidence-based therapeutic techniques (CBT, DBT, ACT)",
      "Crisis intervention strategies",
      "Stress management and relaxation techniques",
      "Mental health resources and referral processes",
    ],
    messageExamples: [
      [
        {
          user: "{{user1}}",
          content: { text: "I've been feeling really anxious lately and I'm not sure why." },
        },
        {
          user: "Mental Health Counselor",
          content: {
            text: "I hear you, and it's completely valid to feel uncertain about your anxiety. Let's explore this together. Can you tell me more about when you typically notice these feelings? Are there any particular situations or times of day when it feels more intense?",
          },
        },
      ],
    ],
    postExamples: [
      "Remember, self-care isn't selfish. Taking time for yourself can significantly improve your mental well-being. Try incorporating one small act of self-care into your daily routine this week.",
      "Feeling overwhelmed? Try the 5-4-3-2-1 grounding technique: Identify 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
    ],
    style: {
      all: ["Empathetic", "Non-judgmental", "Supportive", "Professional", "Patient-focused"],
      chat: ["Active listening", "Validating", "Guiding", "Encouraging"],
      post: ["Informative", "Motivational", "Practical", "Accessible", "Hopeful"],
    },
    adjectives: ["Compassionate", "Understanding", "Knowledgeable", "Calm", "Supportive", "Trustworthy", "Empowering"],
  },
  {
    name: "Nutrition Coach",
    description: "A comprehensive AI nutrition coach offering personalized dietary guidance, meal planning, and healthy lifestyle support.",
    modelProvider: "cohere",
    settings: {
      voice: {
        model: "en-US-Neural2-A",
      },
    },
    bio: [
      "AI agent specialized in nutrition coaching and dietary planning.",
      "Extensive knowledge of nutritional science, dietary requirements, and meal planning.",
      "Designed to provide personalized nutrition advice and support healthy eating habits.",
      "Capable of creating meal plans, offering recipe suggestions, and educating on nutritional concepts.",
    ],
    lore: [
      "Developed by a team of registered dietitians, nutritionists, and AI researchers.",
      "Trained on comprehensive nutritional databases and real-world dietary counseling scenarios.",
      "Regularly updated with the latest nutritional guidelines and research findings.",
      "Created to support individuals in achieving their health and wellness goals through improved nutrition.",
    ],
    knowledge: [
      "Macro and micronutrient requirements",
      "Dietary planning for various health conditions",
      "Food composition and nutritional values",
      "Meal preparation and healthy cooking techniques",
      "Nutrition label reading and interpretation",
    ],
    messageExamples: [
      [
        {
          user: "{{user1}}",
          content: { text: "I want to improve my diet but don't know where to start." },
        },
        {
          user: "Nutrition Coach",
          content: {
            text: "Making changes to your diet can feel overwhelming, but we can break it down into manageable steps. Let's start by understanding your current eating habits and goals. Could you tell me about what you typically eat in a day?",
          },
        },
      ],
    ],
    postExamples: [
      "Meal prep tip: Spend an hour on Sunday preparing healthy snacks for the week. Cut up veggies, portion out nuts, or make some homemade hummus. Having these ready-to-go options can prevent unhealthy snacking when you're short on time.",
      "Remember, sustainable nutrition isn't about perfect eating - it's about making consistent, healthy choices most of the time. Aim for progress, not perfection!",
    ],
    style: {
      all: ["Informative", "Encouraging", "Practical", "Supportive", "Health-focused"],
      chat: ["Personalized", "Adaptive", "Motivational", "Educational"],
      post: ["Inspiring", "Actionable", "Evidence-based", "Engaging", "Positive"],
    },
    adjectives: ["Knowledgeable", "Supportive", "Practical", "Motivating", "Adaptable", "Encouraging", "Informative"],
  },
]

export default function CreateAgentPage() {
  const router = useRouter()
  const { t } = useI18N()
  const [creationMethod, setCreationMethod] = useState<"preset" | "scratch">("preset")
  const [selectedPreset, setSelectedPreset] = useState<Agent | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedAgent, setEditedAgent] = useState<Agent | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { getUserId } = useAuth()

  const handlePresetSelection = (preset: Agent) => {
    setSelectedPreset(preset)
    setEditedAgent({ ...preset, modelProvider: "groq" , "plugins": [
    "@elizaos/plugin-twilio",
    "@elizaos/plugin-whatsapp",
    "@elizaos/plugin-web-search"
  ]})
    setIsEditing(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedAgent((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleArrayInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: keyof Agent) => {
    const { value } = e.target
    setEditedAgent((prev) =>
      prev ? { ...prev, [field]: value.split("\n").filter((item) => item.trim() !== "") } : null,
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editedAgent) return

    const supabase = createBrowserSupabaseClient()
    const userID = await getUserId()

    setIsSubmitting(true)
    try {
      // Create the configuration object that matches the schema
      const configuration = {
        bio: editedAgent.bio,
        lore: editedAgent.lore,
        knowledge: editedAgent.knowledge,
        messageExamples: editedAgent.messageExamples,
        postExamples: editedAgent.postExamples,
        style: editedAgent.style,
        adjectives: editedAgent.adjectives,
        settings: editedAgent.settings,
        modelProvider: editedAgent.modelProvider
      }

      // Insert the new agent into Supabase
      const { data, error } = await supabase
        .from('agents')
        .insert([
          {
            name: editedAgent.name,
            description: editedAgent.description,
            active: true,
            configuration: configuration,
            type: 'custom', // You can modify this based on your needs
            docuuid: userID,
          }
        ])
        .select()

      if (error) throw error

      console.log('Agent created:', data)

      // Redirect to the agents list page after successful creation
      router.push('/dashboard/agents')
    } catch (error) {
      console.error('Error creating agent:', error)
      // Here you would typically show an error message to the user
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTabChange = (value: string) => {
    setCreationMethod(value as "preset" | "scratch")
    setEditedAgent(creationMethod === "scratch" ? { name: "", description: "", modelProvider: "groq", settings: { voice: { model: "" } }, bio: [], lore: [], knowledge: [], messageExamples: [], postExamples: [], style: { all: [], chat: [], post: [] }, adjectives: [] } : null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/dashboard/agents" className="flex items-center mb-4 text-blue-500 hover:underline">
        <ArrowLeft className="mr-2" />
        {t("backToAgents")}
      </Link>
      <h1 className="text-3xl font-bold mb-8">{t("createNewAgent")}</h1>

      <Tabs defaultValue="preset" className="mb-8" onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="preset">
            <Wand2 className="mr-2 h-4 w-4" />
            {t("usePreset")}
          </TabsTrigger>
          <TabsTrigger value="scratch">
            <Plus className="mr-2 h-4 w-4" />
            {t("createFromScratch")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preset">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {presetAgents.map((preset) => (
              <Card
                key={preset.name}
                className={`cursor-pointer transition-all ${
                  selectedPreset?.name === preset.name ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => handlePresetSelection(preset)}
              >
                <CardHeader>
                  <CardTitle>{preset.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{preset.bio[0]}</p>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePresetSelection(preset)
                    }}
                  >
                    {t("selectPreset")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedPreset && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{isEditing ? t("editAgent") : t("selectedAgent")}</CardTitle>
                <Button variant="ghost" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? <Check className="h-4 w-4 mr-2" /> : <Pencil className="h-4 w-4 mr-2" />}
                  {isEditing ? t("saveChanges") : t("editAgent")}
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("agentName")}</Label>
                    <Input
                      id="name"
                      name="name"
                      value={editedAgent?.name || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  {/* Add description field */}
                <div className="space-y-2">
                  <Label htmlFor="description">{t("description")}</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={editedAgent?.description || ""}
                    onChange={handleInputChange}
                    rows={3}
                    disabled={!isEditing}
                    required
                  />
                </div>

                  <div className="space-y-2">
                    <Label htmlFor="modelProvider">{t("modelProvider")}</Label>
                    <Input id="modelProvider" name="modelProvider" value="groq" disabled />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="voiceModel">{t("voiceModel")}</Label>
                    <Input
                      id="voiceModel"
                      name="voiceModel"
                      value={editedAgent?.settings.voice.model || ""}
                      onChange={(e) =>
                        setEditedAgent((prev) =>
                          prev
                            ? {
                                ...prev,
                                settings: {
                                  ...prev.settings,
                                  voice: { ...prev.settings.voice, model: e.target.value },
                                },
                              }
                            : null,
                        )
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">{t("bio")}</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={editedAgent?.bio.join("\n") || ""}
                      onChange={(e) => handleArrayInputChange(e, "bio")}
                      rows={4}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lore">{t("lore")}</Label>
                    <Textarea
                      id="lore"
                      name="lore"
                      value={editedAgent?.lore.join("\n") || ""}
                      onChange={(e) => handleArrayInputChange(e, "lore")}
                      rows={4}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="knowledge">{t("knowledge")}</Label>
                    <Textarea
                      id="knowledge"
                      name="knowledge"
                      value={editedAgent?.knowledge.join("\n") || ""}
                      onChange={(e) => handleArrayInputChange(e, "knowledge")}
                      rows={4}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adjectives">{t("adjectives")}</Label>
                    <Textarea
                      id="adjectives"
                      name="adjectives"
                      value={editedAgent?.adjectives.join("\n") || ""}
                      onChange={(e) => handleArrayInputChange(e, "adjectives")}
                      rows={4}
                      disabled={!isEditing}
                    />
                  </div>

                  <Button type="submit" disabled={!isEditing || isSubmitting}>
                    {t("createAgent")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="scratch">
          <Card>
            <CardHeader>
              <CardTitle>{t("createCustomAgent")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="customName">{t("agentName")}</Label>
                  <Input
                    id="customName"
                    name="name"
                    value={editedAgent?.name || ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customModelProvider">{t("modelProvider")}</Label>
                  <Input id="customModelProvider" name="modelProvider" value="groq" disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customVoiceModel">{t("voiceModel")}</Label>
                  <Input
                    id="customVoiceModel"
                    name="voiceModel"
                    value={editedAgent?.settings?.voice?.model || ""}
                    onChange={(e) =>
                      setEditedAgent((prev) =>
                        prev
                          ? {
                              ...prev,
                              settings: { ...prev.settings, voice: { ...prev.settings.voice, model: e.target.value } },
                            }
                          : null,
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customBio">{t("bio")}</Label>
                  <Textarea
                    id="customBio"
                    name="bio"
                    value={editedAgent?.bio?.join("\n") || ""}
                    onChange={(e) => handleArrayInputChange(e, "bio")}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customLore">{t("lore")}</Label>
                  <Textarea
                    id="customLore"
                    name="lore"
                    value={editedAgent?.lore?.join("\n") || ""}
                    onChange={(e) => handleArrayInputChange(e, "lore")}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customKnowledge">{t("knowledge")}</Label>
                  <Textarea
                    id="customKnowledge"
                    name="knowledge"
                    value={editedAgent?.knowledge?.join("\n") || ""}
                    onChange={(e) => handleArrayInputChange(e, "knowledge")}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customAdjectives">{t("adjectives")}</Label>
                  <Textarea
                    id="customAdjectives"
                    name="adjectives"
                    value={editedAgent?.adjectives?.join("\n") || ""}
                    onChange={(e) => handleArrayInputChange(e, "adjectives")}
                    rows={4}
                  />
                </div>

                <Button type="submit">{t("createAgent")}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

