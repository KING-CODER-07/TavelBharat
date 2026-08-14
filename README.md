# TravelBharat

TravelBharat is a comprehensive tourism directory designed to showcase Incredible India. Built with Next.js and Prisma, it provides a highly structured, scalable platform for exploring tourist destinations state-by-state, city-by-city, and by category.

## Project Scope & Objectives

This project was built to address the following objectives:
- **Primary:** Provide a single platform for all Indian tourist destinations, organized state-wise and city-wise with verified details.
- **Secondary:** Promote lesser-known destinations (Hidden Gems), support students with a dedicated data portal, and provide a scalable base for future booking integrations.
- **Out of Scope:** Live payments, bookings, and user reviews are strictly omitted from the platform. The platform operates on a lead-generation structure (Inquire for Details).

## Core Features

- **Student Hub:** An open-data style portal aggregating national tourism statistics for academic use.
- **Search & Filter:** Advanced querying allowing users to cross-filter destinations by text, State, City, and Category.
- **Hidden Gems:** Dedicated promotion of offbeat destinations on the homepage.
- **Secure Admin Panel:** Full CRUD (Create, Read, Update, Delete) content management system secured via HTTP Basic Authentication.
- **Responsive Design:** Mobile-first architecture using Next.js CSS Modules.

## User Flow (High-Level)
1. User visits the **TravelBharat** homepage.
2. Selects a state from the comprehensive **State & UT List**.
3. Views the **State-wise** curated list of top tourist places.
4. Clicks on a specific **Tourist Destination**.
5. Reads historical details, views the image gallery, and discovers **nearby attractions**.
6. Uses the global navigation or breadcrumbs to **explore another state or place**.

## Tech Stack

- **Framework:** [Next.js (App Router)](https://nextjs.org/)
- **Database:** SQLite
- **ORM:** [Prisma](https://www.prisma.io/)
- **Styling:** Vanilla CSS (CSS Modules)
- **Deployment:** Vercel (or any Node.js host)

## Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd TravelBharat
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Database Setup:**
   The project uses SQLite for easy local development. Copy the example env file, then sync the schema and seed tourism data:
   ```bash
   cp .env.example .env
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

4. **Environment Variables:**
   > **Prisma 7 upgrade:** Set `DATABASE_URL="file:./prisma/dev.db"` in `.env`. Prisma 6 stored the database at `prisma/dev.db` via a schema-relative path; Prisma 7 resolves paths from the project root.
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   ADMIN_USER=admin
   ADMIN_PASSWORD=admin123
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Admin Access
To access the content management system, navigate to `http://localhost:3000/admin`. You will be prompted by the login page. Use the default password `travelbharat123` (or set the `ADMIN_PASSWORD` in your `.env` file) to securely log in.

---
*Built for the Unified Mentor Tourism Project.*
