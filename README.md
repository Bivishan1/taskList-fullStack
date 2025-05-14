# Task List Application

A role-based task management system built with Next.js, Tailwind CSS, MySQL, Prisma ORM, and Express.js.

## Features

- **Authentication**: Google sign-in integration
- **Role-based Access Control**: Different permissions for admin and guest users
- **Admin Features**: Full CRUD operations for contacts
- **Guest Access**: Read-only view of contacts
- **Responsive Design**: Mobile-friendly UI/UX
- **Dark/Light Theme**: Support for both dark and light modes

## Tech Stack

- **Frontend**: Next.js 13 with App Router, React, Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js with Google provider
- **UI Components**: shadcn/ui component library
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Hooks
- **API Requests**: Axios

## Project Structure

```
├── api/                  # Express.js backend server
├── app/                  # Next.js app router pages
│   ├── api/              # Next.js API routes
│   ├── dashboard/        # Dashboard page (admin/guest views)
│   ├── role-selection/   # Role selection page
│   └── signin/           # Sign-in page
├── components/           # Reusable UI components
├── lib/                  # Utility functions and helpers
├── prisma/               # Prisma schema and migrations
└── types/                # TypeScript type definitions
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the following:
   ```
   DATABASE_URL="mysql://user:password@localhost:3306/tasklist"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-key"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```
4. Set up the database:
   ```
   npx prisma migrate dev
   ```
5. Start the development server:
   ```
   npm run dev
   ```
6. In a separate terminal, start the API server:
   ```
   npm run api
   ```

## User Flow

1. User signs in using Google authentication
2. After signing in, user selects a role (admin or guest)
3. Based on the selected role, the dashboard shows different functionality:
   - Admin: Can create, read, update, and delete contacts
   - Guest: Can only view and search contacts
4. Users can log out at any time

## API Endpoints

- `GET /api/contacts` - Get all contacts
- `POST /api/contacts` - Create a new contact (admin only)
- `GET /api/contacts/:id` - Get a specific contact
- `PUT /api/contacts/:id` - Update a contact (admin only)
- `DELETE /api/contacts/:id` - Delete a contact (admin only)
- `PUT /api/users/role` - Update user role

## Security Features

- JWT-based authentication
- Role-based access control
- Protected API routes
- Form validation with Zod

## Optimizations

- Component-based architecture for better maintainability
- Responsive design with Tailwind CSS
- Form validation on both client and server sides
- Optimistic UI updates for better user experience
- Proper error handling with user-friendly messages