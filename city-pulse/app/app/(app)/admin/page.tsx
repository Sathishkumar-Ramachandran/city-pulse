import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataSourceSetup from "./components/data-source-setup";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
      <Tabs defaultValue="dataSource">
        <TabsList>
          <TabsTrigger value="dataSource">Data Source Setup</TabsTrigger>
          <TabsTrigger value="domainCriticality">Domain & Criticality</TabsTrigger>
          <TabsTrigger value="userManagement">User Management</TabsTrigger>
        </TabsList>
        <TabsContent value="dataSource" className="mt-4">
          <DataSourceSetup />
        </TabsContent>
        <TabsContent value="domainCriticality" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Domain & Criticality</CardTitle>
              <CardDescription>Manage data domains and their criticality levels. (Placeholder)</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Feature to be implemented.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="userManagement" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users and their permissions. (Placeholder)</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Feature to be implemented.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
