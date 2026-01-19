"use client";

import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "../ui/form";

export function NotificationsForm() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
        defaultValues: {
            highRiskAlerts: true,
            mediumRiskAlerts: false,
            weeklySummary: true,
        }
    });

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        // Mock saving settings
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast({
            title: "Settings Saved",
            description: "Your notification preferences have been updated.",
        });
        setIsLoading(false);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>Choose what you want to be notified about.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="highRiskAlerts"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between space-x-2">
                                     <Label htmlFor="high-risk-alerts" className="flex flex-col space-y-1">
                                        <span>High-Risk Alerts</span>
                                        <span className="font-normal leading-snug text-muted-foreground">
                                            Receive an immediate email for high-risk security events.
                                        </span>
                                    </Label>
                                    <FormControl>
                                        <Switch id="high-risk-alerts" checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="mediumRiskAlerts"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between space-x-2">
                                     <Label htmlFor="medium-risk-alerts" className="flex flex-col space-y-1">
                                        <span>Medium-Risk Alerts</span>
                                        <span className="font-normal leading-snug text-muted-foreground">
                                            Receive an immediate email for medium-risk events.
                                        </span>
                                    </Label>
                                    <FormControl>
                                        <Switch id="medium-risk-alerts" checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="weeklySummary"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between space-x-2">
                                     <Label htmlFor="weekly-summary" className="flex flex-col space-y-1">
                                        <span>Weekly Summary</span>
                                        <span className="font-normal leading-snug text-muted-foreground">
                                            Get a weekly summary of activities and alerts.
                                        </span>
                                    </Label>
                                    <FormControl>
                                        <Switch id="weekly-summary" checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Preferences
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}
