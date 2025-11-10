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

  // Title slide
  if (slide.type === "title") {
    return (
      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-primary via-primary/80 to-primary/60 p-8 md:p-16">
        <div className="max-w-5xl text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight">
            {slide.content}
          </h1>
        </div>
      </div>
    );
  }

  // Bio slide
  if (slide.type === "bio") {
    return (
      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-muted via-background to-muted/50 p-8 md:p-16">
        <div className="max-w-4xl w-full space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground">
              {slide.content}
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              {slide.bio}
            </p>
          </div>
          
          {slide.facts && slide.facts.length > 0 && (
            <div className="space-y-3 mt-8">
              <h3 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-6">
                Fun Facts
              </h3>
              <div className="grid gap-3">
                {slide.facts.map((fact, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 bg-card/50 p-4 rounded-lg border border-border"
                  >
                    <span className="text-primary font-bold text-xl shrink-0">
                      {index + 1}.
                    </span>
                    <p className="text-lg md:text-xl text-foreground flex-1">
                      {fact}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Photo slide
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

  // Graph slide
  if (slide.type === "graph" && slide.graphData && slide.graphData.length > 0) {
    const maxValue = Math.max(...slide.graphData.map(d => d.value));
    
    return (
      <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-background via-accent/10 to-muted/20 p-8 md:p-16">
        <div className="max-w-5xl w-full space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center">
            {slide.graphTitle || slide.content}
          </h2>
          <div className="bg-card/50 p-8 rounded-lg border border-border">
            <div className="flex items-end justify-between gap-4 h-80">
              {slide.graphData.map((dataPoint, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-3">
                  <div className="w-full flex flex-col items-center justify-end flex-1">
                    <div className="text-xl md:text-2xl font-bold text-primary mb-2">
                      {dataPoint.value}
                    </div>
                    <div
                      className="w-full bg-primary rounded-t-md transition-all"
                      style={{
                        height: `${(dataPoint.value / maxValue) * 100}%`,
                        minHeight: "20px",
                      }}
                    />
                  </div>
                  <div className="text-sm md:text-base text-center text-muted-foreground font-medium max-w-full break-words">
                    {dataPoint.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quote slide
  if (slide.type === "quote" && slide.quote) {
    return (
      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/30 via-background to-accent/10 p-8 md:p-16">
        <div className="max-w-4xl w-full space-y-8">
          <div className="relative">
            <div className="text-8xl md:text-9xl text-primary/20 absolute -top-8 -left-4">"</div>
            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-medium text-foreground leading-relaxed italic pl-8 md:pl-12">
              {slide.quote}
            </blockquote>
          </div>
          <div className="pl-8 md:pl-12 space-y-1">
            <p className="text-xl md:text-2xl font-semibold text-foreground">
              — {slide.author}
            </p>
            {slide.authorTitle && (
              <p className="text-lg md:text-xl text-muted-foreground">
                {slide.authorTitle}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Text slide (default)
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
