import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "@/zod/authSchema"

import z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import useAuthStore, { type AuthStore } from "@/store/useAuthStore"
import { Link, useNavigate } from "react-router"
import toast from "react-hot-toast"
import { useState } from "react"
import { Eye, EyeClosed } from "lucide-react"

function Login() {
    const navigate = useNavigate();

    const { login, isSubmitting } = useAuthStore() as AuthStore;
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema)
    })

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        const res = await login(values);
        if (res) {
            setTimeout(() => {
                navigate("/dashboard")
            }, 1000);
            toast.success("Login successful!");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 poppins-regular">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-lg p-8 text-white">
                <h2 className="text-4xl font-semibold text-center mb-8">Login</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-white"
                                            placeholder="example123"
                                            {...field}
                                        />
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
                                    <FormLabel className="text-gray-300">Password</FormLabel>
                                    <FormControl>
                                        <span className="flex gap-1 items-center">
                                            <Input
                                                type={showPassword? "text" : "password"}
                                                className="bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-white"
                                                placeholder="Enter password"
                                                {...field}
                                            />

                                            {showPassword ?
                                                <Button className="bg-indigo-600 hover:bg-indigo-700" type="reset" onClick={() => {
                                                    setShowPassword(false);
                                                }}>
                                                    <EyeClosed />
                                                </Button>
                                                :
                                                <Button className="bg-indigo-600 hover:bg-indigo-700" type="reset" onClick={() => {
                                                    setShowPassword(true);
                                                }}>
                                                    <Eye />
                                                </Button>
                                            }

                                        </span>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            variant="secondary"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                    </form>
                </Form>
                <p className="mt-6 text-center text-sm text-gray-400">
                    Don't have an account?{" "}
                    <Link to={"/signup"} className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login
