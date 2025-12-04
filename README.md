# PowerPoint Karaoke Generator

An AI-powered web application that generates hilariously random PowerPoint presentations from just three keywords. Perfect for party games, team building, and testing your improvisation skills!

> [!NOTE]
> **Tech Demo:** This project showcases [mittwald AI hosting](https://www.mittwald.de/mstudio/ai-hosting) and [mittwald container hosting](https://www.mittwald.de/mstudio/container-hosting) capabilities with production-ready AI integration and seamless deployment.

## Features

- **AI-Generated Content**: Powered by OpenAI-compatible models (default: gpt-oss-120b via mittwald AI hosting) to create coherent yet absurd presentation narratives
- **Difficulty Levels**: Choose from Easy (professional), Medium (entertaining), or Hard (completely ridiculous) presentations
- **Multi-Language Support**: Generate presentations in English or German
- **Rich Slide Types**: Mix of title slides, photo slides with Unsplash integration, text statements, fake expert quotes, bar charts, and presenter bios
- **Persistent Presentations**: All presentations are stored persistently in a PostgreSQL database
- **Shareable Links**: Every presentation gets a unique URL that can be shared with anyone
- **Full-Screen Presentation Mode**: Navigate with mouse or keyboard (arrow keys, space, escape)

## Demo

[Insert screenshot or GIF of the application here]

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- OpenAI API key (or compatible API)
- Unsplash API key

### Environment Variables

Create a `.env` file in the root directory:

```env
# Required
DATABASE_URL=postgresql://user:password@localhost:5432/powerpoint_karaoke
OPENAI_API_KEY=your_openai_api_key
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
SESSION_SECRET=your_session_secret

# Optional - mittwald AI hosting configuration
OPENAI_API_BASE_URL=https://llm.aihosting.mittwald.de/v1  # Override for custom endpoints
OPENAI_MODEL=gpt-oss-120b                                 # Override default model
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/powerpoint-karaoke.git
cd powerpoint-karaoke

# Install dependencies
npm install

# Set up the database
npm run db:push

# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

1. **Enter Keywords**: Provide 1-3 keywords that will inspire your presentation
2. **Set Preferences**: Choose your presenter name, difficulty level, and language
3. **Generate**: Click "Generate Presentation" and enjoy the loading screen
4. **Present**: Navigate through your AI-generated masterpiece
5. **Share**: Copy the URL to share your presentation with friends

## Architecture

### Key Design Decisions

- **Single-Pass AI Generation**: The entire 13-slide presentation narrative is generated in one LLM call to ensure coherent storytelling
- **Duplicate Prevention**: Photo IDs are tracked to ensure no repeated images in a single presentation
- **Database-First**: All presentations are persisted, enabling shareable links and future features
- **OpenAI Compatibility**: Works with any OpenAI-compatible API (mittwald AI hosting, Azure OpenAI, LocalAI, etc.)

## Deployment

### Docker Deployment

This project is optimized for mittwald container hosting:

```bash
cp .env.example .env
# Edit .env with your production settings

docker compose build
docker compose up -d
```

Database migrations run automatically on container startup.

### mittwald container hosting

```bash
cp .env.example .env
# Edit .env with your production settings

mw stack deploy -c docker-compose.production.yml
```

Database migrations run automatically on container startup.

### Manual Deployment

```bash
# Install production dependencies
npm ci --production

# Run database migrations
npm run db:migrate

# Build frontend assets
npm run build

# Start the server
npm start
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Powered by [mittwald AI hosting](https://www.mittwald.de) for AI content generation
- Photos provided by [Unsplash](https://unsplash.com)
- Built with [OpenAI SDK](https://github.com/openai/openai-node)

## Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Contact the maintainers

---

**Built with ❤️ as a tech demo for mittwald AI hosting and container hosting**
