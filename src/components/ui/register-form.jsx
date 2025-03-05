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
import { register } from "@/app/(public)/auth/auth"


export function RegisterForm({
	className,
	...props
}) {
	const [state, action, pending] = useActionState(register);

	return (
		(<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Sign up</CardTitle>
					<CardDescription>
						Enter your email and username below to sign up
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={action}>
						<div className="flex flex-col gap-6">
							<div className="grid gap-2">
								<Label htmlFor="username">Username</Label>
								<Input name="username" id="username" type="text" placeholder="spooky" required />
							</div>
							{state?.errors?.username && (
								<p className="text-sm text-red-500">{state.errors.username}</p>
							)}
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
								<div className="text-sm text-red-500">
									<p>Password must:</p>
									<ul>
										{state.errors.password.map((error) => (
											<li key={error}>- {error}</li>
										))}
									</ul>
								</div>
							)}
							{state?.message && state.message !== "Registration successful" && (
								<p className="text-sm text-red-500">{state.message}</p>
							)}
							<Button disabled={pending} aria-disabled={pending} type="submit" className="w-full">
								{pending ? "Registering..." : "Register"}
							</Button>
							<div className=" text-center text-sm">
								Already have an account?{' '}
								<Link className="underline" href="/login">
									Sign in
								</Link>
							</div>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>)
	);
}
