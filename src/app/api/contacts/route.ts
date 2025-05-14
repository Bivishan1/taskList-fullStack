import { getServerSession } from "next-auth/next"
import { NextRequest, NextResponse } from "next/server"
import  {authOptions} from "@/app/api/auth/authOptions"
import { prisma } from "../../../../prisma/client"
import { z } from "zod"

// const prisma = new PrismaClient()

// Validate contact data
const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  pin: z.string().min(4, "PIN must be at least 4 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
    })
    
    return NextResponse.json(contacts)
  } catch (error) {
    console.error("Error fetching contacts:", error)
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Check if user has admin role
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can create contacts" }, { status: 403 })
    }
    
    const data = await request.json()
    
    // Validate input data
    const validationResult = contactSchema.safeParse(data)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors }, { status: 400 })
    }
    
    const newContact = await prisma.contact.create({
      data: {
        ...validationResult.data,
        userId: session.user.id as string,
      },
    })
    
    return NextResponse.json(newContact, { status: 201 })
  } catch (error) {
    console.error("Error creating contact:", error)
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 })
  }
}