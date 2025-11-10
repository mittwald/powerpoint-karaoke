import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Pause, X } from "lucide-react";

interface PresentationControlsProps {
  currentSlide: number;
  totalSlides: number;
  isPlaying: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  onExit: () => void;
}

export default function PresentationControls({
  currentSlide,
  totalSlides,
  isPlaying,
  onPrevious,
  onNext,
  onTogglePlay,
  onExit,
}: PresentationControlsProps) {
  return (
    <>
      <div className="fixed bottom-4 left-4 backdrop-blur-lg bg-background/80 rounded-full px-4 py-2 text-sm font-medium text-foreground shadow-lg border border-border">
        <span data-testid="text-slide-counter">
          {currentSlide + 1} / {totalSlides}
        </span>
      </div>

      <div className="fixed bottom-4 right-4 flex items-center gap-2 backdrop-blur-lg bg-background/80 rounded-full p-3 shadow-lg border border-border">
        <Button
          data-testid="button-previous"
          size="icon"
          variant="ghost"
          onClick={onPrevious}
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          data-testid="button-play-pause"
          size="icon"
          variant="ghost"
          onClick={onTogglePlay}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
        <Button
          data-testid="button-next"
          size="icon"
          variant="ghost"
          onClick={onNext}
          disabled={currentSlide === totalSlides - 1}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          data-testid="button-exit"
          size="icon"
          variant="ghost"
          onClick={onExit}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
}
