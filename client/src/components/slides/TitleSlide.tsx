interface TitleSlideProps {
  content: string;
}

export default function TitleSlide({ content }: TitleSlideProps) {
  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-primary via-primary/80 to-primary/60 p-8 md:p-16">
      <div className="max-w-5xl text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight">
          {content}
        </h1>
      </div>
    </div>
  );
}
