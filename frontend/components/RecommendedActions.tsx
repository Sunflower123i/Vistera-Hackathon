import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

type RecommendedActionsProps = {
  actions: string[]
}

export default function RecommendedActions({ actions }: RecommendedActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle className="mr-2" />
          Actions recommandées
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5">
          {actions.map((action, index) => (
            <li key={index} className="mb-2">
              {action}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

