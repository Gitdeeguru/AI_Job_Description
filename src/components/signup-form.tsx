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
import { Input } from '@/components/ui/input';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Loader2, Eye, EyeOff } from 'lucide-react';

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
    onSubmit: (data: SignupFormData) => void;
    isSubmitting: boolean;
    onSwitchToLogin: () => void;
}

export function SignupForm({ onSubmit, isSubmitting, onSwitchToLogin }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const handleFormSubmit = async (data: SignupFormData) => {
    onSubmit(data);
  };
  
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <>
        <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">Sign Up</CardTitle>
            <CardDescription>Create a new AI HR Assistant account.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Your Name" {...field} suppressHydrationWarning />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input 
                                type="email" 
                                placeholder="you@company.com" 
                                {...field} 
                                suppressHydrationWarning
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <div className="relative">
                        <Input type={showPassword ? "text" : "password"} placeholder="********" {...field} suppressHydrationWarning />
                        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={togglePasswordVisibility} suppressHydrationWarning>
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                        <div className="relative">
                        <Input type={showConfirmPassword ? "text" : "password"} placeholder="********" {...field} suppressHydrationWarning />
                        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={toggleConfirmPasswordVisibility} suppressHydrationWarning>
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
               
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" suppressHydrationWarning disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Create Account'}
                </Button>
                </motion.div>
                <p className="text-center text-sm text-muted-foreground pt-2">
                Already have an account?{' '}
                <Button variant="link" type="button" onClick={onSwitchToLogin} className="p-0 h-auto text-primary" suppressHydrationWarning>
                    Login
                </Button>
                </p>
            </form>
            </Form>
        </CardContent>
    </>
  );
}
