import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
export function UserCard({ username, profile_picture, bio }: { username: string, profile_picture: string, bio: string }) {
    return (
        <div>
            <div className='flex items-center gap-3'>
                <Avatar className="h-20 w-20">
                    <AvatarImage src={profile_picture} alt={username} />
                    <AvatarFallback className="bg-primary/20 text-primary text-2xl">{username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-medium text-2xl">{username}</p>
                </div>
            </div>
            {bio && (
                <div className="flex flex-col my-2">
                    <p className="text-md">{bio}</p>
                </div>
            )}
        </div>
    )
}