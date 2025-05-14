"use client"

import { useState } from "react"
import { User } from "next-auth"
import { NavBar } from "@/components/nav-bar"
import { ContactsTable } from "@/components/contacts-table"
import { ContactForm } from "@/components/contact-form"
import { Button } from "@/components/ui/button"
import { Plus, UserCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface AdminDashboardProps {
  user: User
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSuccess = () => {
    setIsDialogOpen(false)
    // Force re-render of contacts table
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 container py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome, Admin</h1>
            <p className="text-muted-foreground">
              Manage your contacts with full administrative access
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Contact</DialogTitle>
                <DialogDescription>
                  Add a new contact to your list
                </DialogDescription>
              </DialogHeader>
              <ContactForm 
                onSuccess={handleSuccess} 
                onCancel={() => setIsDialogOpen(false)} 
              />
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid gap-6">
          <Card className="border shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Account Info</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-1">
                <div className="text-sm text-muted-foreground">Name</div>
                <div className="font-medium">{user.name}</div>
              </div>
              <div className="grid gap-1 mt-2">
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium">{user.email}</div>
              </div>
              <div className="grid gap-1 mt-2">
                <div className="text-sm text-muted-foreground">Role</div>
                <div className="font-medium">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    ADMIN
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <ContactsTable key={refreshKey} isAdmin={true} />
        </div>
      </main>
    </div>
  )
}