import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { keywordInputSchema, type KeywordInput } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

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
    },
  });

  return (
    <Card className="w-full max-w-2xl">
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
  );
}
