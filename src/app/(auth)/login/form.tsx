"use client";
import { login } from "@/actions/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormTextField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { LoginSchema } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useServerAction } from "zsa-react";

interface LoginFormProps extends React.ComponentPropsWithoutRef<"div"> {
  returnTo?: string;
}

type LoginFormValues = z.infer<typeof LoginSchema>;
export function LoginForm({ className, returnTo, ...props }: LoginFormProps) {
  const { data, execute, isPending, error } = useServerAction(login);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    const [result, err] = await execute(values);
    if (err) {
      return;
    }

    if (result && result.success) {
      form.reset({});
      const returnUrl = returnTo ?? "/";
      console.log("test");
      router.push(returnUrl);
    }
  }

  return (
    <div
      className={cn("mx-auto flex w-full max-w-md flex-col gap-6", className)}
      {...props}
    >
      <Card className="border-opacity-50 shadow-md">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your username and password to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormTextField<LoginFormValues, "username">
                form={form}
                name="username"
                label="Username"
                autoComplete="username"
                placeholder="urmomma"
              />
              <FormTextField<LoginFormValues, "password">
                form={form}
                name="password"
                label="Password"
                autoComplete="current-password"
                type="password"
              />
              <Button
                type="submit"
                className="h-10 w-full transition-all"
                disabled={isPending}
              >
                {isPending ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
          {data && (
            <Alert className="mt-4 border-green-200 bg-green-50 text-green-800">
              <AlertDescription>Login successful</AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert className="mt-4 border-red-200 bg-red-50 text-red-800">
              <AlertDescription>
                {error.message || "An error occurred during login"}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
