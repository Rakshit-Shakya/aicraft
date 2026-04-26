"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  useUser,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export const Navbar = () => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <nav
      className="p-4 bg-transparent fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-transparent"
    >
      <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
        
        {/* LEFT SIDE (UNCHANGED) */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="AICraft Logo"
            width={30}
            height={30}
            >                
        </Image>
          <span className="font-semibold text-lg">AiCraft</span>
        </Link>

        {/* RIGHT SIDE (NEW) */}
        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <UserButton />
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost">Sign In</Button>
              </SignInButton>

              <SignUpButton mode="modal">
                <Button>Get Started</Button>
              </SignUpButton>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

