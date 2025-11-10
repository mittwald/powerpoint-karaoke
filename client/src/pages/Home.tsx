import { useState, useEffect, useCallback } from "react";
import { type KeywordInput as KeywordInputType, type Slide } from "@shared/schema";
import KeywordInput from "@/components/KeywordInput";
import PresentationSlide from "@/components/PresentationSlide";
import PresentationControls from "@/components/PresentationControls";
import PresentationTitle from "@/components/PresentationTitle";

// TODO: remove mock functionality - replace with actual API calls
const mockGenerateTitle = (keywords: KeywordInputType): string => {
  const templates = [
    `The Inevitable Rise of ${keywords.keyword1} ${keywords.keyword2} ${keywords.keyword3}`,
    `${keywords.keyword1} Meets ${keywords.keyword2}: A ${keywords.keyword3} Story`,
    `Why ${keywords.keyword1} is the ${keywords.keyword2} of ${keywords.keyword3}`,
    `${keywords.keyword3} in the Age of ${keywords.keyword1} and ${keywords.keyword2}`,
    `${keywords.keyword1}, ${keywords.keyword2}, and the Future of ${keywords.keyword3}`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
};

// TODO: remove mock functionality - replace with actual Unsplash API calls
const mockGenerateSlides = (keywords: KeywordInputType): Slide[] => {
  const slides: Slide[] = [];
  const searchTerms = [keywords.keyword1, keywords.keyword2, keywords.keyword3];
  
  const textSlideTemplates = [
    `"${keywords.keyword1} is just ${keywords.keyword2} in disguise"`,
    `Key Benefits of ${keywords.keyword3}`,
    `The ${keywords.keyword1} Revolution`,
    `${keywords.keyword2}: A Case Study`,
    `Common Misconceptions About ${keywords.keyword3}`,
    `The Future is ${keywords.keyword1}`,
    `Why We Need More ${keywords.keyword2}`,
    `${keywords.keyword3}: Then vs. Now`,
    `Breaking Down ${keywords.keyword1}`,
    `The ${keywords.keyword2} Paradigm Shift`,
  ];

  const unsplashImages = [
    "photo-1506905925346-21bda4d32df4",
    "photo-1469474968028-56623f02e42e",
    "photo-1470071459604-3b5ec3a7fe05",
    "photo-1441974231531-c6227db76b6e",
    "photo-1472214103451-9374bd1c798e",
    "photo-1418065460487-3e41a6c84dc5",
    "photo-1502082553048-f009c37129b9",
    "photo-1475776408506-9a5371e7a068",
    "photo-1464822759023-fed622ff2c3b",
    "photo-1426604966848-d7adac402bff",
  ];

  for (let i = 0; i < 12; i++) {
    if (i % 4 === 3) {
      slides.push({
        type: "text",
        content: textSlideTemplates[Math.floor(Math.random() * textSlideTemplates.length)],
      });
    } else {
      const imageId = unsplashImages[Math.floor(Math.random() * unsplashImages.length)];
      const searchTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
      slides.push({
        type: "photo",
        content: searchTerm,
        imageUrl: `https://images.unsplash.com/${imageId}?w=1920&h=1080&fit=crop`,
      });
    }
  }

  return slides;
};

export default function Home() {
  const [presentationTitle, setPresentationTitle] = useState<string>("");
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTitle, setShowTitle] = useState(false);

  const handleKeywordSubmit = async (data: KeywordInputType) => {
    setIsLoading(true);
    
    // TODO: replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const title = mockGenerateTitle(data);
    const generatedSlides = mockGenerateSlides(data);
    
    setPresentationTitle(title);
    setSlides(generatedSlides);
    setCurrentSlide(0);
    setIsPresenting(true);
    setIsPlaying(true);
    setShowTitle(true);
    setIsLoading(false);

    setTimeout(() => setShowTitle(false), 4000);
  };

  const handlePrevious = useCallback(() => {
    setCurrentSlide(prev => Math.max(0, prev - 1));
    setIsPlaying(false);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1));
    setIsPlaying(false);
  }, [slides.length]);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handleExit = useCallback(() => {
    setIsPresenting(false);
    setIsPlaying(false);
    setCurrentSlide(0);
    setShowTitle(false);
  }, []);

  useEffect(() => {
    if (!isPlaying || !isPresenting) return;

    const timer = setTimeout(() => {
      if (currentSlide < slides.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, [isPlaying, currentSlide, slides.length, isPresenting]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPresenting) {
        if (e.key === "Enter") {
          const generateButton = document.querySelector('[data-testid="button-generate"]') as HTMLButtonElement;
          generateButton?.click();
        }
        return;
      }

      switch (e.key) {
        case "ArrowLeft":
          handlePrevious();
          break;
        case "ArrowRight":
        case " ":
          e.preventDefault();
          handleNext();
          break;
        case "Escape":
          handleExit();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isPresenting, handlePrevious, handleNext, handleExit]);

  if (isPresenting) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-background overflow-hidden">
        <div className="relative w-full h-full">
          {slides.map((slide, index) => (
            <PresentationSlide
              key={index}
              slide={slide}
              isActive={index === currentSlide}
            />
          ))}
          <PresentationTitle title={presentationTitle} show={showTitle} />
          <PresentationControls
            currentSlide={currentSlide}
            totalSlides={slides.length}
            isPlaying={isPlaying}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onTogglePlay={handleTogglePlay}
            onExit={handleExit}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-background via-accent/5 to-primary/5">
      <KeywordInput onSubmit={handleKeywordSubmit} isLoading={isLoading} />
    </div>
  );
}
