import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/icons";
import { socialLinks } from "@/lib/nav";

const socialIconMap = {
  Facebook: FacebookIcon,
  LinkedIn: LinkedInIcon,
  YouTube: YouTubeIcon,
  X: XIcon,
  Instagram: InstagramIcon,
  TikTok: TikTokIcon,
};

/** Site-wide social row: Connect with me on social media + icons. */
export function SocialFollow({
  className = "",
  align = "left",
  iconSize = "md",
}: {
  className?: string;
  align?: "left" | "center";
  iconSize?: "sm" | "md";
}) {
  const alignClass = align === "center" ? "items-center text-center" : "items-start text-left";
  const iconClass = iconSize === "sm" ? "h-5 w-5" : "h-6 w-6";

  return (
    <div className={`flex flex-col gap-3 ${alignClass} ${className}`}>
      <div>
        <p className="text-sm font-semibold text-offwhite sm:text-base">
          Connect with me on social media
        </p>
        <p className="mt-0.5 text-xs text-gray-muted/70">(click to visit)</p>
      </div>
      <div className="flex flex-wrap items-center gap-5">
        {socialLinks.map((social) => {
          const Icon = socialIconMap[social.label as keyof typeof socialIconMap];
          if (!Icon) return null;
          return (
            <a
              key={social.href}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="focus-ring text-gray-secondary transition-colors hover:text-accent"
            >
              <Icon className={iconClass} />
            </a>
          );
        })}
      </div>
    </div>
  );
}
