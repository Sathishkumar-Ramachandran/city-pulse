import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export const issues = [
  { id: "IS-001", title: "Pothole on 100ft Road", domain: "Infrastructure", priority: "High", status: "Open", address: "100 Feet Road, Indiranagar, Bengaluru" },
  { id: "IS-002", title: "Broken Streetlight in HSR Layout", domain: "Utilities", priority: "Medium", status: "In Progress", address: "HSR Layout, Bengaluru" },
  { id: "IS-003", title: "Signal Malfunction at Silk Board", domain: "Traffic", priority: "Critical", status: "Open", address: "Silk Board, Bengaluru" },
  { id: "IS-004", "title": "Garbage overflow near Market", "domain": "Sanitation", "priority": "Medium", "status": "Resolved", address: "KR Market, Bengaluru" },
  { id: "IS-005", "title": "Water leakage on Main St", "domain": "Utilities", "priority": "High", "status": "In Progress", address: "Jayanagar 4th Block, Bengaluru" },
]

export default function IssuesPage() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Issues</h1>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.map((issue) => (
              <TableRow key={issue.id}>
                <TableCell className="font-medium">{issue.id}</TableCell>
                <TableCell>{issue.title}</TableCell>
                <TableCell>{issue.domain}</TableCell>
                <TableCell><Badge variant={issue.priority === "High" || issue.priority === "Critical" ? "destructive" : "secondary"}>{issue.priority}</Badge></TableCell>
                <TableCell>{issue.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
