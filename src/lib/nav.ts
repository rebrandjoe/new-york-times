export interface NavLink {
  label: string;
  href: string;
}

export const primaryNav: NavLink[] = [
  { label: "HOME", href: "/" },
  { label: "LATEST", href: "/latest" },
  { label: "AFRICA", href: "/africa" },
  { label: "KENYA", href: "/kenya" },
  { label: "GLOBAL", href: "/global" },
  { label: "TOPICS", href: "/topics" },
  { label: "ABOUT", href: "/about" },
];

export const footerNews: NavLink[] = [
  { label: "Latest", href: "/latest" },
  { label: "Africa", href: "/africa" },
  { label: "Kenya", href: "/kenya" },
  { label: "Global", href: "/global" },
];

export const footerInformation: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Advertise", href: "/advertise" },
];

export const footerTopics: NavLink[] = [
  { label: "HIV & AIDS", href: "/topics/hiv-aids" },
  { label: "Vaccines", href: "/topics/vaccines" },
  { label: "Research", href: "/topics/medical-research" },
  { label: "All topics", href: "/topics" },
];

export const footerEditorial: NavLink[] = [
  { label: "Editorial Standards", href: "/editorial-standards" },
  { label: "Corrections & Fact-Checking", href: "/corrections-and-fact-checking" },
  { label: "AI Policy", href: "/ai-policy" },
];

export const footerLegal: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
];

export interface SocialLink {
  label: string;
  href: string;
}

export const socialLinks: SocialLink[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/19UtYycjr7/",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/joseph-mmwa-08177a2a0?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  },
  { label: "YouTube", href: "https://youtube.com/@josephmmwa?si=FjP7SJcCAduNziJ3" },
  { label: "X", href: "https://x.com/Joseph_Mmwa" },
  { label: "Instagram", href: "https://www.instagram.com/mmwa_joseph?stkn=ZmVqdHl4d2ZrcTlv" },
  { label: "TikTok", href: "https://www.tiktok.com/@mmwajoseph?_r=1&_t=ZS-99UNneFRAKy" },
];
