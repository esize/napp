"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SanitizedUser } from "@/db/schema";
import { updateUserById } from "@/actions/users";
import { useServerAction } from "zsa-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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

const UserFormSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  isActive: z.boolean().default(true),
  isLocked: z.boolean().default(false),
});

type UserFormValues = z.infer<typeof UserFormSchema>;

interface UserSheetProps {
  open: boolean;
  user: SanitizedUser | null;
  onOpenChange: (open: boolean) => void;
  onUserSaved: () => void;
}

export function UserSheet({
  open,
  user,
  onOpenChange,
  onUserSaved,
}: UserSheetProps) {
  const { execute, isPending } = useServerAction(updateUserById);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      username: "",
      isActive: true,
      isLocked: false,
    },
  });

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        isActive: user.isActive ?? true,
        isLocked: user.isLocked ?? false,
      });
    } else {
      form.reset({
        username: "",
        isActive: true,
        isLocked: false,
      });
    }
  }, [user, form]);

  async function onSubmit(data: UserFormValues) {
    if (!user) return;

    try {
      const [, error] = await execute({
        id: user.id,
        ...data,
      });

      if (error) {
        toast.error("Failed to update user");
        return;
      }

      toast.success("User updated successfully");
      onOpenChange(false);
      onUserSaved();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit User</SheetTitle>
          <SheetDescription>
            Update user details. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 py-8"
          >
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
            <SheetFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save changes"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
