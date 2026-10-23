'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/sections/context/AuthContext';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/sections/Navbar';

interface HeroProps {
  onExplore: () => void;
}

// ---------------- লাইভ টাইপরাইটার অ্যানিমেশন কম্পোনেন্ট ----------------
function HeroTypewriterTagline() {
  const taglines = [
    'A COMMITMENT TO FRESHNESS',
    'A COMMITMENT TO TRANSPARENCY'
  ];
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = taglines[index];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayText.length < fullText.length) {
        // রিয়েল-টাইম লাইভ লেখার ফিল আনার জন্য র্যান্ডম স্পিড (৬০মিঃসেঃ থেকে ১২০মিঃসেঃ) ব্যবহার করা হয়েছে
        const randomSpeed = Math.random() * 60 + 60;
        timeout = setTimeout(() => {
          setDisplayText(fullText.substring(0, displayText.length + 1));
        }, randomSpeed);
      } else {
        // লেখা সম্পূর্ণ হওয়ার পর ২.৫ সেকেন্ড বিরতি দিয়ে আবার মোছা শুরু করবে
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2500);
      }
    } else {
      if (displayText.length > 0) {
        // দ্রুত মুছে যাওয়ার গতি
        timeout = setTimeout(() => {
          setDisplayText(fullText.substring(0, displayText.length - 1));
        }, 35);
      } else {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % taglines.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, index]);

  return (
    <div className="flex items-center justify-center">
      <p className="text-sm sm:text-lg md:text-2xl text-gray-200 italic font-light tracking-wide max-w-2xl mx-auto opacity-90 inline-flex items-center">
        &quot;{displayText}
        {/* একদম চিকন ও লেখার সমান হাইটযুক্ত সবুজ লাইভ কার্সার বার */}
        <span className="inline-block w-[2px] h-[1.1em] bg-green-500 ml-1.5 align-middle animate-pulse shadow-[0_0_10px_#22c55e]"></span>
        &quot;
      </p>
    </div>
  );
}
// ---------------------------------------------------------------------------------

const Hero = ({ onExplore }: HeroProps) => {
  const { user } = useAuth();
  const [isB2BPartner, setIsB2BPartner] = useState(false);

  useEffect(() => {
    async function checkUserProfile() {
      if (!user?.id) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_b2b')
        .eq('id', user.id)
        .single();

      if (profile) {
        if (profile.role === 'b2b' || profile.is_b2b === true) {
          setIsB2BPartner(true);
        }
      }
    }
    
    checkUserProfile();
  }, [user]);

  return (
    <section className="relative h-screen flex items-center justify-center bg-black overflow-hidden font-sans">
      
      {/* আলাদা করা Navbar কম্পোনেন্ট কল করা হলো */}
      <Navbar onExplore={onExplore} />

      {/* ব্যাকগ্রাউন্ড হিরো ইমেজ ও গ্রেডিয়েন্ট */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://plus.unsplash.com/premium_photo-1661376973064-48f778b0d8cd?q=80&w=1470&auto=format&fit=crop" 
          alt="Fresh Agro" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black" />
      </div>

      {/* হিরো কন্টেন্ট */}
      <div className="relative z-10 text-center px-4 max-w-4xl pt-10">
        <h1 className="text-4xl sm:text-6xl md:text-9xl font-black text-white mb-4 tracking-tighter">
          SEALAND <span className="text-green-500">AGRO</span>
        </h1>
        
        {/* এখানে লাইভ টাইপরাইটার ট্যাগলাইন কম্পোনেন্ট যুক্ত করা হলো */}
        <div className="mb-8 sm:mb-12">
          <HeroTypewriterTagline />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center w-full max-w-md sm:max-w-none mx-auto">
          <button 
            onClick={onExplore}
            className="px-8 sm:px-10 py-3.5 sm:py-4 bg-green-600 text-white rounded-full font-black text-sm sm:text-lg hover:bg-green-700 hover:scale-105 transition-all w-full sm:w-auto shadow-2xl shadow-green-600/30 uppercase tracking-widest"
          >
            Explore Catalog
          </button>

          {!isB2BPartner && (
            <Link href="/b2b" className="w-full sm:w-auto">
              <button className="px-8 sm:px-10 py-3.5 sm:py-4 border-2 border-white/30 bg-white/5 text-white rounded-full font-bold text-sm sm:text-lg hover:bg-white hover:text-black transition-all w-full sm:w-auto uppercase tracking-widest">
                B2B Partnership
              </button>
            </Link>
          )}
        </div>
      </div>

    </section>
  );
};

export default Hero;