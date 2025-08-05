'use client';

import { useState, useRef, DragEvent } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, UploadCloud, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { parseJobDescriptionFile } from '@/ai/flows/parse-job-description-file';
import type { ParseJobDescriptionFileOutput } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

export function JobDescriptionParser() {
  const [parsedData, setParsedData] = useState<ParseJobDescriptionFileOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
        // For simplicity, we'll accept any file, but in a real app you might filter by type
        // e.g., application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document
        setFile(selectedFile);
        setParsedData(null); // Reset previous results
    }
  }

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleParse = async () => {
    if (!file) {
        toast({
            variant: "destructive",
            title: "No file selected",
            description: "Please upload a file to parse.",
        });
        return;
    }

    setIsLoading(true);
    setParsedData(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
        const fileContent = e.target?.result as string;
        try {
            const result = await parseJobDescriptionFile({ fileContent });
            setParsedData(result);
        } catch (error) {
            console.error('Error parsing job description:', error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with parsing the document.",
            });
        } finally {
            setIsLoading(false);
        }
    };
    reader.onerror = () => {
        toast({
            variant: "destructive",
            title: "File Read Error",
            description: "Could not read the selected file.",
        });
        setIsLoading(false);
    }
    reader.readAsText(file);
  };

  const renderListItem = (item: string) => (
    <li key={item} className="ml-4 list-disc">{item}</li>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-4"
    >
      <Card className="bg-card/50 border-primary/20 shadow-lg backdrop-blur-md">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">Upload</CardTitle>
          <CardDescription>Upload a job description file (e.g., pdf or doc) to automatically parse and structure its content.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
            <div 
              className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-primary bg-primary/10' : 'border-primary/30 bg-background/50 hover:bg-primary/5'}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
                <input 
                    ref={fileInputRef}
                    type="file" 
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                />
                <UploadCloud className="h-12 w-12 text-primary/50 mb-2" />
                <p className="text-muted-foreground mb-2">Drag & drop a file here, or click to select a file</p>
                {file && (
                    <div className="mt-2 flex items-center gap-2 text-sm font-medium text-foreground">
                        <FileText className="h-4 w-4" />
                        <span>{file.name}</span>
                    </div>
                )}
            </div>
            <motion.div className="mt-6" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button onClick={handleParse} disabled={isLoading || !file}>
                {isLoading ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                    </>
                ) : (
                    'Generate'
                )}
                </Button>
            </motion.div>
        </CardContent>
      </Card>
      
      <Card className="bg-card/50 border-primary/20 shadow-lg h-full backdrop-blur-md">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">GENERATED JD BY AI</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] p-4 rounded-md border border-input bg-background/50">
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {!isLoading && !parsedData && (
               <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <FileText className="h-16 w-16 mb-4" />
                <p className="font-semibold">AI Generated JD appears here.</p>
                <p className="text-sm">Upload a file to start.</p>
              </div>
            )}
            {!isLoading && parsedData && (
              <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="space-y-4 text-sm">
                <div className="space-y-1">
                  <h3 className="font-semibold text-primary">Company Name</h3>
                  <p>{parsedData.companyName}</p>
                </div>
                <Separator />
                 <div className="space-y-1">
                  <h3 className="font-semibold text-primary">About the Company</h3>
                  <p>{parsedData.aboutCompany}</p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <h3 className="font-semibold text-primary">Job Title</h3>
                  <p>{parsedData.jobTitle}</p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <h3 className="font-semibold text-primary">Required Experience</h3>
                  <p>{parsedData.requiredExperience}</p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <h3 className="font-semibold text-primary">Required Skills</h3>
                  <ul className="space-y-1">{parsedData.requiredSkills.map(renderListItem)}</ul>
                </div>
                <Separator />
                <div className="space-y-1">
                  <h3 className="font-semibold text-primary">Roles and Responsibilities</h3>
                   <ul className="space-y-1">{parsedData.rolesAndResponsibilities.map(renderListItem)}</ul>
                </div>
                <Separator />
                <div className="space-y-1">
                  <h3 className="font-semibold text-primary">Salary / Package Offered</h3>
                  <p>{parsedData.salaryPackage}</p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <h3 className="font-semibold text-primary">Location</h3>
                  <p>{parsedData.location}</p>
                </div>
                {parsedData.otherInfo && (
                <>
                    <Separator />
                    <div className="space-y-1">
                        <h3 className="font-semibold text-primary">Other Information</h3>
                        <p>{parsedData.otherInfo}</p>
                    </div>
                </>
                )}
              </motion.div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
}
