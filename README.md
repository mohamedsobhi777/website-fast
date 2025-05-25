# WebsiteFast - AI Website Generator

A modern SaaS application that generates complete websites from text prompts using AI. Built with Next.js, Drizzle ORM, PostgreSQL, and Vercel AI Gateway.

## 🚀 Quick Start

1. **Clone and install:**
   ```bash
   git clone <your-repo-url>
   cd website-fast
   npm install
   ```

2. **Set up database:**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your PostgreSQL connection string
   npm run setup
   ```

3. **Start the app:**
   ```bash
   npm run dev
   ```

That's it! Visit [http://localhost:3000](http://localhost:3000) to start generating websites.

## Features

- ✨ AI-powered website generation from text prompts
- 🎨 Modern, responsive UI with sophisticated animations
- 💾 PostgreSQL database with Drizzle ORM
- 🚀 Real-time website preview and editing
- 📱 Mobile-first responsive design
- ⚡ Fast generation with streaming responses
- 🔗 Social sharing and deployment integration

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: Vercel AI Gateway (Claude v3 Haiku)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Custom components
- **TypeScript**: Full type safety

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd website-fast
npm install
```

### 2. Database Setup

#### Option A: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database:
```sql
CREATE DATABASE websitefast;
```

#### Option B: Cloud Database (Recommended)

Use services like:
- [Vercel Postgres](https://vercel.com/storage/postgres)
- [Supabase](https://supabase.com)
- [Railway](https://railway.app)
- [PlanetScale](https://planetscale.com)

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/websitefast"

# Optional: Vercel AI Gateway API Key
# VERCEL_AI_GATEWAY_API_KEY="your-key-here"
```

### 4. Database Migration

Run the database migrations:

```bash
# Generate migration files (already done)
npm run db:generate

# Apply migrations to your database
npm run db:push
```

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Scripts

- `npm run db:generate` - Generate migration files from schema
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run migrations (for production)
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Database Schema

The application uses a simple schema with one main table:

### `projects` table
- `id` (UUID, Primary Key)
- `prompt` (Text) - User's website description
- `generated_html` (Text) - AI-generated HTML code
- `status` (Enum) - 'generating' | 'completed' | 'failed'
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate/          # AI generation endpoint
│   │   └── project/[id]/      # Project retrieval endpoint
│   ├── project/[id]/          # Project view page
│   └── page.tsx               # Landing page
├── components/
│   └── ui/                    # Reusable UI components
├── lib/
│   ├── db/                    # Database configuration
│   │   ├── index.ts          # Database connection
│   │   └── schema.ts         # Drizzle schema
│   └── data-store.ts         # Data access layer
```

## Development

### Adding New Features

1. Update the database schema in `src/lib/db/schema.ts`
2. Generate new migrations: `npm run db:generate`
3. Apply changes: `npm run db:push`
4. Update the data store in `src/lib/data-store.ts`

### Database GUI

Access Drizzle Studio for database management:

```bash
npm run db:studio
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Other Platforms

Ensure you:
1. Set up PostgreSQL database
2. Configure `DATABASE_URL` environment variable
3. Run `npm run db:push` to set up tables

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `VERCEL_AI_GATEWAY_API_KEY` | Vercel AI Gateway API key | Optional |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support, email [your-email] or create an issue in the GitHub repository.
# website-fast
