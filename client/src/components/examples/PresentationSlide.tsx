import PresentationSlide from "../PresentationSlide";

export default function PresentationSlideExample() {
  const photoSlide = {
    type: "photo" as const,
    content: "Beautiful landscape",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
  };

  const textSlide = {
    type: "text" as const,
    content: "The Future of Quantum Banana Synergy",
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full aspect-video bg-background border rounded-md overflow-hidden">
        <PresentationSlide slide={photoSlide} isActive={true} />
      </div>
      <div className="relative w-full aspect-video bg-background border rounded-md overflow-hidden">
        <PresentationSlide slide={textSlide} isActive={true} />
      </div>
    </div>
  );
}
