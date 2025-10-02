"use client";
import Link from "next/link";

import {
    CardTitle,
    CardDescription,
    CardHeader,
    CardContent,
    CardFooter,
    Card,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { actions } from "@/data/actions";
import { useActionState } from "react";
import {type FormState } from "../validation/auth";
import { ZodErrors } from "../custom/zod-errors";
import { StrapiErrors } from "../custom/strapi-errors";
import { SubmitButton } from "../custom/submit-button";


const styles = {
    container: "w-full max-w-md",
    header: "space-y-1",
    title: "text-3xl font-bold text-pink-500",
    content: "space-y-4",
    fieldGroup: "space-y-2",
    footer: "flex flex-col",
    button: "w-full",
    prompt: "mt-4 text-center text-sm",
    link: "ml-2 text-pink-500",
};

const INITIAL_STATE: FormState = {
  success: false ,
  message: undefined,
  strapiErrors: null,
  zodErrors: null,
};


export function SignupForm() {

    const [formState, formAction] = useActionState(actions.auth.registerUserAction, INITIAL_STATE);


    console.log("##✅ will render on client ##");
    console.log(formState);
    console.log("✅ ###########################");



    return (
        <div className={styles.container}>
            <form action={formAction}>
                <Card>
                    <CardHeader className={styles.header}>
                        <CardTitle className={styles.title}>회원가입</CardTitle>
                        <CardDescription>
                            회원가입을 위한 세부 정보를 입력해주세요.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className={styles.content}>
                        <div className={styles.fieldGroup}>
                            <Label htmlFor="username">아이디</Label>
                            <Input
                                id="username"
                                required
                                name="username"
                                type="text"
                                placeholder="아이디를 입력해주세요"
                                defaultValue={formState?.data?.username || ""}
                            />
                            <ZodErrors error={formState?.zodErrors?.username} />
                        </div>
                        <div className={styles.fieldGroup}>
                            <Label htmlFor="email">이메일</Label>
                            <Input
                                id="email"
                                required
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                defaultValue={formState?.data?.email || ""}
                            />
                            <ZodErrors error={formState?.zodErrors?.email} />
                        </div>
                        <div className={styles.fieldGroup}>
                            <Label htmlFor="password">비밀번호</Label>
                            <Input
                                id="password"
                                required
                                name="password"
                                type="password"
                                placeholder="비밀번호"
                                defaultValue={formState?.data?.password || ""}
                            />
                            <ZodErrors error={formState?.zodErrors?.password} />
                        </div>

                        <div className={styles.fieldGroup}>
                            <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                            <Input
                                id="confirmPassword"
                                required
                                name="confirmPassword"
                                type="password"
                                placeholder="비밀번호 확인"
                                defaultValue={formState?.data?.confirmPassword || ""}
                                
                            />
                            <ZodErrors error={formState?.zodErrors?.confirmPassword} />

                        </div>
                    </CardContent>

                    <CardFooter className={styles.footer}>                        
                        <SubmitButton className="w-full" text="회원가입" loadingText="회원가입중..." />
                        <StrapiErrors error={formState?.strapiErrors} />
                    </CardFooter>
                </Card>
                <div className={styles.prompt}>
                    계정이 있으신가요?
                    <Link className={styles.link} href="signin">
                        로그인
                    </Link>
                </div>
            </form>
        </div>
    )


}



