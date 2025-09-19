'use client';

import { useAuth } from '../../../hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

export default function KnowledgePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || user?.role !== 'admin') {
    return null; // or a loading/unauthorized component
  }
  
  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background/80 px-6 backdrop-blur-sm">
        <h1 className="text-2xl font-semibold font-headline">Knowledge Base</h1>
      </header>
      <div className="flex-1 grid md:grid-cols-2 gap-6 p-6 overflow-hidden">
        <div className="flex flex-col gap-4 overflow-hidden">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Use the chatbot on the right to manage and query the knowledge base. You can ask it to add, update, or retrieve information about company policies, procedures, and other internal documentation.
              </p>
              <p className="mt-4 text-muted-foreground">
                Example prompts:
              </p>
              <ul className="mt-2 list-disc list-inside text-muted-foreground space-y-1 text-sm">
                <li>"Add a new policy for remote work."</li>
                <li>"What is the process for expense reimbursement?"</li>
                <li>"Update the contact person for IT support."</li>
              </ul>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 rounded-lg border overflow-hidden">
            <iframe
              src="https://hackathon.shai.pro/chatbot/YOUR_KNOWLEDGE_CHATBOT_ID"
              className="w-full h-full border-0"
              title="Knowledge Chatbot"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
