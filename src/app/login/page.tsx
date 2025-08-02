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
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const captchaSchema = z.object({
  captcha: z.string().min(1, { message: 'Please solve the CAPTCHA.' }),
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
}).merge(captchaSchema);

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
}).merge(captchaSchema);


export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: 0 });
  const { login, signup, user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      router.push('/profile');
    }
  }, [user, router]);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ num1, num2, answer: num1 + num2 });
  };
  
  useEffect(() => {
    generateCaptcha();
  }, [isLoginView]);

  const formSchema = useMemo(() => isLoginView ? loginSchema : signupSchema, [isLoginView]);
  
  const defaultValues = useMemo(() => {
    return isLoginView 
      ? { email: '', password: '', captcha: '' }
      : { name: '', email: '', password: '', confirmPassword: '', captcha: '' };
  }, [isLoginView]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
    generateCaptcha();
  }, [isLoginView, form, defaultValues]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (parseInt(data.captcha, 10) !== captcha.answer) {
      toast({
        variant: "destructive",
        title: "CAPTCHA Failed",
        description: "Please solve the math problem correctly.",
      });
      form.setValue('captcha', '');
      generateCaptcha();
      return;
    }

    setIsSubmitting(true);
    if (isLoginView) {
      const loginData = data as z.infer<typeof loginSchema>;
      await login(loginData.email, loginData.password);
    } else {
      const signupData = data as z.infer<typeof signupSchema>;
      await signup(signupData.email, signupData.name, signupData.password);
    }
    setIsSubmitting(false);
    generateCaptcha();
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setShowPassword(false);
  };
  
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const formVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex relative">
        <Image
          src="https://placehold.co/1000x1000.png"
          alt="Abstract background"
          layout="fill"
          objectFit="cover"
          className="z-0"
          data-ai-hint="blue network"
        />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full bg-black/50 p-8 text-center">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-6 font-headline text-4xl font-bold text-white"
          >
            AI HR Assistant
          </motion.h2>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-2 text-xl text-white/80"
          >
            Your Virtual HR Partner, powered by AI.
          </motion.p>
        </div>
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
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                <div className="relative">
                                  <Input type={showPassword ? "text" : "password"} placeholder="********" {...field} suppressHydrationWarning />
                                  <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={togglePasswordVisibility}>
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
                          name="captcha"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Verify you are human: {`${captcha.num1} + ${captcha.num2} = ?`}</FormLabel>
                              <FormControl>
                                <Input placeholder="Your answer" {...field} suppressHydrationWarning type="number" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" suppressHydrationWarning disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Sign In'}
                          </Button>
                        </motion.div>
                         <p className="text-center text-sm text-muted-foreground pt-2">
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
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                <div className="relative">
                                  <Input type={showPassword ? "text" : "password"} placeholder="********" {...field} suppressHydrationWarning />
                                  <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={togglePasswordVisibility}>
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
                                  <Input type={showPassword ? "text" : "password"} placeholder="********" {...field} suppressHydrationWarning />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="captcha"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Verify you are human: {`${captcha.num1} + ${captcha.num2} = ?`}</FormLabel>
                              <FormControl>
                                <Input placeholder="Your answer" {...field} suppressHydrationWarning type="number" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" suppressHydrationWarning disabled={isSubmitting}>
                           {isSubmitting ? <Loader2 className="animate-spin" /> : 'Sign Up'}
                          </Button>
                        </motion.div>
                        <p className="text-center text-sm text-muted-foreground pt-2">
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

    