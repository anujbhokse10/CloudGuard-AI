"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, FileJson, AlertCircle, Shield, ListChecks } from 'lucide-react';
import { analyzeLogsAndGenerateRiskAssessment, AnalyzeLogsAndGenerateRiskAssessmentOutput } from '@/ai/flows/analyze-logs-and-generate-risk-assessment';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const formSchema = z.object({
    logFile: z.any()
        .refine(files => files?.length == 1, 'Log file is required.')
        .refine(files => files?.[0]?.size <= 5000000, `Max file size is 5MB.`)
        .refine(
            files => ['application/json', 'text/csv'].includes(files?.[0]?.type),
            ".json and .csv files are supported."
        ),
});

type RiskLevel = 'Low' | 'Medium' | 'High';

const riskLevelStyles: Record<RiskLevel, { icon: React.ReactNode, bgColor: string, textColor: string, borderColor: string }> = {
    Low: {
        icon: <Shield className="h-5 w-5 text-green-500" />,
        bgColor: 'bg-green-50 dark:bg-green-900/50',
        textColor: 'text-green-800 dark:text-green-200',
        borderColor: 'border-green-200 dark:border-green-700'
    },
    Medium: {
        icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/50',
        textColor: 'text-yellow-800 dark:text-yellow-200',
        borderColor: 'border-yellow-200 dark:border-yellow-700'
    },
    High: {
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        bgColor: 'bg-red-50 dark:bg-red-900/50',
        textColor: 'text-red-800 dark:text-red-200',
        borderColor: 'border-red-200 dark:border-red-700'
    },
};

export function LogAnalyzer() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<AnalyzeLogsAndGenerateRiskAssessmentOutput | null>(null);
    const [fileName, setFileName] = useState('');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        setResult(null);
        const file = data.logFile[0];
        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = async (e) => {
            const logData = e.target?.result as string;
            const fileType = file.type === 'application/json' ? 'json' : 'csv';

            try {
                const analysisResult = await analyzeLogsAndGenerateRiskAssessment({ logData, fileType });
                setResult(analysisResult);
            } catch (error: any) {
                toast({
                    title: 'Analysis Failed',
                    description: error.message || 'An unexpected error occurred.',
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
            }
        };
        reader.onerror = () => {
            toast({
                title: 'File Read Error',
                description: 'Could not read the selected file.',
                variant: 'destructive',
            });
            setIsLoading(false);
        };
        reader.readAsText(file);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Upload Log File</CardTitle>
                    <CardDescription>Select a JSON or CSV file to analyze.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="log-file">Log File</Label>
                            <Input id="log-file" type="file" accept=".json,.csv" {...form.register('logFile')} />
                            {form.formState.errors.logFile && <p className="text-sm text-destructive">{(form.formState.errors.logFile.message as string)}</p>}
                        </div>
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                            Analyze File
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>Analysis Results</CardTitle>
                    <CardDescription>{isLoading ? 'Analyzing...' : (result ? `Results for ${fileName}` : 'Upload a file to see the analysis.')}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                            <p className="mt-4">Running AI analysis...</p>
                        </div>
                    )}
                    {!isLoading && result && (
                        <div className="space-y-4">
                            <Alert className={`${riskLevelStyles[result.riskLevel].bgColor} ${riskLevelStyles[result.riskLevel].textColor} ${riskLevelStyles[result.riskLevel].borderColor}`}>
                                {riskLevelStyles[result.riskLevel].icon}
                                <AlertTitle className="font-bold">Risk Level: {result.riskLevel}</AlertTitle>
                            </Alert>
                            <div>
                                <h3 className="font-semibold flex items-center mb-2"><ListChecks className="mr-2 h-5 w-5" /> Summary</h3>
                                <p className="text-sm bg-muted/50 p-3 rounded-md">{result.summary}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold flex items-center mb-2"><AlertCircle className="mr-2 h-5 w-5" /> Detected Anomalies</h3>
                                {result.anomalies.length > 0 ? (
                                    <ul className="space-y-2 list-disc list-inside bg-muted/50 p-3 rounded-md text-sm">
                                        {result.anomalies.map((anomaly, index) => (
                                            <li key={index}>{anomaly}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md">No anomalies detected.</p>
                                )}
                            </div>
                        </div>
                    )}
                     {!isLoading && !result && (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground border-2 border-dashed rounded-lg">
                           <FileJson className="h-12 w-12" />
                           <p className="mt-4">Results will appear here</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
