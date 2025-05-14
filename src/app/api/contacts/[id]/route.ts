import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import authOptions from "@/app/api/auth/authOptions"
import { prisma } from "../../../../../prisma/client"
import { contactSchema } from "../schema"

// GET handler with params as Promise according to official recommendation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const contact = await prisma.contact.findUnique({
      where: { id },
    })
    
    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }
    
    return NextResponse.json(contact)
  } catch (error) {
    console.error("Error fetching contact:", error)
    return NextResponse.json({ error: "Failed to fetch contact" }, { status: 500 })
  }
}

// PUT handler with params as Promise according to official recommendation
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Check if user has admin role
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can update contacts" }, { status: 403 })
    }
    
    const data = await request.json()
    
    // Validate input data
    const validationResult = contactSchema.safeParse(data)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors }, { status: 400 })
    }
    
    const updatedContact = await prisma.contact.update({
      where: { id },
      data: validationResult.data,
    })
    
    return NextResponse.json(updatedContact)
  } catch (error) {
    console.error("Error updating contact:", error)
    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 })
  }
}

// DELETE handler with params as Promise according to official recommendation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Check if user has admin role
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can delete contacts" }, { status: 403 })
    }
    
    await prisma.contact.delete({
      where: { id },
    })
    
    return NextResponse.json({ message: "Contact deleted successfully" })
  } catch (error) {
    console.error("Error deleting contact:", error)
    return NextResponse.json({ error: "Failed to delete contact" }, { status: 500 })
  }
}