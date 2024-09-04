import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
    return (
        <section className="flex items-center justify-center hero">
            <div className="hero-content">
            
            <h1 className="font-bold text-xl text-center">
            TeenFin
           </h1>
           <p className="text-lg">
            Your learning platform for financial skills
           </p>
            </div>
           
        </section>
    );
}