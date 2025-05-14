"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import axios from "axios"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  pin: z.string().min(4, { message: "PIN must be at least 4 characters" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 characters" }),
})

type FormValues = z.infer<typeof formSchema>

interface ContactFormProps {
  contact?: {
    id: string
    name: string
    address: string
    pin: string
    phone: string
  }
  onSuccess: () => void
  onCancel?: () => void
}

export function ContactForm({ contact, onSuccess, onCancel }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const isEditing = !!contact
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: contact || {
      name: "",
      address: "",
      pin: "",
      phone: "",
    },
  })

  async function onSubmit(data: FormValues) {
    try {
      setIsSubmitting(true)
      
      if (isEditing) {
        await axios.put(`/api/contacts/${contact.id}`, data)
        toast({
          title: "Contact updated",
          description: "The contact has been successfully updated.",
        })
      } else {
        await axios.post("/api/contacts", data)
        toast({
          title: "Contact created",
          description: "The contact has been successfully created.",
        })
      }
      
      form.reset()
      onSuccess()
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} contact. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St, City" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PIN</FormLabel>
              <FormControl>
                <Input placeholder="123456" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update" : "Create"} Contact
          </Button>
        </div>
      </form>
    </Form>
  )
}