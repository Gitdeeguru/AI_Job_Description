'use client';

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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import type { GenerateJobDescriptionInput } from '@/ai/flows/generate-job-description';

const formSchema = z.object({
  roleTitle: z.string().min(2, { message: 'Role title must be at least 2 characters.' }),
  experience: z.string().min(1, { message: 'Experience is required.' }),
  location: z.string().min(2, { message: 'Location is required.' }),
  keySkills: z.string().min(2, { message: 'At least one skill is required.' }),
});

interface JobDescriptionFormProps {
  onSubmit: (data: GenerateJobDescriptionInput) => void;
  isLoading: boolean;
}

export function JobDescriptionForm({ onSubmit, isLoading }: JobDescriptionFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roleTitle: '',
      experience: '',
      location: '',
      keySkills: '',
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-card/50 border-primary/20 shadow-lg backdrop-blur-md">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">Create a Job Description</CardTitle>
          <CardDescription>Fill in the details below and let our AI do the magic!</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="roleTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Senior Software Engineer" {...field} suppressHydrationWarning />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience Level</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 5-7 years" {...field} suppressHydrationWarning />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., San Francisco, CA or Remote" {...field} suppressHydrationWarning />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="keySkills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Skills</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., React, TypeScript, Node.js, GraphQL, ..."
                        className="resize-none"
                        {...field}
                        suppressHydrationWarning
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
                      Generating...
                    </>
                  ) : (
                    'Generate Description'
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
