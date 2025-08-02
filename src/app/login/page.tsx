'use client';

import { useState, useMemo } from 'react';
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
import { Header } from '@/components/header';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: isLoginView 
      ? { email: '', password: '' }
      : { name: '', email: '', password: '' },
  });

  useEffect(() => {
    form.reset(isLoginView 
      ? { email: '', password: '' }
      : { name: '', email: '', password: '' });
  }, [isLoginView, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (isLoginView) {
      login(data.email);
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
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8 flex items-center justify-center">
        <Card className="bg-card/50 border-primary/20 shadow-lg backdrop-blur-md w-full max-w-md overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={isLoginView ? 'login' : 'signup'}
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
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
                          <Button variant="link" type="button" onClick={toggleView} className="p-0 h-auto" suppressHydrationWarning>
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
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" suppressHydrationWarning>
                            Sign Up
                          </Button>
                        </motion.div>
                        <p className="text-center text-sm text-muted-foreground">
                          Already have an account?{' '}
                          <Button variant="link" type="button" onClick={toggleView} className="p-0 h-auto" suppressHydrationWarning>
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
      </main>
    </div>
  );
}
