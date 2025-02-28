"use client";
import { createUserAction } from "@/actions/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CreateUserSchema } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useServerAction } from "zsa-react";

interface CreateUserFormProps extends React.ComponentPropsWithoutRef<"div"> {
  returnTo?: string;
}
export function CreateUserForm({
  className,
  returnTo,
  ...props
}: CreateUserFormProps) {
  const { data, execute, isPending, error } = useServerAction(createUserAction);

  const form = useForm<z.infer<typeof CreateUserSchema>>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof CreateUserSchema>) {
    const [, err] = await execute(values);
    if (err) {
      return;
    }
    form.reset({});
    const returnUrl = returnTo ?? "/";
    redirect(returnUrl);
  }

  return (
    <div
      className={cn("mx-auto flex w-full max-w-md flex-col gap-6", className)}
      {...props}
    >
      <Card className="border-opacity-50 shadow-md">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl font-bold">Create User</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter a username and password to create a new user.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="urmomma"
                        autoComplete="username"
                        className="h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="new-password"
                        type={"password"}
                        className="h-10 pr-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="new-password"
                        type={"password"}
                        className="h-10 pr-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="h-10 w-full transition-all"
                disabled={isPending}
              >
                {isPending ? "Creating User..." : "Create User"}
              </Button>
            </form>
          </Form>
          {data && (
            <Alert className="mt-4 border-green-200 bg-green-50 text-green-800">
              <AlertDescription>User creation successful</AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert className="mt-4 border-red-200 bg-red-50 text-red-800">
              <AlertDescription>
                {error.message || "An error occurred during user creation"}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
