"use client";

import { Button } from "@/components/ui/button";
import { Instagram, ArrowRight } from "lucide-react";

export default function ComingSoonPage() {
  const handleInstagramClick = () => {
    window.open("https://www.instagram.com/finasaan", "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Main heading */}
        <div className="mb-8 animate-fade-in-up animation-delay-200">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
            <span className="text-white">Fin</span>
            <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              asaan
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-400 mx-auto rounded-full"></div>
        </div>

        {/* Subtitle */}
        <div className="mb-12 animate-fade-in-up animation-delay-400">
          <p className="text-xl md:text-2xl text-gray-300 mb-4 font-light">
            Asaan Finance, for everyone.
          </p>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            We're crafting something extraordinary to revolutionize your
            financial journey. Get ready for an experience that puts you in
            control of your finance like never before.
          </p>
        </div>

        {/* Instagram follow */}
        <div className="mb-12 animate-fade-in-up animation-delay-600">
          <div className="max-w-md mx-auto">
            <p className="text-gray-300 mb-6 text-lg">
              Follow our journey on Instagram
            </p>

            <Button
              onClick={handleInstagramClick}
              className="h-12 px-8 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group"
            >
              <Instagram className="mr-3 w-5 h-5" />
              @finasaan
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Coming soon badge */}
        <div className="animate-fade-in-up animation-delay-800">
          <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse"></div>
            <span className="text-gray-300 font-medium">
              Coming Soon • 2025
            </span>
          </div>
        </div>

        {/* Social proof or additional info */}
        <div className="mt-16 animate-fade-in-up animation-delay-1000">
          <p className="text-gray-500 text-sm">
            Join us on this journey to make finance accessible to every
            Pakistani.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
