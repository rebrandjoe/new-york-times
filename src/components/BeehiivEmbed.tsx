"use client";

import Script from "next/script";

export function BeehiivEmbed() {
  return (
    <div className="my-8 overflow-hidden rounded-xl border border-charcoal bg-[#0F0F0F] p-6 text-center sm:p-8">
      <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-charcoal bg-black/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        NEWSLETTER
      </div>
      
      <h4 className="mb-2 font-serif text-lg font-bold text-white sm:text-xl">
        Get Health News in Your Inbox
      </h4>
      <p className="mb-4 text-xs text-gray-muted leading-relaxed">
        The world&apos;s biggest medical and health stories explained. No spam, unsubscribe anytime.
      </p>

      {/* Beehiiv Form Container & Script */}
      <div className="flex justify-center">
        <div data-beehiiv-form="7a54a393-7da0-4b47-a497-3c6243013f21" className="w-full max-w-sm">
          <Script
            async
            src="https://subscribe-forms.beehiiv.com/v3/loader.js"
            strategy="afterInteractive"
          />
        </div>
      </div>
    </div>
  );
}
