import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { ProfileMenu } from './profile-menu';

export function Header() {
  return (
    <header className="bg-primary/10 p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4">
          <Briefcase className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-headline font-bold text-primary">
            AI HR Assistant
          </h1>
        </Link>
        <ProfileMenu />
      </div>
    </header>
  );
}
