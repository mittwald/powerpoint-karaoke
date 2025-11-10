import { useState } from "react";
import PresentationControls from "../PresentationControls";

export default function PresentationControlsExample() {
  const [currentSlide, setCurrentSlide] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);
  const totalSlides = 10;

  return (
    <div className="relative h-96 bg-gradient-to-br from-muted to-background border rounded-md">
      <PresentationControls
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        isPlaying={isPlaying}
        onPrevious={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
        onNext={() => setCurrentSlide(Math.min(totalSlides - 1, currentSlide + 1))}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onExit={() => console.log("Exit presentation")}
      />
    </div>
  );
}
