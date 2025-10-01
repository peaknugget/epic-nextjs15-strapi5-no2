
import Link from "next/link";
import type { TFooter } from "@/types";
import { Logo } from "@/components/custom/logo";
import { FaYoutube, FaTwitter, FaGithub } from "react-icons/fa";

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
    if (url.includes("youtube")) return <FaYoutube className="w-6 h-6 text-red-500" />;
    if (url.includes("twitter")) return <FaTwitter className="w-6 h-6 text-sky-500" />;
    if (url.includes("github")) return <FaGithub className={styles.icon}  />;
    return null;
}


interface IFooterProps {
    data?: TFooter | null;
}

export const Footer = ({ data }: Readonly<IFooterProps>) => {
    if (!data) return null;
    const { logoText, socialLink, text } = data;
    return (
        <div className={styles.footer}>
            <div className={styles.container}>
                <Logo dark text={logoText.label} />
                <p className={styles.text}>{text}</p>
                <div className={styles.socialContainer}>
                    {socialLink.map((link) => {
                        return (
                            <Link
                                className={styles.socialLink}
                                href={link.href}
                                key={link.id}
                            >
                                {selectSocialIcon(link.href)}
                                <span className={styles.srOnly}>Visit us at {link.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );

}
