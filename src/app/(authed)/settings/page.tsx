import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/settings/profile-form";
import { NotificationsForm } from "@/components/settings/notifications-form";

export default function SettingsPage() {
    return (
        <Tabs defaultValue="profile" className="w-full max-w-2xl mx-auto">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
                <ProfileForm />
            </TabsContent>
            <TabsContent value="notifications">
                <NotificationsForm />
            </TabsContent>
        </Tabs>
    );
}
