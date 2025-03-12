"use client";

import { updateUserById } from "@/actions/users";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { SanitizedUser } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useServerAction } from "zsa-react";

const UserFormSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  isActive: z.boolean().default(true),
  isLocked: z.boolean().default(false),
});

type UserFormValues = z.infer<typeof UserFormSchema>;

export default function EditUserForm({
  params,
  user,
  onSuccess,
}: {
  params: { id: string };
  user: SanitizedUser;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const { execute, isPending } = useServerAction(updateUserById);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: user
      ? {
          username: user.username,
          isActive: user.isActive ?? true,
          isLocked: user.isLocked ?? false,
        }
      : {
          username: "",
          isActive: true,
          isLocked: false,
        },
  });

  async function onSubmit(data: UserFormValues) {
    try {
      const [, error] = await execute({
        id: params.id,
        ...data,
      });

      if (error) {
        toast.error("Failed to update user");
        console.error(error);
        return;
      }

      toast.success("User updated successfully");

      // Call onSuccess callback if provided, otherwise navigate back
      if (onSuccess) {
        onSuccess();
      } else {
        router.back();
      }

      // Refresh the page data
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the user");
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Active</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isLocked"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Locked</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
