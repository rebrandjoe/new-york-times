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
  { label: "Terms of Service", href: "/terms-of-service" },
];

export const footerLegal: NavLink[] = [
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms-of-service" },
];

export interface SocialLink {
  label: string;
  href: string;
}

export const socialLinks: SocialLink[] = [
  { label: "Facebook", href: "https://facebook.com/josephmmwa" },
  { label: "LinkedIn", href: "https://linkedin.com/company/josephmmwa" },
  { label: "YouTube", href: "https://youtube.com/@josephmmwa" },
  { label: "X", href: "https://x.com/josephmmwa" },
];
