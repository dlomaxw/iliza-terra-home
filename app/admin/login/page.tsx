import Image from "next/image";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function Login() {
  if (await currentUser()) redirect("/admin");
  return (
    <div className="grid min-h-screen place-items-center brand-gradient px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <Image src="/brand/logo-dark.png" alt="Iliza Terra Homes" width={417} height={198} className="mx-auto h-20 w-auto" priority />
        <h1 className="mt-6 text-center font-serif text-2xl font-bold text-navy">Admin sign in</h1>
        <LoginForm />
      </div>
    </div>
  );
}
