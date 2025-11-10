# PowerPoint Karaoke Web App - Design Guidelines

## Design Approach
**Reference-Based:** Drawing inspiration from Google Slides' clean presentation interface combined with Kahoot's playful, game-show energy. This creates an approachable yet professional presentation experience with entertainment value.

## Core Design Principles
1. **Dual-Mode Interface**: Clear distinction between setup mode (keyword entry) and presentation mode (full-screen)
2. **Presentation-First**: Maximize content visibility, minimize UI chrome during presentations
3. **Playful Professionalism**: Fun without being cartoonish - suitable for corporate karaoke events

## Typography
- **Primary Font**: Inter or Work Sans (via Google Fonts CDN)
- **Display Font**: Outfit or Space Grotesk for presentation titles
- **Hierarchy**:
  - Presentation titles: 4xl-6xl, bold (display font)
  - Text slides: 3xl-4xl, medium (primary font)
  - UI elements: base-xl, regular-medium
  - Buttons: lg, semibold

## Layout System
**Spacing Units**: Tailwind units of 4, 6, 8, 12, and 16 for consistent rhythm

### Setup Screen Layout
- Centered container with max-w-2xl
- Vertical stack with gap-8 between sections
- Three keyword input fields stacked with gap-4
- Single prominent CTA button below inputs

### Presentation Mode Layout
- Full viewport (100vh, 100vw)
- Content centered both horizontally and vertically
- Fixed navigation controls in bottom-right corner
- Slide counter in bottom-left corner

## Component Library

### Setup Interface
**Keyword Input Card**
- Single centered card with rounded-2xl corners
- Padding: p-12 (desktop), p-8 (mobile)
- Three text input fields with labels
- Each input: h-14, px-4, text-lg, rounded-lg
- Clear visual focus states on inputs

**Generate Button**
- Full-width within card
- Height: h-14
- Rounded: rounded-lg
- Text: text-lg, font-semibold
- Position: mt-8 below inputs

### Presentation Mode
**Photo Slides**
- Full-screen image with object-cover
- Subtle gradient overlay at bottom (for slide counter readability)
- Images from Unsplash API with relevant keywords

**Text Slides**
- Solid background (alternate between 2-3 neutral tones)
- Centered text content
- Max-width: max-w-4xl
- Padding: p-16 (desktop), p-8 (mobile)
- Text alignment: center

**Navigation Controls**
- Fixed position: bottom-4 right-4
- Semi-transparent backdrop with backdrop-blur-lg
- Rounded-full container with p-3
- Icon buttons: Previous, Play/Pause, Next
- Icons from Heroicons (CDN)

**Slide Counter**
- Fixed position: bottom-4 left-4
- Text: text-sm, font-medium
- Semi-transparent backdrop with backdrop-blur-md
- Padding: px-4 py-2, rounded-full

**Title Overlay** (on first slide only)
- Positioned at top-third of viewport
- Generated humorous title displayed with dramatic typography
- Background: backdrop-blur-xl with semi-transparent backdrop
- Padding: p-8 md:p-12
- Rounded: rounded-2xl
- Max-width: max-w-3xl, centered

### Header (Setup Mode)
- App title/logo at top
- Subtitle explaining PowerPoint karaoke concept
- Padding: py-8
- Text alignment: center

## Interaction Patterns

### Keyboard Navigation
- Space/Arrow keys: Navigate slides
- Escape: Exit presentation mode
- Enter: Start presentation from setup screen

### Slide Transitions
- Fade transition between slides (300ms duration)
- No aggressive animations - keep focus on content

### Auto-Advance (Optional Feature)
- Toggle in navigation controls
- Default: 8 seconds per slide
- Visual progress indicator (thin line at top)

## Responsive Behavior
- **Desktop (lg:)**: Optimized for projection/large screens
- **Tablet (md:)**: Adjust text sizing, maintain full-screen
- **Mobile (base)**: Stack inputs vertically, smaller typography

## Images
**Hero Section**: None - setup screen prioritizes functionality
**Presentation Slides**: 
- 70% photo slides (random stock images from Unsplash)
- 30% text slides with humorous statements
- Photo selection based on presentation keywords
- Text slides use solid backgrounds for contrast

## Accessibility
- Keyboard navigation throughout
- Clear focus indicators on all interactive elements
- Sufficient contrast on text slides
- Readable font sizes (minimum 16px base)

## Technical Notes
- Use Unsplash API for stock photos (free tier)
- OpenAI integration for title generation
- Local storage to save recent keyword sets
- Full-screen API for immersive presentation mode