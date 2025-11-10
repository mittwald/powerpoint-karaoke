import { cn } from "@/lib/utils";

interface TextSlideProps {
  content: string;
}

const textSlideBackgrounds = [
  "bg-gradient-to-br from-primary/20 to-primary/5",
  "bg-gradient-to-br from-accent to-accent/50",
  "bg-gradient-to-br from-muted to-muted/50",
];

export default function TextSlide({ content }: TextSlideProps) {
  const backgroundIndex = Math.abs(content.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % textSlideBackgrounds.length;
  const backgroundColor = textSlideBackgrounds[backgroundIndex];

  return (
    <div className={cn("absolute inset-0 w-full h-full flex items-center justify-center p-8 md:p-16", backgroundColor)}>
      <div className="max-w-4xl text-center">
        <p className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight">
          {content}
        </p>
      </div>
    </div>
  );
}
