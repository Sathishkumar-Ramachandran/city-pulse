import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, ShieldCheck, Route, Wrench } from "lucide-react";
import DomainChart from "./components/domain-chart";

const kpiData = [
  { title: "Total Issues", value: "1,234", icon: AlertTriangle, change: "+5.2%" },
  { title: "Resolved Issues", value: "987", icon: ShieldCheck, change: "+8.1%" },
  { title: "Traffic Incidents", value: "456", icon: Route, change: "-2.3%" },
  { title: "Utility Disruptions", value: "102", icon: Wrench, change: "+1.5%" },
];

export default function DashboardPage() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Issues by Domain</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <DomainChart />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>An overview of the latest critical events.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
              {[
                { title: "Power Outage in Koramangala", time: "5m ago", priority: "High" },
                { title: "Heavy Traffic on Outer Ring Road", time: "15m ago", priority: "Medium" },
                { title: "Water Pipe Burst in Jayanagar", time: "45m ago", priority: "High" },
                { title: "Roadwork scheduled for Indiranagar", time: "2h ago", priority: "Low" },
              ].map(alert => (
                <div key={alert.title} className="flex items-start">
                   <div className="flex h-2 w-2 translate-y-1 rounded-full bg-primary" />
                  <div className="ml-3 space-y-1">
                    <p className="text-sm font-medium leading-none">{alert.title}</p>
                    <p className="text-sm text-muted-foreground">{alert.time}</p>
                  </div>
                  <div className="ml-auto font-medium text-sm">{alert.priority}</div>
                </div>
              ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
