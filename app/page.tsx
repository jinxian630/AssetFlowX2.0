"use client";

import { useWallet } from "@/lib/useWallet";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Hero from "@/components/hero";

export default function Home() {
  const { isConnected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      // Delay redirect to allow animation to complete (3 seconds)
      const redirectTimer = setTimeout(() => {
        router.push("/dashboard");
      }, 3000);

      return () => clearTimeout(redirectTimer);
    }
  }, [isConnected, router]);

  return <Hero />;
}
