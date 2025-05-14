import { z } from "zod"
// Validate contact data
export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  pin: z.string().min(4, "PIN must be at least 4 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
})