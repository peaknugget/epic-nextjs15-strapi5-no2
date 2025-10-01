
mport Link from "next/link";
import type { TFooter } from "@/types";
import { Logo } from "@/components/custom/logo";

const styles = {
  footer: "dark bg-gray-900 text-white py-8",
  container:
    "container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between",
  text: "mt-4 md:mt-0 text-sm text-gray-300",
  socialContainer: "flex items-center space-x-4",
  socialLink: "text-white hover:text-gray-300",
  icon: "h-6 w-6",
  srOnly: "sr-only",
};

function selectSocialIcon(url: string) {
  if (url.includes("youtube")) return <YoutubeIcon className={styles.icon} />;
  if (url.includes("twitter")) return <TwitterIcon className={styles.icon} />;
  if (url.includes("github")) return <GithubIcon className={styles.icon} />;
  return null;
}

interface IFooterProps {
  data?: TFooter | null;
}

export const Footer = () => {
  return (
    <div>footer</div>
  )
}
