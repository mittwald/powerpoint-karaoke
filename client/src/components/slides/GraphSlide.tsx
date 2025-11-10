import type { GraphDataPoint } from "@shared/schema";

interface GraphSlideProps {
  content: string;
  graphTitle?: string;
  graphData: GraphDataPoint[];
}

export default function GraphSlide({ content, graphTitle, graphData }: GraphSlideProps) {
  const maxValue = Math.max(...graphData.map(d => d.value));
  
  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-background via-accent/10 to-muted/20 p-8 md:p-16">
      <div className="max-w-5xl w-full space-y-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center">
          {graphTitle || content}
        </h2>
        <div className="bg-card/50 p-8 rounded-lg border border-border">
          <div className="flex justify-between gap-4">
            {graphData.map((dataPoint, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center justify-end h-80">
                  <div className="text-xl md:text-2xl font-bold text-primary mb-2">
                    {dataPoint.value}
                  </div>
                  <div
                    className="w-full bg-primary rounded-t-md transition-all"
                    style={{
                      height: `${(dataPoint.value / maxValue) * 100}%`,
                      minHeight: "20px",
                    }}
                  />
                </div>
                <div className="h-16 flex items-start justify-center mt-3">
                  <div className="text-sm md:text-base text-center text-muted-foreground font-medium max-w-full break-words line-clamp-3">
                    {dataPoint.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
