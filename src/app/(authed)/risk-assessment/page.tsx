import { LogAnalyzer } from '@/components/risk/log-analyzer';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RiskAssessmentPage() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="font-headline text-2xl">AI-Powered Log Analysis</CardTitle>
                            <CardDescription>Upload your JSON or CSV log files to detect anomalies and assess risk.</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/50 dark:text-amber-200 dark:border-amber-700">PRO FEATURE</Badge>
                    </div>
                </CardHeader>
            </Card>
            <LogAnalyzer />
        </div>
    );
}
