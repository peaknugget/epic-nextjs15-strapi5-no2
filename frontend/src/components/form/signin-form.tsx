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

import { FormState } from "@/data/validation/auth";
import { useActionState } from "react";
import { actions } from "@/data/actions";
import { ZodErrors } from "../custom/zod-errors";
import { SubmitButton } from "../custom/submit-button";
import { StrapiErrors } from "../custom/strapi-errors";

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
  success: false,
  message: undefined,
  strapiErrors: null,
  zodErrors: null,
};


export function SigninForm() {
  const [formState, formAction] = useActionState(actions.auth.loginUserAction, INITIAL_STATE);


  return (
    <div className={styles.container}>
      <form action={formAction}>
        <Card>
          <CardHeader className={styles.header}>
            <CardTitle className={styles.title}>로그인</CardTitle>
            <CardDescription>
              계정에 로그인하려면 세부 정보를 입력하세요.
            </CardDescription>
          </CardHeader>
          <CardContent className={styles.content}>
            <div className={styles.fieldGroup}>
              <Label htmlFor="email">이메일</Label>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                placeholder="아이디 또는 이메일를 입력해주세요"
                defaultValue={formState?.data?.identifier || ""}
              />
              <ZodErrors error={formState?.zodErrors?.identifier} />

            </div>
            <div className={styles.fieldGroup}>
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="비밀번호를 입력해주세요."
                defaultValue={formState?.data?.password || ""}
              />
              <ZodErrors error={formState?.zodErrors?.password} />
            </div>
          </CardContent>
          <CardFooter className={styles.footer}>
            <SubmitButton className="w-full " text="로그인" loadingText="로그인 중..." />

            <StrapiErrors error={formState?.strapiErrors} />

          </CardFooter>
        </Card>
        <div className={styles.prompt}>
          계정이 없으신가요?
          <Link className={styles.link} href="signup">
            회원 가입
          </Link>
        </div>
      </form>
    </div>
  );
}