import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormStatus } from "react-dom"
import { register } from "@/app/(public)/auth/auth"
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function RegisterForm({
	className,
	...props
}) {
	const router = useRouter();
	const [state, setState] = useState({ errors: null, message: null });

	const handleSubmit = async (event) => {
		event.preventDefault();
		const formData = new FormData(event.target);
		const response = await register(state, formData);
		setState(response);
		if (response.message === "Registration successful") {
			router.push('/home');
		}
	};

	return (
		(<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Register</CardTitle>
					<CardDescription>
						Enter your email and username below to register
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
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
							<RegisterButton />
						</div>
					</form>
				</CardContent>
			</Card>
		</div>)
	);
}

export function RegisterButton() {
	const { pending } = useFormStatus();

	return (
		<Button aria-disabled={pending} type="submit" className="w-full">
			{pending ? "Registering..." : "Register"}
		</Button>
	)
}