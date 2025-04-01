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
    </div>
  )
}

