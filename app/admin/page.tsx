import Link from "next/link";

export default function AdminLockPage() {
  return (
    <div className="mx-auto mt-24 max-w-md rounded border bg-white p-6">
      <h1 className="font-heading text-3xl font-black">Admin Access</h1>
      <p className="mt-2 text-sm">Protected by `ADMIN_PASSWORD` in middleware/API checks.</p>
      <Link className="mt-4 inline-block text-sm underline" href="/admin/dashboard">
        Continue to Dashboard →
      </Link>
    </div>
  );
}
