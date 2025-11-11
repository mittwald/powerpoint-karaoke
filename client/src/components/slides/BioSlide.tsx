import mittwaldLogo from "@assets/mittwald_logo.svg";

interface BioSlideProps {
  content: string;
  bio?: string;
  facts?: string[];
}

export default function BioSlide({ content, bio, facts }: BioSlideProps) {
  const displayedFacts = facts?.slice(0, 3) || [];
  const hasMultipleFacts = displayedFacts.length > 1;

  return (
    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-10">
        <img
          src={mittwaldLogo}
          alt="mittwald"
          className="h-8 md:h-12 w-auto opacity-90"
        />
      </div>

      <div className="h-full w-full flex items-center justify-center p-6 md:p-12 lg:p-16">
        <div className="max-w-5xl w-full" style={{ display: 'flex', flexDirection: 'column', gap: hasMultipleFacts ? 'clamp(1rem, 3vh, 2.5rem)' : 'clamp(1.5rem, 4vh, 3rem)' }}>
          <div className="text-center" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.75rem, 2vh, 1.5rem)' }}>
            <h2 
              className="font-bold text-white tracking-tight leading-tight"
              style={{ 
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            >
              {content}
            </h2>
            <div className="h-1 w-32 bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto" />
            <p 
              className="text-white/90 max-w-4xl mx-auto"
              style={{ 
                fontSize: 'clamp(1rem, 2.5vw, 1.75rem)',
                lineHeight: '1.5',
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            >
              {bio}
            </p>
          </div>
          
          {displayedFacts.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.75rem, 2vh, 1.5rem)' }}>
              <h3 
                className="font-bold text-white text-center"
                style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}
              >
                Fun Facts
              </h3>
              <div className="grid max-w-3xl mx-auto w-full" style={{ gap: 'clamp(0.5rem, 1.5vh, 1rem)' }}>
                {displayedFacts.map((fact, index) => (
                  <div
                    key={index}
                    className="flex items-start bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm"
                    style={{ 
                      gap: 'clamp(0.5rem, 1.5vw, 1rem)',
                      padding: 'clamp(0.75rem, 2vh, 1.25rem)'
                    }}
                  >
                    <span 
                      className="text-white font-bold shrink-0 opacity-50"
                      style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)' }}
                    >
                      {index + 1}
                    </span>
                    <p 
                      className="text-white/90 flex-1"
                      style={{ 
                        fontSize: 'clamp(0.875rem, 2vw, 1.25rem)',
                        lineHeight: '1.4',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word'
                      }}
                    >
                      {fact}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
