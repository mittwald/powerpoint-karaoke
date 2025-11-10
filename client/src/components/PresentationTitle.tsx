interface PresentationTitleProps {
  title: string;
  show: boolean;
}

export default function PresentationTitle({ title, show }: PresentationTitleProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10 p-8">
      <div className="backdrop-blur-xl bg-background/90 rounded-2xl p-8 md:p-12 max-w-3xl shadow-2xl border border-border pointer-events-auto">
        <h1 
          data-testid="text-presentation-title"
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-center bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent leading-tight"
        >
          {title}
        </h1>
      </div>
    </div>
  );
}
