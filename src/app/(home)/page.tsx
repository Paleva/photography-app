import Image from "next/image"

export default function Page() {
    return (
        <div className="flex flex-col items-center justify-center px-2 mt-20 sm:flex-row">
            <div className="max-w-6xl w-full flex items-center justify-center sm:justify-start">
                <Image
                    src="/landscape.jpg"
                    height={580}
                    width={990}
                    className="object-cover rounded-lg shadow-lg mt-14 mb-16 sm:mb-0"
                    alt="landscape" />
            </div>
            <div className="w-full sm:w-1/3">
                <h2 className="text-4xl font-bold mb-4 mr-8">
                    Welcome to our website!
                </h2>
                <p className="text-lg text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
            </div>
        </div>
    )
}