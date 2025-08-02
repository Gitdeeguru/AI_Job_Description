'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
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
import { Loader2, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const captchaSchema = z.object({
  captcha: z.string().min(1, { message: 'Please solve the CAPTCHA.' }),
});

const signupFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  confirmPassword: z.string(),
});

const signupSchema = signupFormSchema.merge(captchaSchema).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
    onSubmit: (data: SignupFormData) => void;
    isSubmitting: boolean;
    onSwitchToLogin: () => void;
}

const generateCaptchaCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captcha;
};

const CaptchaImage = ({ captchaCode }: { captchaCode: string }) => {
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    const getPath = () => {
      let path = `M10 25`;
      let currentX = 10;
      for (let i = 0; i < captchaCode.length; i++) {
        const y = 25 + (Math.random() - 0.5) * 10;
        const controlX1 = currentX + 10;
        const controlY1 = 25 + (Math.random() - 0.5) * 20;
        const controlX2 = currentX + 10;
        const controlY2 = 25 + (Math.random() - 0.5) * 20;
        const endX = currentX + 20;
        currentX = endX;
        path += ` C${controlX1},${controlY1} ${controlX2},${controlY2} ${endX},${y}`;
      }
      return path;
    };
    
    const lines = Array.from({ length: 5 }).map((_, i) => (
      `<line
        key=${i}
        x1=${Math.random() * 150}
        y1=${Math.random() * 50}
        x2=${Math.random() * 150}
        y2=${Math.random() * 50}
        stroke-width="1"
        stroke="#ccc"
      />`
    )).join('');

    const generatedSvg = `
      <svg width="150" height="50" class="bg-muted rounded-md border border-input">
        <path id="captchaPath" d="${getPath()}" stroke="none" fill="none" />
        <text fill="#333" font-size="24" font-weight="bold" letter-spacing="2">
          <textPath href="#captchaPath" startOffset="0%">${captchaCode}</textPath>
        </text>
        ${lines}
      </svg>
    `;
    setSvg(generatedSvg);
  }, [captchaCode]);

  if (!svg) {
    return <div className="h-[50px] w-[150px] bg-muted rounded-md border border-input" />;
  }

  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
};


export function SignupForm({ onSubmit, isSubmitting, onSwitchToLogin }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('');
  const { toast } = useToast();

  const generateNewCaptcha = useCallback(() => {
    setCaptchaCode(generateCaptchaCode());
  }, []);
  
  useEffect(() => {
    generateNewCaptcha();
  }, [generateNewCaptcha]);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', captcha: '' },
  });

  const handleFormSubmit = async (data: SignupFormData) => {
    if (data.captcha.toLowerCase() !== captchaCode.toLowerCase()) {
      toast({
        variant: "destructive",
        title: "CAPTCHA Failed",
        description: "The characters you entered do not match.",
      });
      form.setValue('captcha', '');
      generateNewCaptcha();
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
                        <Input type="email" placeholder="you@company.com" {...field} suppressHydrationWarning />
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
                <FormField
                control={form.control}
                name="captcha"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Verify you are human</FormLabel>
                    <div className="flex items-center gap-2">
                        <FormControl>
                        <Input placeholder="Enter CAPTCHA" {...field} suppressHydrationWarning />
                        </FormControl>
                        {captchaCode && <CaptchaImage captchaCode={captchaCode} />}
                        <Button type="button" variant="ghost" size="icon" onClick={generateNewCaptcha} suppressHydrationWarning>
                        <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>
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
