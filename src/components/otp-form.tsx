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
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const otpSchema = z.object({
  otp: z.string().min(6, { message: 'OTP must be 6 digits.' }).max(6, { message: 'OTP must be 6 digits.' }),
});

export type OtpFormData = z.infer<typeof otpSchema>;

interface OtpFormProps {
    email: string;
    onSubmit: (data: OtpFormData) => void;
    isSubmitting: boolean;
    onBack: () => void;
}

export function OtpForm({ email, onSubmit, isSubmitting, onBack }: OtpFormProps) {
  const form = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  return (
    <>
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Verify Your Email</CardTitle>
        <CardDescription>
          We've sent a 6-digit code to <strong>{email}</strong>. Please enter it below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input 
                        placeholder="_ _ _ _ _ _" 
                        {...field} 
                        suppressHydrationWarning 
                        maxLength={6}
                        />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" suppressHydrationWarning disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Verify Account'}
              </Button>
            </motion.div>
            <p className="text-center text-sm text-muted-foreground pt-2">
                Entered the wrong details?{' '}
                <Button variant="link" type="button" onClick={onBack} className="p-0 h-auto text-primary" suppressHydrationWarning>
                    Go Back
                </Button>
            </p>
          </form>
        </Form>
      </CardContent>
    </>
  );
}
