'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});


export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const { login, signup, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/profile');
    }
  }, [user, router]);

  const formSchema = useMemo(() => isLoginView ? loginSchema : signupSchema, [isLoginView]);
  
  const defaultValues = useMemo(() => {
    return isLoginView 
      ? { email: '', password: '' }
      : { name: '', email: '', password: '', confirmPassword: '' };
  }, [isLoginView]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [isLoginView, form, defaultValues]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (isLoginView) {
      const loginData = data as z.infer<typeof loginSchema>;
      login(loginData.email);
    } else {
      const signupData = data as z.infer<typeof signupSchema>;
      signup(signupData.email, signupData.name);
    }
  };

  const toggleView = () => setIsLoginView(!isLoginView);

  const formVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col items-center justify-center bg-primary/10 p-8 text-center relative overflow-hidden">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Image
            src="https://placehold.co/600x400.png"
            alt="AI HR Assistant Illustration"
            width={500}
            height={400}
            className="rounded-lg shadow-2xl"
            data-ai-hint="AI assistant robot"
          />
        </motion.div>
         <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-6 font-headline text-3xl font-bold text-primary"
        >
          AI HR Assistant
        </motion.h2>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-2 text-lg text-primary/80"
        >
          Your Virtual HR Partner, powered by AI.
        </motion.p>
        <div className="absolute top-0 -left-1/4 w-full h-full bg-primary/5 rounded-full-blob-1 filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 -right-1/4 w-full h-full bg-accent/5 rounded-full-blob-2 filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12">
        <Card className="mx-auto max-w-sm w-full bg-card/60 border-primary/20 shadow-xl backdrop-blur-lg">
           <AnimatePresence mode="wait">
              <motion.div
                key={isLoginView ? 'login' : 'signup'}
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="w-full"
              >
              {isLoginView ? (
                <>
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl text-primary">Login</CardTitle>
                    <CardDescription>Access your AI HR Assistant account.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="you@company.com" {...field} suppressHydrationWarning />
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
                                <Input type="password" placeholder="********" {...field} suppressHydrationWarning />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" suppressHydrationWarning>
                            Sign In
                          </Button>
                        </motion.div>
                         <p className="text-center text-sm text-muted-foreground">
                          Don&apos;t have an account?{' '}
                          <Button variant="link" type="button" onClick={toggleView} className="p-0 h-auto text-primary" suppressHydrationWarning>
                            Sign up
                          </Button>
                        </p>
                      </form>
                    </Form>
                  </CardContent>
                </>
              ) : (
                <>
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl text-primary">Sign Up</CardTitle>
                    <CardDescription>Create a new AI HR Assistant account.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                <Input placeholder="you@company.com" {...field} suppressHydrationWarning />
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
                                <Input type="password" placeholder="********" {...field} suppressHydrationWarning />
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
                                <Input type="password" placeholder="********" {...field} suppressHydrationWarning />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" suppressHydrationWarning>
                            Sign Up
                          </Button>
                        </motion.div>
                        <p className="text-center text-sm text-muted-foreground">
                          Already have an account?{' '}
                          <Button variant="link" type="button" onClick={toggleView} className="p-0 h-auto text-primary" suppressHydrationWarning>
                            Login
                          </Button>
                        </p>
                      </form>
                    </Form>
                  </CardContent>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}
