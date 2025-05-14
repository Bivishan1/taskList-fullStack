"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Icons } from "@/components/icons"

export default function RoleSelection() {
  const { data: session, update } = useSession()
  const [selectedRole, setSelectedRole] = useState<string>("GUEST")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleRoleSelection = async () => {
    try {
      setIsLoading(true)
      
      // Update user role in database
      await axios.put("/api/users/role", { role: selectedRole }, {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      })
      
      // Update session with new role
      await update({
        ...session,
        user: {
          ...session?.user,
          role: selectedRole,
        },
      })
      
      toast({
        title: "Role updated successfully",
        description: `You are now an ${selectedRole.toLowerCase()}`,
      })
      
      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to update role:", error)
      toast({
        title: "Failed to update role",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Choose Your Role</CardTitle>
          <CardDescription className="text-center">
            Select a role to continue to the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={selectedRole} onValueChange={setSelectedRole} className="space-y-4">
            <div className="flex items-start space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent transition-colors"
                 onClick={() => setSelectedRole("ADMIN")}>
              <RadioGroupItem value="ADMIN" id="admin" className="mt-1 " />
              <div className="space-y-1.5">
                <Label htmlFor="admin" className="text-base font-medium cursor-pointer">Admin</Label>
                <p className="text-sm text-muted-foreground">
                  Full access to create, read, update, and delete contacts.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent transition-colors"
                 onClick={() => setSelectedRole("GUEST")}>
              <RadioGroupItem value="GUEST" id="guest" className="mt-1" />
              <div className="space-y-1.5">
                <Label htmlFor="guest" className="text-base font-medium cursor-pointer">Guest</Label>
                <p className="text-sm text-muted-foreground">
                  Read-only access to view existing contacts.
                </p>
              </div>
            </div>
          </RadioGroup>
          
          <Button 
            onClick={handleRoleSelection} 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}