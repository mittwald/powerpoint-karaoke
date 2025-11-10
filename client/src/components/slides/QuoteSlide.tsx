import mittwaldLogo from "@assets/mittwald_logo.svg";

interface QuoteSlideProps {
  quote: string;
  author?: string;
  authorTitle?: string;
}

export default function QuoteSlide({ quote, author, authorTitle }: QuoteSlideProps) {
  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black p-8 md:p-16">
      <div className="absolute top-4 right-4 md:top-8 md:right-8">
        <img
          src={mittwaldLogo}
          alt="mittwald"
          className="h-8 md:h-12 w-auto opacity-90"
        />
      </div>

      <div className="max-w-5xl w-full space-y-8">
        <div className="relative">
          <div className="text-8xl md:text-9xl text-white/20 absolute -top-8 -left-4">"</div>
          <blockquote className="text-3xl md:text-4xl lg:text-5xl font-medium text-white leading-relaxed italic pl-8 md:pl-12">
            {quote}
          </blockquote>
        </div>
        <div className="pl-8 md:pl-12 space-y-2">
          <p className="text-2xl md:text-3xl font-bold text-white">
            — {author}
          </p>
          {authorTitle && (
            <p className="text-xl md:text-2xl text-white/70">
              {authorTitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
