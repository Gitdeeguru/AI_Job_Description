'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LoginForm, LoginFormData } from '@/components/login-form';
import { SignupForm, SignupFormData } from '@/components/signup-form';
import { OtpForm, OtpFormData } from '@/components/otp-form';
import { useToast } from '@/hooks/use-toast';

export default function AuthPage() {
  const [view, setView] = useState<'login' | 'signup' | 'otp'>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupData, setSignupData] = useState<SignupFormData | null>(null);
  const [otp, setOtp] = useState<string | null>(null);
  
  const { login, signup, user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  if (user) {
    router.push('/profile');
    return null;
  }

  const handleLoginSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    await login(data.email, data.password);
    setIsSubmitting(false);
  };
  
  const handleSignupSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(generatedOtp);
    setSignupData(data);
    
    // Simulate sending OTP
    toast({
      title: 'Verification Code',
      description: `Your OTP is: ${generatedOtp}`,
    });

    setView('otp');
    setIsSubmitting(false);
  };

  const handleOtpSubmit = async (data: OtpFormData) => {
    setIsSubmitting(true);
    if (data.otp === otp && signupData) {
      const success = await signup(signupData.email, signupData.name, signupData.password);
      if (success) {
        toast({
            title: "Success!",
            description: "Your account has been created and verified.",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "The OTP you entered is incorrect. Please try again.",
      });
    }
    setIsSubmitting(false);
  };

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
                key={view}
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="w-full"
              >
              {view === 'login' && (
                <LoginForm 
                  isSubmitting={isSubmitting} 
                  onSubmit={handleLoginSubmit} 
                  onSwitchToSignup={() => setView('signup')}
                />
              )}
               {view === 'signup' && (
                 <SignupForm 
                  isSubmitting={isSubmitting} 
                  onSubmit={handleSignupSubmit}
                  onSwitchToLogin={() => setView('login')}
                 />
              )}
              {view === 'otp' && signupData && (
                <OtpForm
                  email={signupData.email}
                  isSubmitting={isSubmitting}
                  onSubmit={handleOtpSubmit}
                  onBack={() => setView('signup')}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}
