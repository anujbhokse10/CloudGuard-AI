"use client";

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, Shield, CheckCircle } from 'lucide-react';

type Alert = {
    id: string;
    description: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    timestamp: Timestamp;
};

const riskConfig: Record<'Low' | 'Medium' | 'High', { variant: "default" | "secondary" | "destructive" | "outline", icon: React.ReactNode, label: string }> = {
    Low: { variant: 'default', icon: <CheckCircle className="h-4 w-4 mr-2" />, label: 'Low' },
    Medium: { variant: 'secondary', icon: <Shield className="h-4 w-4 mr-2" />, label: 'Medium' },
    High: { variant: 'destructive', icon: <AlertTriangle className="h-4 w-4 mr-2" />, label: 'High' },
};

export function AlertsTable() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'alerts'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const alertsData: Alert[] = [];
            querySnapshot.forEach((doc) => {
                alertsData.push({ id: doc.id, ...doc.data() } as Alert);
            });
            setAlerts(alertsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching alerts: ", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Real-time Security Alerts</CardTitle>
                <CardDescription>This is a live feed of all security alerts detected in your system.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Risk Level</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Timestamp</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading && Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-20 float-right" /></TableCell>
                            </TableRow>
                        ))}
                        {!loading && alerts.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center h-24">No alerts found. Your system is looking good!</TableCell>
                            </TableRow>
                        )}
                        {!loading && alerts.map((alert) => (
                            <TableRow key={alert.id}>
                                <TableCell>
                                    <Badge variant={riskConfig[alert.riskLevel].variant} className="items-center">
                                        {riskConfig[alert.riskLevel].icon}
                                        <span>{riskConfig[alert.riskLevel].label}</span>
                                    </Badge>
                                </TableCell>
                                <TableCell>{alert.description}</TableCell>
                                <TableCell className="text-right text-muted-foreground">
                                    {formatDistanceToNow(alert.timestamp.toDate(), { addSuffix: true })}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
