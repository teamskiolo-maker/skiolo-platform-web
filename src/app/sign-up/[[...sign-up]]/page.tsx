"use client";

import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignUpForm() {
  const params = useSearchParams();
  const redirectUrl = params.get("redirect_url") || "/";
  return <SignUp forceRedirectUrl={redirectUrl} signInForceRedirectUrl={redirectUrl} />;
}

export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <SignUpForm />
      </Suspense>
    </div>
  );
}
