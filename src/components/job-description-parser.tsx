'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, UploadCloud, FileText } from 'lucide-react';
import { parseJobDescriptionFile } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import type { ParseJobDescriptionFileOutput } from '@/ai/flows/parse-job-description-file';

// Mock data to simulate file content
const mockFileContent = `
Company: InnovateTech Solutions
About: We are a leading provider of cutting-edge technology solutions, specializing in AI and machine learning. Our mission is to empower businesses with innovative tools to drive growth and efficiency.

Role: Senior Frontend Engineer
We are seeking a talented Senior Frontend Engineer to join our dynamic team. The ideal candidate will have a passion for creating beautiful and performant user interfaces.

Experience: 5+ years of professional frontend development experience.
Skills: React, TypeScript, GraphQL, Next.js, Webpack.
Package: $120,000 - $150,000 per year
Location: San Francisco, CA (Hybrid)
Responsibilities:
- Develop and maintain user-facing features.
- Build reusable code and libraries for future use.
- Ensure the technical feasibility of UI/UX designs.
- Optimize applications for maximum speed and scalability.
- Collaborate with other team members and stakeholders.
`;

export function JobDescriptionParser() {
  const [parsedData, setParsedData] = useState<ParseJobDescriptionFileOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleParse = async () => {
    setIsLoading(true);
    setParsedData(null);
    try {
      // In a real app, you would get file content from an upload.
      // Here, we use mock data.
      const result = await parseJobDescriptionFile({ fileContent: mockFileContent });
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
          <CardTitle className="font-headline text-2xl text-primary">Parse Job Description</CardTitle>
          <CardDescription>Upload a job description file (PDF, DOCX) to automatically parse and structure its content.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-primary/30 rounded-lg bg-background/50">
                <UploadCloud className="h-12 w-12 text-primary/50 mb-2" />
                <p className="text-muted-foreground mb-4">Click the button to process a sample document.</p>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button onClick={handleParse} disabled={isLoading}>
                    {isLoading ? (
                        <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Parsing...
                        </>
                    ) : (
                        'Parse Sample File'
                    )}
                    </Button>
                </motion.div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">File upload is simulated for demonstration purposes.</p>
        </CardContent>
      </Card>
      
      <Card className="bg-card/50 border-primary/20 shadow-lg h-full backdrop-blur-md">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">Parsed Content</CardTitle>
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
                <p className="font-semibold">Your parsed content will appear here.</p>
                <p className="text-sm">"Upload" a file to start.</p>
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
