import mittwaldLogo from "@assets/mittwald_logo.svg";

interface PhotoSlideProps {
  content: string;
  imageUrl: string;
  photoAuthorName?: string;
  photoAuthorUsername?: string;
  photoAuthorUrl?: string;
  photoUrl?: string;
}

export default function PhotoSlide({ 
  content, 
  imageUrl, 
  photoAuthorName, 
  photoAuthorUrl,
  photoUrl 
}: PhotoSlideProps) {
  return (
    <div className="absolute inset-0 w-full h-full">
      <img
        src={imageUrl}
        alt={content}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      
      <div className="absolute top-4 right-4 md:top-8 md:right-8">
        <img
          src={mittwaldLogo}
          alt="mittwald"
          className="h-8 md:h-12 w-auto opacity-90"
        />
      </div>
      
      {photoAuthorName && (
        <div className="absolute bottom-4 left-28 text-white/90 text-sm flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-2 rounded">
          <span>Photo by</span>
          {photoAuthorUrl ? (
            <a 
              href={photoAuthorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition-colors"
            >
              {photoAuthorName}
            </a>
          ) : (
            <span className="font-medium">{photoAuthorName}</span>
          )}
          <span>on</span>
          {photoUrl ? (
            <a 
              href={photoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition-colors"
            >
              Unsplash
            </a>
          ) : (
            <span className="font-medium">Unsplash</span>
          )}
        </div>
      )}
    </div>
  );
}
