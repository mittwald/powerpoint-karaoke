import { useState, useEffect, useCallback } from "react";
import { type KeywordInput as KeywordInputType, type Slide } from "@shared/schema";
import KeywordInput from "@/components/KeywordInput";
import PresentationSlide from "@/components/PresentationSlide";
import PresentationControls from "@/components/PresentationControls";

// TODO: remove mock functionality - replace with actual API calls
const mockGenerateTitle = (keywords: KeywordInputType): string => {
  const difficultyMultipliers = {
    easy: 0,
    medium: 1,
    hard: 2,
  };
  
  const templates = [
    [
      `The Rise of ${keywords.keyword1} ${keywords.keyword2}`,
      `${keywords.keyword1} Meets ${keywords.keyword2}: A ${keywords.keyword3} Story`,
      `Understanding ${keywords.keyword3} Through ${keywords.keyword1}`,
    ],
    [
      `The Inevitable Rise of ${keywords.keyword1} ${keywords.keyword2} ${keywords.keyword3}`,
      `Why ${keywords.keyword1} is the ${keywords.keyword2} of ${keywords.keyword3}`,
      `${keywords.keyword3} in the Age of ${keywords.keyword1} and ${keywords.keyword2}`,
    ],
    [
      `${keywords.keyword1}-Powered ${keywords.keyword2}: The ${keywords.keyword3} Revolution Nobody Asked For`,
      `How I Learned to Stop Worrying and Love ${keywords.keyword1} ${keywords.keyword2} ${keywords.keyword3}`,
      `${keywords.keyword1} ${keywords.keyword2} ${keywords.keyword3}: A Journey Through Chaos and Confusion`,
    ],
  ];
  
  const level = difficultyMultipliers[keywords.difficulty];
  const options = templates[level];
  return options[Math.floor(Math.random() * options.length)];
};

// TODO: remove mock functionality - replace with actual Unsplash API calls
const mockGenerateSlides = (keywords: KeywordInputType): Slide[] => {
  const slides: Slide[] = [];
  const searchTerms = [keywords.keyword1, keywords.keyword2, keywords.keyword3];
  
  // First slide: Title
  const title = mockGenerateTitle(keywords);
  slides.push({
    type: "title",
    content: title,
  });
  
  // Second slide: Presenter bio with facts
  const bioTemplates = {
    easy: [
      `Senior Consultant specializing in ${keywords.keyword2}`,
      `PhD in ${keywords.keyword1} Studies from MIT`,
    ],
    medium: [
      `Former ${keywords.keyword1} Whisperer, Currently pioneering ${keywords.keyword2} integration`,
      `3-time ${keywords.keyword3} Champion, Self-proclaimed ${keywords.keyword1} Guru`,
    ],
    hard: [
      `CEO of ${keywords.keyword1} Solutions Inc., Inventor of the ${keywords.keyword2} Protocol, Certified ${keywords.keyword3} Ninja`,
      `Time Traveler from the year 2087, Interdimensional ${keywords.keyword1} Expert, ${keywords.keyword2} Enthusiast`,
    ],
  };
  
  const factsTemplates = {
    easy: [
      [`Published 15 papers on ${keywords.keyword1}`, `Guest speaker at ${keywords.keyword2} conference 2024`, `Enjoys hiking on weekends`],
      [`10+ years in ${keywords.keyword3} consulting`, `Featured in Forbes Under 40`, `Avid chess player`],
    ],
    medium: [
      [`Once ${keywords.keyword1}-ed for 72 hours straight`, `Holds world record for fastest ${keywords.keyword2} implementation`, `Can recite ${keywords.keyword3} backwards`, `Banned from 3 countries for excessive ${keywords.keyword1}`],
      [`Trained dolphins to understand ${keywords.keyword2}`, `Survived a ${keywords.keyword3} explosion`, `Owns 47 ${keywords.keyword1} patents`, `Once arm-wrestled a robot`],
    ],
    hard: [
      [`Invented ${keywords.keyword1} in a dream`, `Communicates telepathically with ${keywords.keyword2}`, `Was briefly a unicorn in 2019`, `Discovered ${keywords.keyword3} on Mars`, `Can taste colors`],
      [`Time Magazine Person of the Year 2087`, `Holds PhD from Hogwarts in ${keywords.keyword1}`, `Once defeated a supercomputer using only ${keywords.keyword2}`, `Claims to be immortal`, `Won Nobel Prize (from the future)`],
    ],
  };
  
  const bioOptions = bioTemplates[keywords.difficulty];
  const factsOptions = factsTemplates[keywords.difficulty];
  const selectedBio = bioOptions[Math.floor(Math.random() * bioOptions.length)];
  const selectedFacts = factsOptions[Math.floor(Math.random() * factsOptions.length)];
  
  slides.push({
    type: "bio",
    content: keywords.presenterName,
    bio: selectedBio,
    facts: selectedFacts,
  });
  
  const textSlideTemplates = {
    easy: [
      `Key Benefits of ${keywords.keyword3}`,
      `The ${keywords.keyword1} Revolution`,
      `${keywords.keyword2}: A Case Study`,
    ],
    medium: [
      `"${keywords.keyword1} is just ${keywords.keyword2} in disguise"`,
      `Why We Need More ${keywords.keyword2}`,
      `${keywords.keyword3}: Then vs. Now`,
    ],
    hard: [
      `${keywords.keyword1}: Now with 300% More ${keywords.keyword2}!`,
      `Warning: ${keywords.keyword3} May Cause Spontaneous ${keywords.keyword1}`,
      `Scientists Baffled by ${keywords.keyword2} Discovery`,
    ],
  };

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

  const textOptions = textSlideTemplates[keywords.difficulty];
  
  for (let i = 0; i < 12; i++) {
    if (i % 4 === 3) {
      slides.push({
        type: "text",
        content: textOptions[Math.floor(Math.random() * textOptions.length)],
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

  slides.push({
    type: "text",
    content: "Thank You!",
  });

  return slides;
};

export default function Home() {
  const [presentationTitle, setPresentationTitle] = useState<string>("");
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleKeywordSubmit = async (data: KeywordInputType) => {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/generate-presentation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to generate presentation");
      }

      const result = await response.json();
      
      setPresentationTitle(result.title);
      setSlides(result.slides);
      setCurrentSlide(0);
      setIsPresenting(true);
    } catch (error) {
      console.error("Error:", error);
      // Fallback to mock data if API fails
      const title = mockGenerateTitle(data);
      const generatedSlides = mockGenerateSlides(data);
      
      setPresentationTitle(title);
      setSlides(generatedSlides);
      setCurrentSlide(0);
      setIsPresenting(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = useCallback(() => {
    setCurrentSlide(prev => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1));
  }, [slides.length]);

  const handleExit = useCallback(() => {
    setIsPresenting(false);
    setCurrentSlide(0);
  }, []);

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
          <PresentationControls
            currentSlide={currentSlide}
            totalSlides={slides.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onExit={handleExit}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-primary">
      <KeywordInput onSubmit={handleKeywordSubmit} isLoading={isLoading} />
    </div>
  );
}
