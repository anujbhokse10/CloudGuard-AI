"use client";

import { useEffect, useState } from 'react';
import { collectionGroup, onSnapshot, query, orderBy, Timestamp, where, FirestoreError } from 'firebase/firestore';
import { useFirestore, useUser, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, Shield, CheckCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

type Alert = {
    id: string;
    description: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    timestamp: Timestamp;
    userId: string;
};

const riskConfig: Record<'Low' | 'Medium' | 'High', { variant: "default" | "secondary" | "destructive" | "outline", icon: React.ReactNode, label: string }> = {
    Low: { variant: 'default', icon: <CheckCircle className="h-4 w-4 mr-2" />, label: 'Low' },
    Medium: { variant: 'outline', icon: <Shield className="h-4 w-4 mr-2" />, label: 'Medium' },
    High: { variant: 'destructive', icon: <AlertTriangle className="h-4 w-4 mr-2" />, label: 'High' },
};


const mockAlerts: Alert[] = [
    { id: 'mock1', userId: 'mockuser', riskLevel: 'High', description: 'Potential SQL injection attack detected from IP 203.0.113.45', timestamp: Timestamp.fromMillis(Date.now() - 2 * 60 * 1000) },
    { id: 'mock2', userId: 'mockuser', riskLevel: 'Medium', description: 'Multiple failed login attempts for user `admin`', timestamp: Timestamp.fromMillis(Date.now() - 15 * 60 * 1000) },
    { id: 'mock3', userId: 'mockuser', riskLevel: 'Medium', description: 'Anomalous outbound traffic to a known malicious domain', timestamp: Timestamp.fromMillis(Date.now() - 1 * 60 * 60 * 1000) },
    { id: 'mock4', userId: 'mockuser', riskLevel: 'Low', description: 'Unusual file modification detected in `/var/www/html`', timestamp: Timestamp.fromMillis(Date.now() - 3 * 60 * 60 * 1000) },
    { id: 'mock5', userId: 'mockuser', riskLevel: 'High', description: 'Cross-site scripting (XSS) vulnerability detected in user profile page', timestamp: Timestamp.fromMillis(Date.now() - 5 * 60 * 60 * 1000) },
];


export function AlertsTable() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<FirestoreError | Error | null>(null);
    const firestore = useFirestore();
    const { user } = useUser();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const alertsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collectionGroup(firestore, 'alerts'), where('userId', '==', user.uid), orderBy('timestamp', 'desc'));
    }, [firestore, user]);

    useEffect(() => {
        if (!alertsQuery) {
            setAlerts([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        const unsubscribe = onSnapshot(alertsQuery, (querySnapshot) => {
            const alertsData: Alert[] = [];
            querySnapshot.forEach((doc) => {
                alertsData.push({ id: doc.id, ...doc.data() } as Alert);
            });
            setAlerts(alertsData);
            setLoading(false);
        }, (err) => {
            const permissionError = new FirestorePermissionError({
                path: 'alerts', // This is a collection group query
                operation: 'list',
            });
            setError(permissionError);
            setLoading(false);
            errorEmitter.emit('permission-error', permissionError);
        });

        return () => unsubscribe();
    }, [alertsQuery]);
    
    const dataToShow = !loading && alerts.length === 0 ? mockAlerts : alerts;


    if (error && alerts.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Real-time Security Alerts</CardTitle>
                    <CardDescription>This is a live feed of all security alerts detected in your system.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            There was an error fetching security alerts. You may not have permission to view this data.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

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
                        {!loading && dataToShow.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center h-24">No alerts found. Your system is looking good!</TableCell>
                            </TableRow>
                        )}
                        {!loading && dataToShow.length > 0 && (
                             <>
                                {alerts.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-4 text-muted-foreground border-b">
                                            <p className="font-semibold">Displaying Sample Demo Data</p>
                                            <p className="text-xs">No live alerts were found in your project.</p>
                                        </TableCell>
                                    </TableRow>
                                )}
                                {dataToShow.map((alert) => (
                                    <TableRow key={alert.id}>
                                        <TableCell>
                                            <Badge variant={riskConfig[alert.riskLevel].variant} className="items-center">
                                                {riskConfig[alert.riskLevel].icon}
                                                <span>{riskConfig[alert.riskLevel].label}</span>
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{alert.description}</TableCell>
                                        <TableCell className="text-right text-muted-foreground">
                                            {isClient ? formatDistanceToNow(alert.timestamp.toDate(), { addSuffix: true }) : <Skeleton className="h-4 w-20 float-right" />}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
