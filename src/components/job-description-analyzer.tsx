'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';
import { analyzeJobDescription } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

const formSchema = z.object({
  jobDescription: z.string().min(50, { message: 'Job description must be at least 50 characters.' }),
});

type AnalysisResult = {
  structuredContent: string;
  recommendations: string;
} | null;

export function JobDescriptionAnalyzer() {
  const [analysis, setAnalysis] = useState<AnalysisResult>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobDescription: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setAnalysis(null);
    try {
      const result = await analyzeJobDescription(data);
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing job description:', error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with analyzing the job description.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormattedText = (text: string) => {
    // Replace escaped newlines and then split by newline
    const lines = text.replace(/\\n/g, '\n').split('\n').filter(line => line.trim() !== '');

    return lines.map((line, index) => {
        line = line.trim();
        // Match headings like ## Title
        if (line.match(/^##\s/)) {
            return <h2 key={index} className="text-xl font-headline mt-4 mb-2 text-primary">{line.substring(line.indexOf(' ') + 1)}</h2>;
        }
        // Match bullet points like - item or * item
        if (line.match(/^[-*]\s/)) {
            return <li key={index} className="ml-4 list-disc">{line.substring(line.indexOf(' ') + 1)}</li>;
        }
        // Match numbered list items like 1. item
        if (line.match(/^\d+\.\s/)) {
            return <li key={index} className="ml-6" style={{ listStyleType: 'decimal' }}>{line.substring(line.indexOf(' ') + 1)}</li>;
        }
        return <p key={index} className="my-2">{line}</p>;
    });
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-4"
    >
      <Card className="bg-card/50 border-primary/20 shadow-lg backdrop-blur-md">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">Analyze a Job Description</CardTitle>
          <CardDescription>Paste a job description below to get AI-powered feedback.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="jobDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the full job description here..."
                        className="resize-y min-h-[300px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Analyze Description
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card className="bg-card/50 border-primary/20 shadow-lg h-full backdrop-blur-md">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] p-4 rounded-md border border-input bg-background/50">
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {!isLoading && !analysis && (
               <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <Wand2 className="h-16 w-16 mb-4" />
                <p className="font-semibold">Your analysis will appear here.</p>
                <p className="text-sm">Paste a job description and click "Analyze" to start.</p>
              </div>
            )}
            {!isLoading && analysis && (
              <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-accent mb-2">Restructured Description</h3>
                  <div className="text-sm text-foreground space-y-2 prose">
                    {renderFormattedText(analysis.structuredContent)}
                  </div>
                </div>
                <Separator />
                 <div>
                  <h3 className="text-lg font-semibold text-accent mb-2">AI Recommendations</h3>
                   <div className="text-sm text-foreground space-y-2 prose">
                    {renderFormattedText(analysis.recommendations)}
                  </div>
                </div>
              </motion.div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
}
