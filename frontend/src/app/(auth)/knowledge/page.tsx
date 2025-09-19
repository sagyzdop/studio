"use client";

import { useAuth } from "../../../hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

export default function KnowledgePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading || user?.role !== "admin") {
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
                Use the chatbot on the right to generate metadata for the
                knowledge base.
              </p>
              <p className="mt-4 text-muted-foreground"></p>
              <ol className="mt-2 list-disc list-inside text-muted-foreground space-y-1 text-sm">
                <li>1. Choose Structure - before uploading, selects either</li>
                <li>General → lightweight overview of database objects.</li>
                <li>
                  Extended → detailed schema with relationships, constraints,
                  and attributes.
                </li>
                <li>
                  2. Send Input – User provides text descriptions and/or images
                  (tables, ERDs, schemas, etc.).
                </li>
                <li>
                  3. Analyze Content – The system detects entities, attributes,
                  keys, and relationships from the input, handling both textual
                  and visual data.
                </li>
                <li>
                  4. Generate Metadata – Produces a metadata.txt file containing
                  structured information about tables, columns, relationships,
                  and database rules.
                </li>
                <li>
                  5. Provide Commentary – Adds a human-readable explanation
                  describing what was extracted, what’s shown in the image, and
                  any assumptions made during generation.
                </li>
                <li>"What is the process for expense reimbursement?"</li>
                <li>"Update the contact person for IT support."</li>
              </ol>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 rounded-lg border overflow-hidden">
            <iframe
              src="http://hackathon.shai.pro/chatbot/WUDPquW9ptNLmZmx"
              className="w-full; h-full; max-h-[700px]"
              allow="microphone"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
