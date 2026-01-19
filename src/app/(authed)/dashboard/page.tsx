import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, AlertTriangle, Users } from "lucide-react";
import RiskOverTimeChart from "@/components/dashboard/risk-over-time-chart";

const recentActivities = [
  { id: 1, type: "Log Upload", details: "Uploaded server_logs_2024.csv", time: "2m ago", risk: "Low" },
  { id: 2, type: "High-Risk Alert", details: "Anomalous login pattern detected", time: "15m ago", risk: "High" },
  { id: 3, type: "User Added", details: "user@example.com added to team", time: "1h ago", risk: "N/A" },
  { id: 4, type: "Log Analysis", details: "Analysis complete for auth_logs.json", time: "3h ago", risk: "Medium" },
  { id: 5, type: "Settings Changed", details: "Notification preferences updated", time: "5h ago", risk: "N/A" },
];

const riskVariantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  "Low": "default",
  "Medium": "secondary",
  "High": "destructive",
};

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Risk Score</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-headline text-green-600">78</div>
            <p className="text-xs text-muted-foreground">Considered 'Low Risk'. Great job!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-headline">5</div>
            <p className="text-xs text-muted-foreground">2 high-priority, 3 medium</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-headline">12</div>
            <p className="text-xs text-muted-foreground">+2 since last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Risk Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <RiskOverTimeChart />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Details</TableHead>
                  <TableHead className="text-right">Risk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div className="font-medium">{activity.type}</div>
                      <div className="text-sm text-muted-foreground">{activity.details} - {activity.time}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      {activity.risk !== "N/A" ? (
                        <Badge variant={riskVariantMap[activity.risk]}>{activity.risk}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">N/A</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
