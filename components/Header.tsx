
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap } from "lucide-react";
import { PricingTable, Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { PricingModal } from "./PricingModal";
import { checkUser } from "@/lib/checkUser";
import { Plan, PLANS } from "@/lib/constants";

const Header = async() => {
  const user = await checkUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/6 bg-white/7 backdrop-blur-md">
      <nav className="flex h-full w-full items-center justify-between px-2 sm:px-4">
        <Link href="/" className="flex items-center gap-2 select-none">
          <Image
            src="/logoo.png"
            alt="Aurask"
            width={100}
            height={100}
            className="h-15 w-auto rounded-md"
          />
        </Link>
        <div className="flex items-center gap-5">
            <Show when="signed-in">
              <Link  href="/projects"
              className="text-[13px] font-medium text-white/40 transition-colors hover:text-white/80"> 
              Projects
              </Link>

               {user && (
               <PricingModal> 
              <span className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 text-xs text-white/70">
                  <Zap className="h-3 w-3 fill-white/70" />
                  {user.credits}/{PLANS[user?.plan as Plan].credits}credits
                </span>
                </PricingModal>
                )}

              <UserButton />
            </Show>
          

                 <Show when="signed-out">
              <SignInButton mode="modal">
                <Button variant='ghost'
                 size="sm"
                className="group flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white/70 transition-all
                 duration-300 ease-out hover:bg-white/10 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95">
                  sign in
                </Button>
              </SignInButton>

              <SignUpButton mode="modal">
                <Button variant='ghost'
                 size="sm"
                className= "group flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white/70 transition-all duration-300 ease-out hover:bg-white/10 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95"
              > 
                  Get Started
                  <ArrowRight className="transition-transform duration-300 ease-out group-hover:translate-x-1.5"/>
                </Button>
              </SignUpButton>
            </Show>
          

        </div>
      </nav>
    </header>
  )
}

export default Header
