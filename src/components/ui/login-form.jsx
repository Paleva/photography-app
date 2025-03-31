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
import { useActionState } from "react"
import { login } from "@/app/(public)/auth/auth"


export function LoginForm({
    className,
    ...props
}) {
    const [state, action, pending] = useActionState(login);

    return (
        (<div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className='py-6'>
                <CardHeader>
                    <CardTitle className="text-2xl">Sign in</CardTitle>
                    <CardDescription>
                        Enter your email and password to sign in
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={action}>
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
                            <Button disabled={pending} aria-disabled={pending} type="submit" className="w-full">
                                {pending ? "Logging in..." : "Login"}
                            </Button>
                            <div className="text-center text-sm">
                                Don't have an account?{' '}
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
