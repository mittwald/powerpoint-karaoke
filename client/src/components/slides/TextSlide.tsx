import mittwaldLogo from "@assets/mittwald_logo.svg";

interface TextSlideProps {
  content: string;
}

export default function TextSlide({ content }: TextSlideProps) {
  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center p-8 md:p-16 bg-black">
      <div className="absolute top-4 right-4 md:top-8 md:right-8">
        <img
          src={mittwaldLogo}
          alt="mittwald"
          className="h-8 md:h-12 w-auto opacity-90"
        />
      </div>

      <div className="max-w-5xl text-center space-y-8">
        <p className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight tracking-tight">
          {content}
        </p>
        <div className="h-1 w-32 bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto" />
      </div>
    </div>
  );
}
