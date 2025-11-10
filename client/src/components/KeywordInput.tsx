import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { keywordInputSchema, type KeywordInput } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Heart } from "lucide-react";
import mittwaldLogo from "@assets/mittwald_logo.svg";

interface KeywordInputProps {
  onSubmit: (data: KeywordInput) => void;
  isLoading?: boolean;
}

export default function KeywordInput({ onSubmit, isLoading }: KeywordInputProps) {
  const form = useForm<KeywordInput>({
    resolver: zodResolver(keywordInputSchema),
    defaultValues: {
      keyword1: "",
      keyword2: "",
      keyword3: "",
      presenterName: "",
      difficulty: "medium",
    },
  });

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="flex justify-center mb-8 bg-primary px-8 py-6 rounded-md">
        <img 
          src={mittwaldLogo} 
          alt="mittwald" 
          className="h-12"
          data-testid="img-mittwald-logo"
        />
      </div>
      
      <Card className="w-full">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            PowerPoint Karaoke
          </CardTitle>
          <CardDescription className="text-base">
            Enter three random keywords to generate a hilarious presentation
          </CardDescription>
        </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="keyword1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keyword 1</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="input-keyword1"
                        placeholder="e.g., Quantum"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="keyword2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keyword 2</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="input-keyword2"
                        placeholder="e.g., Bananas"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="keyword3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keyword 3</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="input-keyword3"
                        placeholder="e.g., Synergy"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="presenterName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Presenter Name</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="input-presenter-name"
                        placeholder="e.g., Dr. Jane Smith"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty (Absurdity Level)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-difficulty">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="easy">Easy (Slightly Amusing)</SelectItem>
                        <SelectItem value="medium">Medium (Moderately Absurd)</SelectItem>
                        <SelectItem value="hard">Hard (Completely Ridiculous)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              data-testid="button-generate"
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              {isLoading ? "Generating..." : "Generate Presentation"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
    
    <div className="text-center text-sm text-muted-foreground mt-6">
      <a 
        href="https://www.mittwald.de/mstudio/ai-hosting" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 hover-elevate active-elevate-2 px-3 py-1.5 rounded-md transition-colors"
        data-testid="link-mittwald-footer"
      >
        Built with <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500 mx-0.5" /> with mittwald AI hosting
      </a>
    </div>
  </div>
  );
}
