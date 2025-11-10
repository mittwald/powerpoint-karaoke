interface BioSlideProps {
  content: string;
  bio?: string;
  facts?: string[];
}

export default function BioSlide({ content, bio, facts }: BioSlideProps) {
  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-muted via-background to-muted/50 p-8 md:p-16">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground">
            {content}
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            {bio}
          </p>
        </div>
        
        {facts && facts.length > 0 && (
          <div className="space-y-3 mt-8">
            <h3 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-6">
              Fun Facts
            </h3>
            <div className="grid gap-3">
              {facts.map((fact, index) => (
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
