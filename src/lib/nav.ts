export interface NavLink {
  label: string;
  href: string;
}

export const primaryNav: NavLink[] = [
  { label: "HOME", href: "/" },
  { label: "LATEST", href: "/latest" },
  { label: "KENYA", href: "/kenya" },
  { label: "GLOBAL", href: "/global" },
  { label: "REGIONS", href: "/regions" },
  { label: "TOPICS", href: "/topics" },
];

export const majorRegions = [
  { name: "Africa", slug: "africa" },
  { name: "Asia", slug: "asia" },
  { name: "Europe", slug: "europe" },
  { name: "North America", slug: "north-america" },
  { name: "South America", slug: "south-america" },
  { name: "Oceania", slug: "oceania" },
] as const;

export const primaryTopics = [
  { name: "Diseases & Conditions", slug: "diseases-conditions", searchPlaceholder: "Search by disease..." },
  { name: "Disease Outbreaks & Epidemics", slug: "disease-outbreaks-epidemics", searchPlaceholder: "Search by disease..." },
  { name: "Treatments & Medicines", slug: "treatments-medicines", searchPlaceholder: "Search by treatment or medicine..." },
  { name: "Medical Research", slug: "medical-research", searchPlaceholder: "Search research..." },
  { name: "Medical Innovation & Technology", slug: "medical-innovation-technology", searchPlaceholder: "Search by technology or innovation..." },
  { name: "Vaccines & Immunization", slug: "vaccines-immunization", searchPlaceholder: "Search by vaccine..." },
  { name: "HIV & AIDS", slug: "hiv-aids", searchPlaceholder: "Search HIV & AIDS stories..." },
  { name: "Cancer", slug: "cancer", searchPlaceholder: "Search by disease..." },
  { name: "Maternal & Child Health", slug: "maternal-child-health", searchPlaceholder: "Search maternal & child health..." },
  { name: "Mental Health", slug: "mental-health", searchPlaceholder: "Search mental health..." },
  { name: "Public Health", slug: "public-health", searchPlaceholder: "Search public health..." },
  { name: "Health Policy & Systems", slug: "health-policy-systems", searchPlaceholder: "Search policy or systems..." },
  { name: "Nutrition", slug: "nutrition", searchPlaceholder: "Search nutrition..." },
  { name: "Health & Environment", slug: "health-environment", searchPlaceholder: "Search environmental health..." },
] as const;

export const footerNews: NavLink[] = [
  { label: "Latest", href: "/latest" },
  { label: "Kenya", href: "/kenya" },
  { label: "Global", href: "/global" },
  { label: "Regions", href: "/regions" },
];

export const footerInformation: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Advertise", href: "/advertise" },
];

export const footerTopics: NavLink[] = [
  { label: "HIV & AIDS", href: "/topics/hiv-aids" },
  { label: "Vaccines & Immunization", href: "/topics/vaccines-immunization" },
  { label: "Medical Research", href: "/topics/medical-research" },
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
