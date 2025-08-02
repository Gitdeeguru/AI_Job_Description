'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/auth-context';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Camera } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout, loading, updateUser } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateUser({ avatarUrl: base64String });
      };
      reader.readAsDataURL(file);
    }
  };


  if (loading || !user) {
    return (
       <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto p-4 md:p-8 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-10 w-24 mt-4" />
            </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <Card className="bg-card/50 border-primary/20 shadow-lg backdrop-blur-md">
            <CardHeader className="items-center text-center">
               <div className="relative group">
                <Avatar className="w-24 h-24 mb-4 border-4 border-primary">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback className="text-4xl bg-accent text-accent-foreground">{user.initials}</AvatarFallback>
                </Avatar>
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer mb-4"
                  onClick={handleAvatarClick}
                >
                  <Camera className="h-8 w-8 text-white" />
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    className="hidden" 
                    accept="image/*"
                  />
                </div>
              </div>
              <CardTitle className="font-headline text-3xl text-primary">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
               <p className="text-muted-foreground text-center">
                Welcome to your AI HR Assistant profile. Here you can manage your account settings and view your activity.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={logout} variant="destructive">
                  Log Out
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
