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
      language: "english",
    },
  });

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="flex justify-center mb-8">
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
            Enter at least one keyword to generate a hilarious presentation
          </CardDescription>
        </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <FormLabel className="mb-2 block">Keywords (2nd & 3rd optional)</FormLabel>
                <div className="grid grid-cols-3 gap-2">
                  <FormField
                    control={form.control}
                    name="keyword1"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            data-testid="input-keyword1"
                            placeholder="e.g., TYPO3"
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
                        <FormControl>
                          <Input
                            data-testid="input-keyword2"
                            placeholder="Optional"
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
                        <FormControl>
                          <Input
                            data-testid="input-keyword3"
                            placeholder="Optional"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="presenterName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Presenter Name</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="input-presenter-name"
                        placeholder="e.g., Prof. Dr. Luisa Faßbender"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
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
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-language">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
    
    <div className="space-y-3 mt-6">
      <div className="text-center text-sm text-primary-foreground/80">
        <a 
          href="https://www.mittwald.de/mstudio/ai-hosting" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover-elevate active-elevate-2 px-3 py-1.5 rounded-md transition-colors text-primary-foreground/90 hover:text-primary-foreground"
          data-testid="link-mittwald-footer"
        >
          Built with <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500 mx-0.5" /> and mittwald AI hosting
        </a>
          <span className="text-primary-foreground/40">•</span>
          <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover-elevate active-elevate-2 px-3 py-1.5 rounded-md transition-colors text-primary-foreground/90 hover:text-primary-foreground"
              data-testid="link-unsplash-footer"
          >
              Images by Unsplash
          </a>
      </div>
      
      <div className="flex items-center justify-center gap-4 text-xs text-primary-foreground/60">
        <a 
          href="https://www.mittwald.de/impressum" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover-elevate active-elevate-2 px-2 py-1 rounded transition-colors hover:text-primary-foreground/80"
          data-testid="link-impressum"
        >
          Legal
        </a>
        <span className="text-primary-foreground/40">•</span>
        <a 
          href="https://github.com/mittwald/powerpoint-karaoke" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover-elevate active-elevate-2 px-2 py-1 rounded transition-colors hover:text-primary-foreground/80"
          data-testid="link-github"
        >
          GitHub
        </a>
      </div>
    </div>
  </div>
  );
}
