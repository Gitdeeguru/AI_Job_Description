'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Copy, RefreshCw, FileText } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

interface JobDescriptionDisplayProps {
  jobDescription: string | null;
  isLoading: boolean;
  onRegenerate: () => void;
}

export function JobDescriptionDisplay({ jobDescription, isLoading, onRegenerate }: JobDescriptionDisplayProps) {
  const { toast } = useToast()

  const handleCopy = () => {
    if (jobDescription) {
      navigator.clipboard.writeText(jobDescription);
      toast({
        title: "Copied to clipboard!",
        description: "The job description has been copied successfully.",
      })
    }
  };

  const formattedDescription = jobDescription
    ?.split('\n')
    .filter(p => p.trim() !== '')
    .map((paragraph, index) => <p key={index}>{paragraph}</p>);

  return (
    <Card className="bg-card/50 border-primary/20 shadow-lg h-full backdrop-blur-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-2xl text-primary">Generated Description</CardTitle>
        {jobDescription && !isLoading && (
          <div className="flex gap-2">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" onClick={handleCopy} aria-label="Copy">
                <Copy className="h-5 w-5 text-accent" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" onClick={onRegenerate} aria-label="Regenerate">
                <RefreshCw className="h-5 w-5 text-accent" />
              </Button>
            </motion.div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] p-4 rounded-md border border-input bg-background/50">
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <br/>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </motion.div>
            )}

            {!isLoading && jobDescription && (
              <motion.div
                key="description"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-foreground space-y-4"
              >
                {formattedDescription}
              </motion.div>
            )}

            {!isLoading && !jobDescription && (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full text-center text-muted-foreground"
              >
                <FileText className="h-16 w-16 mb-4" />
                <p className="font-semibold">Your generated job description will appear here.</p>
                <p className="text-sm">Fill out the form to get started.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
