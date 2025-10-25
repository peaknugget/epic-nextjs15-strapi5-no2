import Link from "next/link";
import type { THeader } from "@/types";

import { actions } from "@/data/actions";
import { Logo } from "@/components/custom/logo";
import { Button } from "@/components/ui/button";
import LoggedInUser from "./logged-in-user";



const styles = {
    header:
        "flex  items-center justify-between px-4 py-3 bg-white shadow-md dark:bg-gray-800",
    actions: "flex items-center gap-4",
    summaryContainer: "flex-1 flex justify-center max-w-2xl mx-auto",
};

interface IHeaderProps {
    data?: THeader | null;
}


export default async function Header({ data }: IHeaderProps) {

    if (!data) return null;
    const user = await actions.auth.getUserMeAction();
    const { logoText, ctaButton } = data;

    return (
        <div className={styles.header}>
            <Logo text={logoText.label} />
            <div className={styles.actions}>
                {user.success && user.data ? (
                    <LoggedInUser userData={user.data} />
                ) : (
                    <Link href={ctaButton.href}>
                        <Button>{ctaButton.label}</Button>
                    </Link>
                )}
            </div>
        </div>
    )


}


