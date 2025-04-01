"use client"

import Link from "next/link"
import { Heart, Star } from "lucide-react"
import { useState } from "react"
import type { Listing } from "@/lib/types"

interface ListingCardProps {
    listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
    const [isFavorite, setIsFavorite] = useState(false)

    return (
        <div className="group relative">
            <div className="absolute top-3 right-3 z-10">
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        setIsFavorite(!isFavorite)
                    }}
                    className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:scale-110 transition"
                >
                    <Heart className={`h-4 w-4 ${isFavorite ? "fill-rose-500 text-rose-500" : "text-gray-600"}`} />
                </button>
            </div>

            <Link href={`/listing/${listing.id}`}>
                <div className="rounded-xl overflow-hidden">
                    <div className="relative aspect-square overflow-hidden">
                        <img
                            src={listing.image_urls[0] || "/placeholder.svg"}
                            alt={listing.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                    </div>
                    <div className="mt-3">
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-base line-clamp-1">{listing.title}</h3>
                            <div className="flex items-center">
                                <Star className="h-4 w-4 fill-current" />
                                <span className="ml-1 text-sm">{listing.ratings}</span>
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm mt-1">{listing.location}</p>
                        <div className="flex items-baseline mt-1">
                            <span className="font-semibold">
                                {listing.currency} {Number.parseFloat(listing.price_per_night).toLocaleString()}
                            </span>{" "}
                            <span className="text-sm ml-1">night</span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

