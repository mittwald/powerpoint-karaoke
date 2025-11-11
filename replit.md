# PowerPoint Karaoke Web App

## Overview
A web application that generates humorous PowerPoint karaoke presentations from three user-provided keywords. Uses OpenAI's LLM to create subtly funny presentation titles and Unsplash for random stock photos.

## Features
- Keyword input interface (3 keywords)
- Language selector (English/German)
- Difficulty selector (Easy/Medium/Hard) - controls narrative coherence
- AI-generated presentation titles and content using OpenAI
- Full-screen presentation mode
- Mix of photo slides (from Unsplash), text slides, quote slides, graph slides, and bio slide
- Manual navigation controls (previous, next, exit)
- Keyboard shortcuts (arrow keys, space, escape)
- **Persistent presentations**: All generated presentations are saved to database
- **Shareable links**: Each presentation gets a unique URL that can be shared
- Thank you slide at the end

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI, Wouter (routing), TanStack Query
- **Backend**: Express.js, Node.js, Drizzle ORM
- **Database**: PostgreSQL (Neon)
- **APIs**: OpenAI (gpt-oss-120b via mittwald AI hosting), Unsplash

## Architecture
- **Database-backed persistence**: All presentations are saved to PostgreSQL
- **Shareable presentations**: Each presentation has a unique UUID-based URL
- **Frontend**: React SPA with client-side routing and presentation display
- **Backend**: API layer for OpenAI integration, photo fetching, and database operations

## Environment Variables
- `OPENAI_API_KEY`: Required for AI-generated titles and slide text
- `OPENAI_API_BASE_URL`: Optional - Override the OpenAI API base URL (default: mittwald AI hosting)
- `OPENAI_MODEL`: Optional - Override the default model (default: gpt-oss-120b)
- `DATABASE_URL`: PostgreSQL connection string (auto-configured)
- `UNSPLASH_ACCESS_KEY`: Unsplash API key for photo fetching
- `SESSION_SECRET`: Already configured

### OpenAI-Compatible APIs
The app supports any OpenAI-compatible API by setting the base URL:
- Set `OPENAI_API_BASE_URL` to point to your API endpoint
- Set `OPENAI_MODEL` to specify which model to use
- Example: Azure OpenAI, LocalAI, or any other compatible service

## Project Structure
```
client/
  src/
    components/
      KeywordInput.tsx - Form for entering keywords, language, and difficulty
      PresentationSlide.tsx - Individual slide renderer
      PresentationControls.tsx - Navigation controls
      slides/
        TitleSlide.tsx - Title slide with branding
        BioSlide.tsx - Presenter biography slide
        PhotoSlide.tsx - Photo slides with Unsplash attribution
        TextSlide.tsx - Text statement slides
        QuoteSlide.tsx - Fake expert quote slides
        GraphSlide.tsx - Bar chart slides
    pages/
      Home.tsx - Keyword input form
      Presentation.tsx - Full-screen presentation viewer (loads from database)
server/
  lib/
    openai.ts - OpenAI integration for narrative generation
    unsplash.ts - Unsplash photo fetching with duplicate prevention
  db.ts - Database connection (Drizzle + Neon)
  storage.ts - Database operations (create/get presentations)
  routes.ts - API endpoints
shared/
  schema.ts - TypeScript types, Zod schemas, and Drizzle database schema
```

## API Endpoints
- `POST /api/generate-presentation` - Generate and save presentation
  - Input: `{ keyword1, keyword2, keyword3, presenterName, difficulty, language }`
  - Output: `{ id, title, keywords, slides[] }`
  - Saves presentation to database with unique UUID
- `GET /api/presentations/:id` - Retrieve saved presentation by ID
  - Output: `{ id, title, keywords, slides[] }`

## User Flow
1. User enters 1-3 keywords, presenter name, difficulty level, and language
2. Clicks "Generate Presentation"
3. Backend uses OpenAI to generate complete presentation structure with coherent narrative
4. Backend fetches photos from Unsplash (with duplicate prevention)
5. Backend saves presentation to database with unique UUID
6. User is redirected to `/presentation/{id}`
7. Presentation loads from database and displays in full-screen mode
8. User can navigate manually or use keyboard shortcuts
9. **Shareable**: User can copy URL to share presentation with anyone
10. Presentations persist indefinitely in database

## Development Notes
- **Narrative Generation**: LLM creates entire 13-slide story structure at once for coherence
- **Difficulty Levels**: 
  - Easy: Professional, coherent narrative
  - Medium: Moderately absurd, entertaining
  - Hard: Completely ridiculous, chaotic
- **Dark Mode Aesthetic**: All content slides use black backgrounds with white text
- **mittwald Branding**: Logo appears on all content slides (top-right corner)
- **Duplicate Prevention**: Photo IDs tracked to ensure unique images across presentation
- **Database Migrations**: Use `npm run db:push` to sync schema changes
