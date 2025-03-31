import { ExpandedSearchBar } from "@/components/expanded-search-bar"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="relative h-[70vh] bg-gradient-to-b from-rose-100 to-white">
        <div className="container mx-auto px-4 pt-32">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 text-center">Find your next stay</h1>
            <p className="text-xl text-gray-700 mb-8 text-center">
              Search low prices on homes, apartments and much more...
            </p>
            <div className="bg-white rounded-full shadow-lg">
              <ExpandedSearchBar />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Inspiration for your next trip</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {["Beach", "Mountain", "City", "Countryside"].map((category) => (
            <Link href={`/search?category=${category.toLowerCase()}`} key={category} className="group">
              <div className="rounded-xl overflow-hidden">
                <div className="h-64 bg-gray-200 relative">
                  <img
                    src={`/placeholder.svg?height=300&width=400&text=${category}`}
                    alt={category}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4 bg-primary text-primary-foreground">
                  <h3 className="text-xl font-semibold">{category}</h3>
                  <p className="mt-1">Explore {category.toLowerCase()} destinations</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to explore?</h2>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/search">Browse all listings</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

