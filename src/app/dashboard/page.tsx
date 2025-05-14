"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { AdminDashboard } from "@/components/admin-dashboard"
import { GuestDashboard } from "@/components/guest-dashboard"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin")
    }
  }, [status, router])
  
  if (status === "loading") {
    return <DashboardSkeleton />
  }
  
  if (!session) {
    return null
  }
  
  return (
    <div className="min-h-screen bg-background">
      {session.user.role === "ADMIN" ? (
        <AdminDashboard user={session.user} />
      ) : (
        <GuestDashboard user={session.user} />
      )}
    </div>
  )
}