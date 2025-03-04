import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormStatus } from "react-dom"
import { login } from "@/app/(public)/auth/auth"
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function LoginForm({
    className,
    ...props
}) {
    const router = useRouter();
    const [state, setState] = useState({ errors: null, message: null });

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const response = await login(state, formData);
        setState(response);
        if (response.message === "Login successful.") {
            router.push('/home');
        }
    };

    return (
        (<div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Sign in</CardTitle>
                    <CardDescription>
                        Enter your email and password to sign in
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input name="email" id="email" type="email" placeholder="example@gmail.com" required />
                            </div>
                            {state?.errors?.email && (
                                <p className="text-sm text-red-500">{state.errors.email}</p>
                            )}
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input name="password" id="password" type="password" placeholder="Password" required />
                            </div>
                            {state?.errors?.password && (
                                <p className="text-sm text-red-500">{state.errors.password}</p>
                            )}
                            {state?.message && state.message !== "Login successful." && (
                                <p className="text-sm text-red-500">{state.message}</p>
                            )}
                            <LoginButton />
                            <div className="text-center text-sm">
                                Don&apos;t have an account?{' '}
                                <Link className="underline" href="/register">
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>)
    );
}

export function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <Button aria-disabled={pending} type="submit" className="w-full">
            {pending ? "Logging in..." : "Login"}
        </Button>
    )
}