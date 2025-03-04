const router = useRouter()

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const form = event.target as HTMLFormElement
        const formData = new FormData(form)
        const email = formData.get('email')
        const password = formData.get('password')
        const username = formData.get('username')

        console.log(email, password)

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, username })
            })

            console.log(response)

            if (response.redirected) {
                router.push(response.url)
            } else if (response.ok) {
                const result = await response.json()
                console.log(result)
            }

        } catch (error) {
            console.error('An unexpected error occurred:', error)
        }
    }