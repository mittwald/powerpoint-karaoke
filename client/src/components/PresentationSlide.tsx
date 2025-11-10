import { type Slide } from "@shared/schema";
import { cn } from "@/lib/utils";

interface PresentationSlideProps {
  slide: Slide;
  isActive: boolean;
}

const textSlideBackgrounds = [
  "bg-gradient-to-br from-primary/20 to-primary/5",
  "bg-gradient-to-br from-accent to-accent/50",
  "bg-gradient-to-br from-muted to-muted/50",
];

export default function PresentationSlide({ slide, isActive }: PresentationSlideProps) {
  if (!isActive) return null;

  if (slide.type === "photo" && slide.imageUrl) {
    return (
      <div className="absolute inset-0 w-full h-full">
        <img
          src={slide.imageUrl}
          alt={slide.content}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
    );
  }

  const backgroundIndex = Math.abs(slide.content.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % textSlideBackgrounds.length;
  const backgroundColor = textSlideBackgrounds[backgroundIndex];

  return (
    <div className={cn("absolute inset-0 w-full h-full flex items-center justify-center p-8 md:p-16", backgroundColor)}>
      <div className="max-w-4xl text-center">
        <p className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight">
          {slide.content}
        </p>
      </div>
    </div>
  );
}
