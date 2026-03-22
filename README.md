# Slooze Backend Challenge - Role-Based Food Ordering API

A GraphQL backend built with Next.js, Apollo Server, and Prisma, featuring robust Role-Based Access Control (RBAC) and Region-Based Access Control (Re-BAC).

## Tech Stack
- **Framework:** Next.js (App Router)
- **API:** GraphQL (Apollo Server)
- **ORM:** Prisma
- **Database:** PostgreSQL (Neon DB)

## Local Setup Instructions

1. **Clone the repository and install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure the Environment:**
   Create a \`.env\` file in the root directory and add your PostgreSQL connection string:
   \`\`\`env
   DATABASE_URL="postgresql://user:password@your-neon-hostname/dbname?sslmode=require"
   \`\`\`

3. **Initialize the Database:**
   Push the Prisma schema to your database to create the required tables:
   \`\`\`bash
   npx prisma db push
   \`\`\`

4. **Seed the Database (Required for Testing):**
   Run the seed script to populate the database with the Marvel characters (Nick Fury, Captain Marvel, etc.) and mock restaurants as per the assignment requirements:
   \`\`\`bash
   npm install -D tsx
   npx tsx prisma/seed.ts
   \`\`\`

5. **Run the Development Server:**
   \`\`\`bash
   npm run dev
   \`\`\`

## Testing the API
Navigate to \`http://localhost:3000/api/graphql\` in your browser to access the Apollo Sandbox. 

**Authentication / RBAC Testing:**
Currently, the GraphQL context hardcodes the user identity to facilitate easy testing of different roles without requiring a full JWT login flow. 
To test different permission levels (RBAC) and region locks (Re-BAC), modify the \`user\` object in \`app/api/graphql/route.ts\`:

\`\`\`typescript
const user = {
  id: 'manager-marvel', // Matches seed data
  role: 'MANAGER',      // Change to ADMIN or MEMBER to test RBAC
  country: 'INDIA',     // Change to AMERICA to test Re-BAC
};
\`\`\`
