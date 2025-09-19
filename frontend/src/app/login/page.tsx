"use client";

import { LoginForm } from "../../components/auth/login-form";
import { RegisterForm } from "../../components/auth/register-form";
import { Logo } from "../../components/layout/logo";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-4xl font-bold text-foreground font-headline">
          Zhurek App
        </h1>
        <p className="mt-2 text-muted-foreground">
          Unlock insights from your corporate data with natural language.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <LoginForm>
            <Button size="lg" className="w-full sm:w-auto">
              Login
            </Button>
          </LoginForm>
          <RegisterForm>
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              Register
            </Button>
          </RegisterForm>
        </div>
        <p className="mt-8 text-xs text-muted-foreground">
          For demo purposes, use any email. Use an email containing 'admin' for
          admin role.
        </p>
      </div>
    </div>
  );
}
