import { useEffect, useState, useCallback } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { type Slide } from "@shared/schema";
import PresentationSlide from "@/components/PresentationSlide";
import PresentationControls from "@/components/PresentationControls";
import { useLocation } from "wouter";

export default function Presentation() {
  const [, params] = useRoute("/presentation/:id");
  const [, setLocation] = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data, isLoading, error } = useQuery<{
    id: string;
    title: string;
    keywords: string[];
    slides: Slide[];
  }>({
    queryKey: ["/api/presentations", params?.id],
    enabled: !!params?.id,
  });

  const slides = data?.slides || [];

  const handlePrevious = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentSlide(prev => Math.max(0, prev - 1));
  }, [slides.length]);

  const handleNext = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1));
  }, [slides.length]);

  const handleExit = useCallback(() => {
    setLocation("/");
  }, [setLocation]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
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
  }, [handlePrevious, handleNext, handleExit]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading presentation...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center space-y-4">
          <div className="text-2xl">Presentation not found</div>
          <button
            onClick={() => setLocation("/")}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover-elevate active-elevate-2"
            data-testid="button-go-home"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

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
