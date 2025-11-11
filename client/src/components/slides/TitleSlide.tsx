import mittwaldLogo from "@assets/mittwald_logo.svg";

interface TitleSlideProps {
  content: string;
}

export default function TitleSlide({ content }: TitleSlideProps) {
  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center p-8 md:p-16 bg-black overflow-hidden">
      {/* mittwald logo */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20">
        <img
          src={mittwaldLogo}
          alt="mittwald"
          className="h-8 md:h-12 w-auto opacity-90"
        />
      </div>

      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-primary to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-primary to-transparent" />
      </div>

      {/* Geometric accent lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* Main content */}
      <div className="max-w-5xl text-center space-y-8 z-10">
        {/* Top accent bar */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 md:w-32 bg-gradient-to-r from-transparent to-primary/60" />
          <div className="h-2 w-2 rounded-full bg-primary/80" />
          <div className="h-px w-16 md:w-32 bg-gradient-to-l from-transparent to-primary/60" />
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight tracking-tight">
          {content}
        </h1>

        {/* Bottom accent bar */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <div className="h-px w-16 md:w-32 bg-gradient-to-r from-transparent to-primary/60" />
          <div className="h-2 w-2 rounded-full bg-primary/80" />
          <div className="h-px w-16 md:w-32 bg-gradient-to-l from-transparent to-primary/60" />
        </div>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/70 font-light tracking-wide mt-8">
          PowerPoint Karaoke
        </p>
      </div>
    </div>
  );
}
