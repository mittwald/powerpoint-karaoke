import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const LOADING_MESSAGES = [
  "Consulting the corporate buzzword generator...",
  "Adding unnecessary animations to slide transitions...",
  "Calibrating the synergy matrix...",
  "Generating fake statistics for maximum impact...",
  "Mixing fonts that shouldn't be together...",
  "Creating graphs with questionable data sources...",
  "Sprinkling industry jargon liberally...",
  "Ensuring every slide has at least one stock photo...",
  "Maximizing use of the word 'innovative'...",
  "Aligning the strategic paradigm shift...",
  "Optimizing for maximum bullet points...",
  "Teaching AI the art of corporate speak...",
  "Downloading more RAM for your slides...",
  "Reverse-engineering the PowerPoint 97 aesthetic...",
  "Asking ChatGPT to explain quantum mechanics in 3 slides...",
  "Convincing stock photo people to smile more awkwardly...",
  "Making sure Comic Sans isn't accidentally used...",
  "Calculating the optimal number of exclamation marks!!",
  "Preparing your elevator pitch for an escalator...",
  "Translating 'I don't know' into 'let's circle back'...",
];

export default function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 dark:to-primary/10"
      data-testid="loading-screen"
    >
      <div className="max-w-2xl px-8 text-center space-y-8">
        {/* Animated Logo/Spinner */}
        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 dark:border-primary/30 animate-spin" />
            
            {/* Inner pulsing circle */}
            <div className="flex items-center justify-center w-full h-full">
              <Loader2 
                className="text-primary animate-spin w-16 h-16" 
                strokeWidth={2.5}
              />
            </div>
          </div>
        </div>

        {/* Main Title */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-foreground">
            Generating Your Masterpiece
          </h1>
          <div className="h-1 w-32 mx-auto bg-primary rounded-full" />
        </div>

        {/* Rotating Messages */}
        <div className="min-h-[80px] flex items-center justify-center">
          <p 
            key={messageIndex}
            className="text-lg text-muted-foreground animate-in fade-in-0 slide-in-from-bottom-2 duration-500"
            data-testid="loading-message"
          >
            {LOADING_MESSAGES[messageIndex]}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="space-y-3">
          <div className="flex justify-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse [animation-delay:0s] [animation-duration:1.5s]" />
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse [animation-delay:0.15s] [animation-duration:1.5s]" />
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse [animation-delay:0.3s] [animation-duration:1.5s]" />
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse [animation-delay:0.45s] [animation-duration:1.5s]" />
          </div>
          <p className="text-sm text-muted-foreground/70">
            This may take a few moments...
          </p>
        </div>
      </div>
    </div>
  );
}
