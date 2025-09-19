'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Info } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';

const teamMembers = [
  { name: 'Bakhtiyar', role: 'Software Engineer', initials: 'B' },
  { name: 'Miras', role: 'Data Engineer', initials: 'M' },
  { name: 'Arlan', role: 'AI Engineer', initials: 'A' },
  { name: 'Bekzat', role: 'AI Engineer', initials: 'B' },
];

export function AboutModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-secondary w-full text-left">
          <Info className="h-4 w-4" />
          About
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>About Zhurek App</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            This application is brought to you by a dedicated team of engineers.
          </p>
          <Separator />
          <ul className="space-y-4">
            {teamMembers.map((member) => (
              <li key={member.name} className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
