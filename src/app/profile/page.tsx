'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/auth-context';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

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
              <Avatar className="w-24 h-24 mb-4 border-4 border-primary">
                <AvatarImage src={`https://i.pravatar.cc/150?u=${user.email}`} alt={user.name} />
                <AvatarFallback className="text-4xl bg-accent text-accent-foreground">{user.initials}</AvatarFallback>
              </Avatar>
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
