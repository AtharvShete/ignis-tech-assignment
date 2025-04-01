"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ListingCard } from "@/components/listing-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { searchListings } from "@/lib/api"
import type { Listing } from "@/lib/types"

export default function SearchPage() {
    const searchParams = useSearchParams()
    const [listings, setListings] = useState<Listing[]>([])
    const [loading, setLoading] = useState(true)
    const [mounted, setMounted] = useState(false)

    // Get search parameters
    const location = searchParams?.get("location") || ""
    const checkIn = searchParams?.get("checkIn") || ""
    const checkOut = searchParams?.get("checkOut") || ""
    const guests = searchParams?.get("guests") || "1"

    // Set mounted state on initial render
    useEffect(() => {
        setMounted(true)
    }, [])

    // Fetch listings when mounted or search params change
    useEffect(() => {
        if (!mounted) return

        async function fetchListings() {
            setLoading(true)
            try {
                const params: Record<string, string> = { location }

                if (checkIn) params.checkIn = checkIn
                if (checkOut) params.checkOut = checkOut
                if (guests) params.guests = guests

                const results = await searchListings(params)
                setListings(results)
            } catch (error) {
                console.error("Error fetching listings:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchListings()
    }, [location, checkIn, checkOut, guests, mounted])

    // Don't render anything until component is mounted
    if (!mounted) {
        return null
    }

    return (
        <div>
            <div className="container mx-auto px-4 py-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                        <h2 className="text-lg font-semibold">{listings.length} places</h2>
                        {location && (
                            <div className="flex items-center ml-2">
                                <span className="text-gray-500 mx-1">in</span>
                                <span className="font-medium">{location}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center text-sm">
                        <div className="flex items-center text-rose-500">
                            <svg viewBox="0 0 32 32" className="h-4 w-4 mr-1 fill-current">
                                <path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zm0 28c-6.627 0-12-5.373-12-12s5.373-12 12-12 12 5.373 12 12-5.373 12-12 12z"></path>
                                <path d="M16 8c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm0 14c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"></path>
                            </svg>
                            Prices include all fees
                        </div>
                    </div>
                </div>

                {/* Listings grid */}
                <div className="w-full px-4">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {Array(8)
                                .fill(0)
                                .map((_, i) => (
                                    <div key={i} className="rounded-xl overflow-hidden">
                                        <Skeleton className="h-64 w-full" />
                                        <div className="p-4">
                                            <Skeleton className="h-4 w-3/4 mb-2" />
                                            <Skeleton className="h-4 w-1/2 mb-2" />
                                            <Skeleton className="h-4 w-1/4" />
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ) : listings.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {listings.map((listing) => (
                                <ListingCard key={listing.id} listing={listing} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <h3 className="text-xl font-semibold mb-2">No listings found</h3>
                            <p className="text-gray-500 mb-6">Try adjusting your search criteria</p>
                            <Button asChild>
                                <a href="/search">Clear search</a>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

