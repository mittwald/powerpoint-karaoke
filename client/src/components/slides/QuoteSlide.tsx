interface QuoteSlideProps {
  quote: string;
  author?: string;
  authorTitle?: string;
}

export default function QuoteSlide({ quote, author, authorTitle }: QuoteSlideProps) {
  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/30 via-background to-accent/10 p-8 md:p-16">
      <div className="max-w-4xl w-full space-y-8">
        <div className="relative">
          <div className="text-8xl md:text-9xl text-primary/20 absolute -top-8 -left-4">"</div>
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-medium text-foreground leading-relaxed italic pl-8 md:pl-12">
            {quote}
          </blockquote>
        </div>
        <div className="pl-8 md:pl-12 space-y-1">
          <p className="text-xl md:text-2xl font-semibold text-foreground">
            — {author}
          </p>
          {authorTitle && (
            <p className="text-lg md:text-xl text-muted-foreground">
              {authorTitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
