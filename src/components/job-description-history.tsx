'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { JobDescriptionViewDialog } from './job-description-view-dialog';

export interface JobHistoryItem {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

interface JobDescriptionHistoryProps {
  history: JobHistoryItem[];
}

export function JobDescriptionHistory({ history }: JobDescriptionHistoryProps) {
  const [selectedDescription, setSelectedDescription] = useState<string | null>(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-4"
      >
        <Card className="bg-card/50 border-primary/20 shadow-lg backdrop-blur-md">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">Generation History</CardTitle>
            <CardDescription>Review your previously generated job descriptions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Job Title</TableHead>
                  <TableHead>Generated Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">
                      No history found. Generate a job description to see it here.
                    </TableCell>
                  </TableRow>
                ) : (
                  history.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>{format(new Date(item.createdAt), 'PPP p')}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedDescription(item.description)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
      <JobDescriptionViewDialog
        jobDescription={selectedDescription}
        onOpenChange={(isOpen) => !isOpen && setSelectedDescription(null)}
      />
    </>
  );
}
