import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle } from "lucide-react"

type TranscriptEntry = {
  speaker: string
  text: string
}

type CallTranscriptProps = {
  transcript: TranscriptEntry[]
}

export default function CallTranscript({ transcript }: CallTranscriptProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="mr-2" />
          Transcription de l'appel
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transcript.map((entry, index) => (
          <div key={index} className="mb-4">
            <p className="font-semibold">{entry.speaker}:</p>
            <p className="ml-4">{entry.text}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

