import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const freeFeatures = [
    "Dashboard access",
    "Manual log uploads (10/month)",
    "Basic risk analysis",
    "Email alerts for high-risk events",
];

const proFeatures = [
    "Everything in Free, plus:",
    "Unlimited log uploads",
    "Advanced AI-powered anomaly detection",
    "Real-time log monitoring (coming soon)",
    "Detailed reporting and analytics",
    "Priority support",
];

export function SubscriptionPlans() {
    return (
        <div className="space-y-6">
             <div className="text-center">
                <h1 className="text-3xl font-bold font-headline">Choose Your Plan</h1>
                <p className="text-muted-foreground">Unlock more features with our Pro plan.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Free Plan</CardTitle>
                        <CardDescription>For individuals and small teams getting started.</CardDescription>
                        <div className="text-4xl font-bold pt-4">$0 <span className="text-lg font-normal text-muted-foreground">/ month</span></div>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {freeFeatures.map(feature => (
                                <li key={feature} className="flex items-center">
                                    <Check className="h-4 w-4 mr-2 text-green-500" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full" disabled>Your Current Plan</Button>
                    </CardFooter>
                </Card>
                <Card className="border-primary shadow-lg">
                    <CardHeader>
                        <CardTitle>Pro Plan</CardTitle>
                        <CardDescription>For businesses that need advanced security and insights.</CardDescription>
                        <div className="text-4xl font-bold pt-4 text-primary">$49 <span className="text-lg font-normal text-muted-foreground">/ month</span></div>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {proFeatures.map(feature => (
                                <li key={feature} className="flex items-center">
                                    <Check className="h-4 w-4 mr-2 text-primary" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full">Upgrade to Pro</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
