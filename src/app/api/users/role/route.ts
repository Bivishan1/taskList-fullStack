import { getServerSession } from "next-auth/next"
import { NextRequest, NextResponse } from "next/server"
import  {authOptions} from "@/app/api/auth/authOptions"
import { prisma } from "../../../../../prisma/client" // Adjust the import path as necessary
// import { Role } from "@prisma/client";
// import { Role } from "@prisma/client" // Import Role type from Prisma

// const prisma = new PrismaClient()

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const data = await request.json()
    const { role } = data
    
    if (!role || !["ADMIN", "GUEST"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }
    
    const user = await prisma.user.update({
      where: { id: session.user.id as string },
      data: { role: role },
    })
    
    return NextResponse.json(user)
  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 })
  }
}