"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, AlertTriangle, Users } from "lucide-react";
import RiskOverTimeChart from "@/components/dashboard/risk-over-time-chart";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const recentActivities = [
    { id: 1, type: 'High-Risk Alert', details: 'SQL Injection attempt from 192.168.1.100', time: '2m ago', risk: 'High' },
    { id: 2, type: 'Log Analysis', details: 'Completed analysis of `prod_api_access.log`', time: '15m ago', risk: 'Medium' },
    { id: 3, type: 'Log Upload', details: 'Uploaded `staging_db_queries.csv`', time: '45m ago', risk: 'Low' },
    { id: 4, type: 'User Action', details: 'Admin `dave@cloudguard.ai` logged in', time: '1h ago', risk: 'N/A' },
    { id: 5, type: 'System Update', details: 'AI risk model updated to v2.3', time: '2h ago', risk: 'N/A' },
];

const riskVariantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  "Low": "default",
  "Medium": "outline",
  "High": "destructive",
};

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Risk Score</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-headline text-yellow-400">42</div>
            <p className="text-xs text-muted-foreground">'Medium Risk'. Attention recommended.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-headline">13</div>
            <p className="text-xs text-muted-foreground">3 high-priority, 10 medium</p>
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
                       <div className="text-sm text-muted-foreground">
                        {activity.details} - {isClient ? activity.time : <Skeleton className="h-4 w-10 inline-block" />}
                      </div>
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
