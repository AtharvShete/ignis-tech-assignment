import Link from "next/link"

export function Footer() {
    const footerLinks = [
        {
            title: "Support",
            links: [
                { name: "Help Center", href: "#" },
                { name: "Safety information", href: "#" },
                { name: "Cancellation options", href: "#" },
                { name: "Our COVID-19 Response", href: "#" },
            ],
        },
        {
            title: "Community",
            links: [
                { name: "Airbnb.org: disaster relief housing", href: "#" },
                { name: "Support Afghan refugees", href: "#" },
                { name: "Combating discrimination", href: "#" },
            ],
        },
        {
            title: "Hosting",
            links: [
                { name: "Try hosting", href: "#" },
                { name: "AirCover for Hosts", href: "#" },
                { name: "Explore hosting resources", href: "#" },
                { name: "Visit our community forum", href: "#" },
                { name: "How to host responsibly", href: "#" },
            ],
        },
        {
            title: "About",
            links: [
                { name: "Newsroom", href: "#" },
                { name: "Learn about new features", href: "#" },
                { name: "Letter from our founders", href: "#" },
                { name: "Careers", href: "#" },
                { name: "Investors", href: "#" },
            ],
        },
    ]

    return (
        <footer className="bg-gray-100 border-t">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-gray-600 hover:underline">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="text-gray-600 mb-4 md:mb-0">© {new Date().getFullYear()} Airbnb Clone, Inc.</div>
                    <div className="flex items-center space-x-6">
                        <Link href="#" className="text-gray-600 hover:underline">
                            Privacy
                        </Link>
                        <Link href="#" className="text-gray-600 hover:underline">
                            Terms
                        </Link>
                        <Link href="#" className="text-gray-600 hover:underline">
                            Sitemap
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

