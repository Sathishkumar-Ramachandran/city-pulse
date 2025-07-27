import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

const transformations = [
  { id: "TR-001", endpoint_id: "traffic-cam-blr-001", description: "Convert coordinates and filter for accidents", version: "v1.2", created_at: "2024-08-14" },
  { id: "TR-002", endpoint_id: "public-grievance-webhook", description: "Translate regional language to English", version: "v1.0", created_at: "2024-08-12" },
  { id: "TR-003", endpoint_id: "utility-sensor-data", description: "Aggregate hourly data into daily summaries", version: "v2.0", created_at: "2024-08-10" },
]

export default function TransformationsPage() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Transformations</h1>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Endpoint ID</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transformations.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.id}</TableCell>
                <TableCell>{t.endpoint_id}</TableCell>
                <TableCell>{t.description}</TableCell>
                <TableCell><Badge variant="outline">{t.version}</Badge></TableCell>
                <TableCell>{t.created_at}</TableCell>
                <TableCell><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
