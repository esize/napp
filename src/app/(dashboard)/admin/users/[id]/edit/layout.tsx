export default function EditUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto max-w-3xl py-8">
      <div className="rounded-lg border bg-card p-8 shadow-sm">{children}</div>
    </div>
  );
}
