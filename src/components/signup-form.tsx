'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
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
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Loader2, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const signupFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  otp: z.string().optional(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  confirmPassword: z.string(),
});

const signupSchema = signupFormSchema.refine(data => data.password === data.confirmPassword, {
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
  const { toast } = useToast();

  const [otp, setOtp] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [timer, setTimer] = useState(60);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', otp: '' },
  });

  const emailValue = form.watch('email');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0 && otpSent) {
      setOtpSent(false);
      setOtp(null);
      toast({
        variant: 'destructive',
        title: 'OTP Expired',
        description: 'Please request a new OTP.',
      });
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpSent, timer, toast]);


  const handleSendOtp = async () => {
    setIsSendingOtp(true);
    await form.trigger('email');
    if (form.getValues('email') && !form.getFieldState('email').error) {
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setOtp(generatedOtp);
        setOtpSent(true);
        setTimer(60);
        toast({
            title: 'OTP Sent!',
            description: `Your verification code is: ${generatedOtp}`,
        });
    }
    setIsSendingOtp(false);
  };

  const handleVerifyOtp = async () => {
    setIsVerifyingOtp(true);
    const enteredOtp = form.getValues('otp');
    if (enteredOtp && enteredOtp === otp) {
        setIsEmailVerified(true);
        setOtpSent(false);
        toast({
            title: 'Success!',
            description: 'Your email has been verified.',
        });
    } else {
        form.setError('otp', { type: 'manual', message: 'Invalid OTP. Please try again.' });
    }
    setIsVerifyingOtp(false);
  };

  const handleFormSubmit = async (data: SignupFormData) => {
    if (!isEmailVerified) {
        toast({
            variant: "destructive",
            title: "Email Not Verified",
            description: "Please verify your email before creating an account.",
        });
        return;
    }
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
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <div className="flex items-center gap-2">
                            <FormControl>
                                <Input 
                                    type="email" 
                                    placeholder="you@company.com" 
                                    {...field} 
                                    suppressHydrationWarning
                                    disabled={otpSent || isEmailVerified}
                                />
                            </FormControl>
                            {!isEmailVerified && (
                                <Button 
                                    type="button" 
                                    onClick={handleSendOtp}
                                    disabled={isSendingOtp || otpSent || !emailValue || !!form.getFieldState('email').error}
                                >
                                    {isSendingOtp ? <Loader2 className="animate-spin" /> : (otpSent ? `${timer}s` : 'Send OTP')}
                                </Button>
                            )}
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <AnimatePresence>
                {otpSent && !isEmailVerified && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Verification Code</FormLabel>
                                <div className="flex items-center gap-2">
                                <FormControl>
                                    <Input placeholder="6-digit code" {...field} suppressHydrationWarning />
                                </FormControl>
                                <Button type="button" onClick={handleVerifyOtp} disabled={isVerifyingOtp}>
                                    {isVerifyingOtp ? <Loader2 className="animate-spin" /> : 'Verify OTP'}
                                </Button>
                                </div>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </motion.div>
                )}
                </AnimatePresence>


                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Your Name" {...field} suppressHydrationWarning disabled={!isEmailVerified} />
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
                        <Input type={showPassword ? "text" : "password"} placeholder="********" {...field} suppressHydrationWarning disabled={!isEmailVerified} />
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
                        <Input type={showConfirmPassword ? "text" : "password"} placeholder="********" {...field} suppressHydrationWarning disabled={!isEmailVerified}/>
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
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" suppressHydrationWarning disabled={isSubmitting || !isEmailVerified}>
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
