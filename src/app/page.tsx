'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/header';
import { JobDescriptionForm } from '@/components/job-description-form';
import { JobDescriptionDisplay } from '@/components/job-description-display';
import { JobDescriptionAnalyzer } from '@/components/job-description-analyzer';
import { JobDescriptionHistory, type JobHistoryItem } from '@/components/job-description-history';
import { Chatbot } from '@/components/chatbot';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { GenerateJobDescriptionInput } from '@/ai/flows/generate-job-description';
import { generateJobDescription, regenerateJobDescription } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [jobDescription, setJobDescription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formInput, setFormInput] = useState<GenerateJobDescriptionInput | null>(null);
  const [history, setHistory] = useState<JobHistoryItem[]>([]);
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    if (user) {
      try {
        const storedHistory = localStorage.getItem('jobDescriptionHistory');
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }
      } catch (error) {
        console.error('Failed to parse history from localStorage', error);
        localStorage.removeItem('jobDescriptionHistory');
      }
    }
  }, [user]);

  const addToHistory = (newItem: JobHistoryItem) => {
    const updatedHistory = [newItem, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('jobDescriptionHistory', JSON.stringify(updatedHistory));
  };


  const handleGenerate = async (data: GenerateJobDescriptionInput) => {
    setIsLoading(true);
    setJobDescription(null);
    setFormInput(data);
    try {
      const result = await generateJobDescription(data);
      setJobDescription(result.jobDescription);
       addToHistory({
        id: new Date().toISOString(),
        title: data.roleTitle,
        description: result.jobDescription,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error generating job description:', error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with generating the job description.",
      })
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!formInput || !jobDescription) return;
    setIsLoading(true);
    setJobDescription(null);
    try {
      const result = await regenerateJobDescription({
        ...formInput,
        originalDescription: jobDescription,
      });
      setJobDescription(result.jobDescription);
       addToHistory({
        id: new Date().toISOString(),
        title: formInput.roleTitle,
        description: result.jobDescription,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error regenerating job description:', error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with regenerating the job description.",
      })
    } finally {
      setIsLoading(false);
    }
  };
  
  if (loading || !user) {
    return (
       <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto p-4 md:p-8 flex items-center justify-center">
            <div className="w-full space-y-4">
                <Skeleton className="h-10 w-1/3 mx-auto" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                  <Skeleton className="h-[500px] w-full" />
                  <Skeleton className="h-[500px] w-full" />
                </div>
            </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <Tabs defaultValue="generate">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate">Generate JD</TabsTrigger>
            <TabsTrigger value="analyze">Analyze JD</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="generate">
             <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-4"
            >
              <JobDescriptionForm onSubmit={handleGenerate} isLoading={isLoading} />
              <div className="h-full">
                <JobDescriptionDisplay
                  jobDescription={jobDescription}
                  isLoading={isLoading}
                  onRegenerate={handleRegenerate}
                />
              </div>
            </motion.div>
          </TabsContent>
          <TabsContent value="analyze">
            <JobDescriptionAnalyzer />
          </TabsContent>
          <TabsContent value="history">
            <JobDescriptionHistory history={history} />
          </TabsContent>
        </Tabs>
      </main>
      <Chatbot />
    </div>
  );
}
