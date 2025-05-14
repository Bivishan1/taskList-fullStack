"use client"

import { User } from "next-auth"
import { NavBar } from "@/components/nav-bar"
import { ContactsTable } from "@/components/contacts-table"
import { UserCircle } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface GuestDashboardProps {
  user: User
}

export function GuestDashboard({ user }: GuestDashboardProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Welcome, Guest</h1>
          <p className="text-muted-foreground">
            View and explore available contacts
          </p>
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
                  <span className="inline-flex items-center rounded-full bg-blue-100  px-2 py-1 text-xs font-medium text-blue-800 dark:text-blue-300">
                    GUEST
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <ContactsTable isAdmin={false} />
        </div>
      </main>
    </div>
  )
}