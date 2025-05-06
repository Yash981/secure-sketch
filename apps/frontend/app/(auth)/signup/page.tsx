import { AuthForm } from "@/components/auth-form/auth-form";
import { Shield } from "lucide-react";
import Link from "next/link";

const SignupPage = () => {
    return (
        <div className="relative min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center px-4">
            <div className="absolute w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle_248px_at_center,#16d9e3_0%,#30c7ec_47%,#46aef7_100%)] opacity-20 blur-3xl z-0"></div>

            <div className="relative w-full max-w-md p-8 rounded-2xl shadow-xl bg-white border border-gray-200 space-y-6 z-10 transition-all duration-300">
                <Link href="/home" className="flex items-center justify-center space-x-3 mb-2">
                    <Shield className="text-sketch-purple w-10 h-10" />
                    <span className="text-2xl font-semibold text-sketch-charcoal tracking-tight">Secure-Sketch</span>
                </Link>

                <div className="text-center space-y-1">
                    <h1 className="text-2xl font-bold text-gray-800">Sign Up</h1>
                    <p className="text-sm text-gray-500">Join us today — it&apos;s fast and secure.</p>
                </div>

                <AuthForm />
            </div>
        </div>

    );
}

export default SignupPage;