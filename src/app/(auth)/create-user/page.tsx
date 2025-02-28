import { safeRedirect } from "@/lib/utils";
import { CreateUserForm } from "./form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = (await searchParams).returnTo;
  let redirectUrl = "/";
  if (params) {
    redirectUrl = safeRedirect(params[0]);
  }
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <CreateUserForm returnTo={redirectUrl} />
      </div>
    </div>
  );
}
