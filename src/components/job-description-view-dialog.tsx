'use client';

import jsPDF from 'jspdf';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';


interface JobDescriptionViewDialogProps {
  jobDescription: string | null;
  onOpenChange: (open: boolean) => void;
}

export function JobDescriptionViewDialog({ jobDescription, onOpenChange }: JobDescriptionViewDialogProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    if (jobDescription) {
      navigator.clipboard.writeText(jobDescription);
      toast({
        title: "Copied to clipboard!",
        description: "The job description has been copied successfully.",
      });
    }
  };

  const handleDownload = () => {
    if (jobDescription) {
      const doc = new jsPDF();
      doc.text(jobDescription, 10, 10, {
        maxWidth: 190
      });
      doc.save('job-description.pdf');
      toast({
        title: "Downloading PDF",
        description: "Your job description is being downloaded.",
      });
    }
  };

  const renderFormattedDescription = () => {
    if (!jobDescription) return null;
  
    const lines = jobDescription.split('\n').filter(line => line.trim() !== '');
  
    return lines.map((line, index) => {
      line = line.trim();
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-headline mt-4 mb-2 text-primary">{line.substring(3)}</h2>;
      }
      if (line.startsWith('- ')) {
        return <li key={index} className="ml-4 list-disc">{line.substring(2)}</li>;
      }
      return <p key={index} className="my-2">{line}</p>;
    });
  };

  return (
    <Dialog open={!!jobDescription} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-primary">Job Description</DialogTitle>
          <DialogDescription>
            Review the full job description below. You can copy it or download it as a PDF.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <ScrollArea className="h-[450px] p-4 rounded-md border border-input bg-background/50">
             <div className="text-sm text-foreground space-y-2">
                {renderFormattedDescription()}
              </div>
          </ScrollArea>
           <div className="absolute top-2 right-2 flex gap-2">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" onClick={handleCopy} aria-label="Copy">
                <Copy className="h-5 w-5 text-accent-foreground" />
              </Button>
            </motion.div>
             <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download PDF">
                <Download className="h-5 w-5 text-accent-foreground" />
              </Button>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
