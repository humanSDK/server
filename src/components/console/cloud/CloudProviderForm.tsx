"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useMutation, useQuery } from "@apollo/client"
import { CREATE_CLOUD_INTEGRATION } from "@/graphql/mutations"
import { GET_CLOUD_INTEGRATIONS } from "@/graphql/queries"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Cloud, Server, Activity, AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const awsFormSchema = z.object({
  accessKeyId: z.string().min(1, "Access Key ID is required"),
  secretAccessKey: z.string().min(1, "Secret Access Key is required"),
  region: z.string().min(1, "Region is required"),
})

const gcpFormSchema = z.object({
  serviceAccountJson: z.string().min(1, "Service Account JSON is required"),
  projectId: z.string().min(1, "Project ID is required"),
})

const azureFormSchema = z.object({
  tenantId: z.string().min(1, "Tenant ID is required"),
  clientId: z.string().min(1, "Client ID is required"),
  clientSecret: z.string().min(1, "Client Secret is required"),
  subscriptionId: z.string().min(1, "Subscription ID is required"),
})

export function CloudProviderForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedProvider, setSelectedProvider] = useState<"AWS" | "GCP" | "AZURE" | null>(null)
  const [showForm, setShowForm] = useState(false)

  const { data: integrationsData, loading: loadingIntegrations } = useQuery(GET_CLOUD_INTEGRATIONS)
  const [createIntegration] = useMutation(CREATE_CLOUD_INTEGRATION)

  const awsForm = useForm<z.infer<typeof awsFormSchema>>({
    resolver: zodResolver(awsFormSchema),
    defaultValues: {
      accessKeyId: "",
      secretAccessKey: "",
      region: "",
    },
  })

  const gcpForm = useForm<z.infer<typeof gcpFormSchema>>({
    resolver: zodResolver(gcpFormSchema),
    defaultValues: {
      serviceAccountJson: "",
      projectId: "",
    },
  })

  const azureForm = useForm<z.infer<typeof azureFormSchema>>({
    resolver: zodResolver(azureFormSchema),
    defaultValues: {
      tenantId: "",
      clientId: "",
      clientSecret: "",
      subscriptionId: "",
    },
  })

  async function onSubmitAWS(values: z.infer<typeof awsFormSchema>) {
    setIsLoading(true)
    try {
      await createIntegration({
        variables: {
          provider: "AWS",
          aws: values,
        },
        refetchQueries: [{ query: GET_CLOUD_INTEGRATIONS }],
      })
      setShowForm(false)
      awsForm.reset()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function onSubmitGCP(values: z.infer<typeof gcpFormSchema>) {
    setIsLoading(true)
    try {
      await createIntegration({
        variables: {
          provider: "GCP",
          gcp: values,
        },
        refetchQueries: [{ query: GET_CLOUD_INTEGRATIONS }],
      })
      setShowForm(false)
      gcpForm.reset()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function onSubmitAzure(values: z.infer<typeof azureFormSchema>) {
    setIsLoading(true)
    try {
      await createIntegration({
        variables: {
          provider: "AZURE",
          azure: values,
        },
        refetchQueries: [{ query: GET_CLOUD_INTEGRATIONS }],
      })
      setShowForm(false)
      azureForm.reset()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (loadingIntegrations) {
    return <div>Loading...</div>
  }

  const existingIntegrations = integrationsData?.getCloudIntegrations || []
  const hasAWS = existingIntegrations.some((i: any) => i.provider === "AWS")
  const hasGCP = existingIntegrations.some((i: any) => i.provider === "GCP")
  const hasAzure = existingIntegrations.some((i: any) => i.provider === "AZURE")

  return (
    <div className="h-full space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cloud Integration</h1>
        <p className="text-muted-foreground">
          Manage your cloud provider integrations and monitor their status
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <Activity className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="logs">
            <AlertCircle className="mr-2 h-4 w-4" />
            Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card 
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => {
                setSelectedProvider("AWS")
                setShowForm(true)
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AWS Status</CardTitle>
                {hasAWS ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hasAWS ? "Connected" : "Not Connected"}</div>
                <p className="text-xs text-muted-foreground">
                  {hasAWS ? "Click to manage" : "Click to connect"}
                </p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => {
                setSelectedProvider("GCP")
                setShowForm(true)
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">GCP Status</CardTitle>
                {hasGCP ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hasGCP ? "Connected" : "Not Connected"}</div>
                <p className="text-xs text-muted-foreground">
                  {hasGCP ? "Click to manage" : "Click to connect"}
                </p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => {
                setSelectedProvider("AZURE")
                setShowForm(true)
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Azure Status</CardTitle>
                {hasAzure ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hasAzure ? "Connected" : "Not Connected"}</div>
                <p className="text-xs text-muted-foreground">
                  {hasAzure ? "Click to manage" : "Click to connect"}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Logs</CardTitle>
              <CardDescription>Recent activity and events</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-start space-x-4 rounded-lg border p-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Activity className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">Integration Status Check</p>
                        <p className="text-sm text-muted-foreground">
                          AWS integration status verified successfully
                        </p>
                        <p className="text-xs text-muted-foreground">2 minutes ago</p>
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        Success
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedProvider === "AWS" && "AWS Integration"}
              {selectedProvider === "GCP" && "GCP Integration"}
              {selectedProvider === "AZURE" && "Azure Integration"}
            </DialogTitle>
            <DialogDescription>
              {selectedProvider === "AWS" && "Configure your AWS credentials"}
              {selectedProvider === "GCP" && "Configure your GCP service account"}
              {selectedProvider === "AZURE" && "Configure your Azure credentials"}
            </DialogDescription>
          </DialogHeader>

          {selectedProvider === "AWS" && (
            <Form {...awsForm}>
              <form onSubmit={awsForm.handleSubmit(onSubmitAWS)} className="space-y-4">
                <FormField
                  control={awsForm.control}
                  name="accessKeyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Key ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your access key ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={awsForm.control}
                  name="secretAccessKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secret Access Key</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your secret access key"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={awsForm.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your region" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Connecting..." : "Connect"}
                  </Button>
                  {hasAWS && (
                    <Button variant="destructive" type="button">
                      <XCircle className="mr-2 h-4 w-4" />
                      Disconnect
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          )}

          {selectedProvider === "GCP" && (
            <Form {...gcpForm}>
              <form onSubmit={gcpForm.handleSubmit(onSubmitGCP)} className="space-y-4">
                <FormField
                  control={gcpForm.control}
                  name="serviceAccountJson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Account JSON</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your service account JSON"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={gcpForm.control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your project ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Connecting..." : "Connect"}
                  </Button>
                  {hasGCP && (
                    <Button variant="destructive" type="button">
                      <XCircle className="mr-2 h-4 w-4" />
                      Disconnect
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          )}

          {selectedProvider === "AZURE" && (
            <Form {...azureForm}>
              <form onSubmit={azureForm.handleSubmit(onSubmitAzure)} className="space-y-4">
                <FormField
                  control={azureForm.control}
                  name="tenantId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tenant ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your tenant ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={azureForm.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your client ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={azureForm.control}
                  name="clientSecret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Secret</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your client secret"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={azureForm.control}
                  name="subscriptionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subscription ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your subscription ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Connecting..." : "Connect"}
                  </Button>
                  {hasAzure && (
                    <Button variant="destructive" type="button">
                      <XCircle className="mr-2 h-4 w-4" />
                      Disconnect
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 