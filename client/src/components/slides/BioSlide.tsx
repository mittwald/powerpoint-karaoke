import mittwaldLogo from "@assets/mittwald_logo.svg";

interface BioSlideProps {
  content: string;
  bio?: string;
  facts?: string[];
}

export default function BioSlide({ content, bio, facts }: BioSlideProps) {
  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black p-8 md:p-16">
      <div className="absolute top-4 right-4 md:top-8 md:right-8">
        <img
          src={mittwaldLogo}
          alt="mittwald"
          className="h-8 md:h-12 w-auto opacity-90"
        />
      </div>

      <div className="max-w-5xl w-full space-y-10">
        <div className="text-center space-y-6">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
            {content}
          </h2>
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto" />
          <p className="text-xl md:text-2xl lg:text-3xl text-white/90 leading-relaxed max-w-4xl mx-auto">
            {bio}
          </p>
        </div>
        
        {facts && facts.length > 0 && (
          <div className="space-y-6 mt-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white text-center">
              Fun Facts
            </h3>
            <div className="grid gap-4 max-w-3xl mx-auto">
              {facts.map((fact, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-white/5 p-5 md:p-6 rounded-lg border border-white/10 backdrop-blur-sm"
                >
                  <span className="text-white font-bold text-2xl md:text-3xl shrink-0 opacity-50">
                    {index + 1}
                  </span>
                  <p className="text-lg md:text-xl lg:text-2xl text-white/90 flex-1 leading-relaxed">
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
