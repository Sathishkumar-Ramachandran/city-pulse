import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export const ingestedData = [
  { id: "ING-001", endpoint_id: "traffic-cam-blr-001", source: "BTP API", records: 1052, status: "Success", ingested_at: "2024-08-15 10:00", address: "Trinity Circle, Bengaluru" },
  { id: "ING-002", endpoint_id: "weather-station-01", source: "IMD Stream", records: 2400, status: "Success", ingested_at: "2024-08-15 10:05", address: "Kempegowda International Airport, Bengaluru" },
  { id: "ING-003", endpoint_id: "public-grievance-webhook", source: "Citizen App", records: 5, status: "Success", ingested_at: "2024-08-15 10:15", address: "Majestic, Bengaluru" },
  { id: "ING-004", endpoint_id: "utility-sensor-data", source: "BESCOM IoT", records: 50000, status: "Success", ingested_at: "2024-08-15 10:20", address: "Electronic City, Bengaluru" },
  { id: "ING-005", endpoint_id: "traffic-cam-blr-002", source: "BTP API", records: 0, status: "Failed", ingested_at: "2024-08-15 10:25", address: "Marathahalli, Bengaluru" },
]

export default function IngestedDataPage() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Ingested Data</h1>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ingestion ID</TableHead>
              <TableHead>Endpoint ID</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Records</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ingestedData.map((data) => (
              <TableRow key={data.id}>
                <TableCell className="font-medium">{data.id}</TableCell>
                <TableCell>{data.endpoint_id}</TableCell>
                <TableCell>{data.source}</TableCell>
                <TableCell>{data.records}</TableCell>
                <TableCell><Badge variant={data.status === "Failed" ? "destructive" : "default"}>{data.status}</Badge></TableCell>
                <TableCell>{data.ingested_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
