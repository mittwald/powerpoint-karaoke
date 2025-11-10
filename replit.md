# PowerPoint Karaoke Web App

## Overview
A web application that generates humorous PowerPoint karaoke presentations from three user-provided keywords. Uses OpenAI's LLM to create subtly funny presentation titles and Unsplash for random stock photos.

## Features
- Keyword input interface (3 keywords)
- AI-generated presentation titles using OpenAI
- Full-screen presentation mode
- Mix of photo slides (from Unsplash) and text slides
- Auto-play with 8-second intervals
- Manual navigation controls (previous, next, play/pause)
- Keyboard shortcuts (arrow keys, space, escape)
- Thank you slide at the end

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, Node.js
- **APIs**: OpenAI (gpt-5), Unsplash Source

## Architecture
- **Frontend-heavy**: All presentation logic runs in the browser
- **Backend**: Thin API layer for OpenAI integration and photo fetching
- **No database**: Session-based, no persistence needed

## Environment Variables
- `OPENAI_API_KEY`: Required for AI-generated titles and slide text
- `OPENAI_API_BASE_URL`: Optional - Override the OpenAI API base URL (for OpenAI-compatible APIs)
- `OPENAI_MODEL`: Optional - Override the default model (default: gpt-5)
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
      KeywordInput.tsx - Form for entering keywords
      PresentationSlide.tsx - Individual slide renderer
      PresentationControls.tsx - Navigation and playback controls
      PresentationTitle.tsx - Animated title overlay
    pages/
      Home.tsx - Main application page
server/
  lib/
    openai.ts - OpenAI integration for title/text generation
    unsplash.ts - Unsplash photo fetching
  routes.ts - API endpoint for presentation generation
shared/
  schema.ts - TypeScript types and Zod schemas
```

## API Endpoints
- `POST /api/generate-presentation` - Generate complete presentation from keywords
  - Input: `{ keyword1, keyword2, keyword3 }`
  - Output: `{ title, keywords, slides[] }`

## User Flow
1. User enters three keywords
2. Clicks "Generate Presentation"
3. Backend calls OpenAI to generate humorous title
4. Backend fetches random photos from Unsplash based on keywords
5. Backend generates text for text slides using OpenAI
6. Frontend displays full-screen presentation
7. Auto-plays through slides (8s each) or manual navigation
8. Final "Thank You!" slide

## Development Notes
- Mock data fallback if API key is not set
- Unsplash Source API used (no API key required)
- Presentation controls fixed at bottom corners
- Slide counter shows current position
- Title overlay shows for 4 seconds on first slide
