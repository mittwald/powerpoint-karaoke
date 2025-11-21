import mittwaldLogo from "@assets/mittwald_logo.svg";
import type { GraphDataPoint } from "@shared/schema";

interface GraphSlideProps {
  content: string;
  graphTitle?: string;
  graphData: GraphDataPoint[];
}

export default function GraphSlide({ content, graphTitle, graphData }: GraphSlideProps) {
  const maxValue = Math.max(...graphData.map(d => d.value));
  
  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-black p-8 md:p-16">
      <div className="absolute top-4 right-4 md:top-8 md:right-8">
        <img
          src={mittwaldLogo}
          alt="mittwald"
          className="h-8 md:h-12 w-auto opacity-90"
        />
      </div>

      <div className="max-w-5xl w-full space-y-8">
        <div className="bg-white/5 p-8 rounded-lg border border-white/10 backdrop-blur-sm">
          <div className="flex justify-between gap-4">
            {graphData.map((dataPoint, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center justify-end h-80">
                  <div className="text-xl md:text-2xl font-bold text-white mb-2">
                    {dataPoint.value}
                  </div>
                  <div
                    className="w-full bg-white rounded-t-md transition-all"
                    style={{
                      height: `${(dataPoint.value / maxValue) * 100}%`,
                      minHeight: "20px",
                    }}
                  />
                </div>
                <div className="h-16 flex items-start justify-center mt-3">
                  <div className="text-sm md:text-base text-center text-white/80 font-medium max-w-full break-words line-clamp-3">
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
