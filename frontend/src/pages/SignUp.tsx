import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema } from "@/zod/authSchema"
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
import toast from "react-hot-toast"
import { Link, useNavigate } from "react-router"
import useAuthStore, { type AuthStore } from "@/store/useAuthStore"
import { useState } from "react"
import { Eye, EyeClosed } from "lucide-react"

function SignUp() {
    const navigate = useNavigate()
    const { signup, isSubmitting } = useAuthStore() as AuthStore
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema)
    })

    async function onSubmit(values: z.infer<typeof signupSchema>) {
        const res = await signup(values)
        if (res) {
            navigate("/login")
            toast.success("Signup successful!")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center  px-4 poppins-regular">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-lg p-8 text-white">
                <h2 className="text-4xl font-semibold text-center mb-8">Sign Up</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="fullname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">Full Name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="John Doe" 
                                            {...field} 
                                            className="bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-white"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">Username</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="example123" 
                                            {...field} 
                                            className="bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-white"
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
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                    </form>
                </Form>
                <p className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link 
                        to="/login" 
                        className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default SignUp
