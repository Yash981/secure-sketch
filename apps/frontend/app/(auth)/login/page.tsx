import { AuthForm } from "@/components/auth-form/auth-form";

const LoginPage = () => {
    return (
        <div className="mx-auto relative h-screen ">
            <div className="w-96 p-6  rounded-lg shadow-md  space-y-4  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white  shadow-zinc-500">
                <h1 className="text-2xl font-bold mb-4 text-center">Login Page</h1>
                <AuthForm />
            </div>
        </div>
    );
}

export default LoginPage;