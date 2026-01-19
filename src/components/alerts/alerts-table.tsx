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
    Medium: { variant: 'secondary', icon: <Shield className="h-4 w-4 mr-2" />, label: 'Medium' },
    High: { variant: 'destructive', icon: <AlertTriangle className="h-4 w-4 mr-2" />, label: 'High' },
};

export function AlertsTable() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<FirestoreError | Error | null>(null);
    const firestore = useFirestore();
    const { user } = useUser();

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

    if (error) {
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
