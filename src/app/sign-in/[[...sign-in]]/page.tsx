"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignInForm() {
  const params = useSearchParams();
  const redirectUrl = params.get("redirect_url") || "/";
  return <SignIn forceRedirectUrl={redirectUrl} signUpForceRedirectUrl={redirectUrl} />;
}

export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
