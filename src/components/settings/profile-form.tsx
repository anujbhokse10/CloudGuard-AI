"use client";

import { useAuth } from "@/context/auth-context";
import { useForm } from "react-hook-form";
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfile } from "firebase/auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";

const profileSchema = z.object({
    displayName: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email(),
});

export function ProfileForm() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        values: {
            displayName: user?.displayName || '',
            email: user?.email || '',
        }
    });

    const onSubmit = async (data: z.infer<typeof profileSchema>) => {
        if (!user) return;
        setIsLoading(true);
        try {
            await updateProfile(user, { displayName: data.displayName });
            toast({
                title: "Profile Updated",
                description: "Your display name has been successfully updated.",
            });
        } catch (error: any) {
            toast({
                title: "Update Failed",
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>Manage your account settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="displayName"
                            render={({ field }) => (
                                <FormItem>
                                    <Label htmlFor="displayName">Display Name</Label>
                                    <FormControl>
                                        <Input id="displayName" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <Label htmlFor="email">Email</Label>
                                    <FormControl>
                                        <Input id="email" type="email" {...field} disabled />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isLoading}>
                             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}
