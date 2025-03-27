export function Bio({ bio }: { bio: string }) {
    return (
        <div>
            <h1 className="text-xl font-bold"> Bio </h1>
            {bio ?
                <p> {bio} </p> :
                <p> No bio </p>
            }
        </div>
    )
}