import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#05080f]" />}>
      <AdminLoginForm />
    </Suspense>
  );
}
