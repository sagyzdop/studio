"use client";

import { useAuth } from "../../../hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
    // ... existing code ...
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background/80 px-6 backdrop-blur-sm">
        <h1 className="text-2xl font-semibold font-headline">Knowledge Base</h1>
      </header>
      <div className="flex-1 grid md:grid-cols-2 gap-6 p-6 overflow-hidden">
        <div className="flex flex-col gap-4 overflow-hidden">
          <h2 className="text-lg font-semibold">Instructions</h2>{" "}
          {/* Added heading */}
          <p className="text-muted-foreground">
            Use the chatbot on the right to generate metadata for the knowledge
            base.
          </p>
          <p className="mt-2 text-muted-foreground">
            <strong>1. Choose Structure</strong> – before uploading, select either:<br />
            <em>General</em> → lightweight overview of database objects.<br />
            <em>Extended</em> → detailed schema with relationships, constraints, and attributes.<br /><br />
            <strong>2. Send Input</strong> – User provides text descriptions and/or images (tables, ERDs, schemas, etc.).<br /><br />
            <strong>3. Analyze Content</strong> – The system detects entities, attributes, keys, and relationships from the input, handling both textual and visual data.<br /><br />
            <strong>4. Generate Metadata</strong> – Produces a metadata.txt file containing structured information about tables, columns, relationships, and database rules.<br /><br />
            <strong>5. Provide Commentary</strong> – Adds a human-readable explanation describing what was extracted, what’s shown in the image, and any assumptions made during generation.<br /><br />
          </p>
        </div>
        <div className="flex flex-col gap-4 overflow-hidden">
          <h2 className="text-lg font-semibold">Metadata Generator</h2>{" "}
          {/* Added heading */}
          <div className="flex-1 rounded-lg border overflow-hidden">
            <iframe
              src="http://hackathon.shai.pro/chatbot/WUDPquW9ptNLmZmx"
              className="w-full h-full border-0 min-h-[700px]" // Updated className for consistency
              title="File handler" 
              allow="microphone"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
