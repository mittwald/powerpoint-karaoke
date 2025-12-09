import { useState } from "react";
import { type KeywordInput as KeywordInputType } from "@shared/schema";
import KeywordInput from "@/components/KeywordInput";
import LoadingScreen from "@/components/LoadingScreen";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleKeywordSubmit = async (data: KeywordInputType) => {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/generate-presentation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate presentation");
      }

      const result = await response.json();

      // Navigate to the presentation page with the ID
      // Component will unmount, so no need to reset isLoading
      setLocation(`/presentation/${result.id}`);
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate presentation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-primary">
      <KeywordInput onSubmit={handleKeywordSubmit} isLoading={isLoading} />
      {isLoading && <LoadingScreen />}
    </div>
  );
}
