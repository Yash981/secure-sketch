"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UserAuthFormSchema } from "@repo/shared-schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LoginRouteAction } from "@/actions/login-route-action";
import { signupRouteAction } from "@/actions/signup-route-action";
import Link from "next/link";


export const AuthForm = () => {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const form = useForm<UserAuthFormSchema>({
        resolver: zodResolver(UserAuthFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })
    const onSubmit = async (data: UserAuthFormSchema) => {
        const parsedData = UserAuthFormSchema.safeParse(data)
        if (!parsedData.success) {
            return setError(parsedData.error.errors[0].message)
        }
        setIsLoading(true)
        if (pathname === "/login") {
            try {
                const response = await LoginRouteAction(data)
                if (!response.success) {
                    return setError(response.error); // Display the error message
                }
                if (response && response.data.token) {
                    localStorage.setItem('excaliWsToken', response.data.token)
                    localStorage.setItem('excaliUsername', response.data.username)
                }
                router.push("/")
            } catch (error) {
                setError((error as Error).message)
            } finally {
                setIsLoading(false)
            }
        } else {
            try {
                const response = await signupRouteAction(data)
                if (!response.success) {
                    return setError(response.error);
                }
                router.push("/login")
            } catch (error: any) {
                setError(error)
            } finally {
                setIsLoading(false)
            }
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" {...field} disabled={isLoading} />
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
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormMessage>{error}</FormMessage>
                <div className="space-y-6 mt-4">
                    <Button type="submit" variant="default" disabled={isLoading} className="w-full text-base font-semibold">
                        {pathname === "/login" ? "Login" : "Sign Up"}
                    </Button>

                    <div className="text-center text-sm text-gray-600">
                        {pathname === "/login" ? "Don't have an account?" : "Already have an account?"}
                        <Link href={pathname === "/login" ? "/signup" : "/login"}>
                            <span className="ml-1 text-sketch-purple font-medium hover:underline">
                                {pathname === "/login" ? "Sign Up" : "Login"}
                            </span>
                        </Link>
                    </div>

                    <Button variant="link" className="text-sm text-sketch-purple hover:underline hover:text-sketch-charcoal mx-auto block" onClick={async () => {
                        form.setValue("email", "yyyyy@gmail.com");
                        form.setValue("password", "YY@@$$h8919551587");
                        try {
                            await onSubmit({
                                email: "yyyyy@gmail.com",
                                password: "YY@@$$h8919551587"
                            });
                        } catch (error) {
                            setError((error as Error).message)
                        }
                    }}>
                        Sign in as Guest User
                    </Button>
                </div>
            </form>
        </Form>

    )
}