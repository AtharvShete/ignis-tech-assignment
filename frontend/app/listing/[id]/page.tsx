"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Star, Share, Heart, CalendarIcon, Users, Home, Coffee, Wifi, Tv, Utensils, Car, Snowflake } from "lucide-react"
import { mockListings } from "@/lib/mock-data"

export default function ListingPage() {
    const { id } = useParams()
    const [listing, setListing] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)
    const [checkIn, setCheckIn] = useState<Date | undefined>(undefined)
    const [checkOut, setCheckOut] = useState<Date | undefined>(undefined)
    const [guests, setGuests] = useState(1)
    const [activeImage, setActiveImage] = useState(0)
    const [isFavorite, setIsFavorite] = useState(false)

    useEffect(() => {
        // Simulate API call to fetch listing details
        setLoading(true)
        setTimeout(() => {
            const foundListing = mockListings.find((item) => item.id === id)
            setListing(foundListing || null)
            setLoading(false)
        }, 1000)
    }, [id])

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-6 w-1/2 mb-8" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <Skeleton className="h-96 w-full" />
                    <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-44 w-full" />
                        <Skeleton className="h-44 w-full" />
                        <Skeleton className="h-44 w-full" />
                        <Skeleton className="h-44 w-full" />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1">
                        <Skeleton className="h-8 w-1/2 mb-4" />
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-6 w-3/4 mb-8" />

                        <Skeleton className="h-px w-full mb-8" />

                        <Skeleton className="h-8 w-1/3 mb-4" />
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-6 w-full mb-8" />
                    </div>

                    <div className="lg:w-96">
                        <Skeleton className="h-96 w-full rounded-xl" />
                    </div>
                </div>
            </div>
        )
    }

    if (!listing) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Listing Not Found</h2>
                <p className="text-gray-500 mb-6">The listing you're looking for doesn't exist or has been removed.</p>
                <Button asChild>
                    <a href="/search">Browse other listings</a>
                </Button>
            </div>
        )
    }

    const calculateTotalPrice = () => {
        if (!checkIn || !checkOut) return 0

        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
        return listing.price_per_night * nights
    }

    const totalPrice = calculateTotalPrice()

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="flex items-center">
                        <Star className="h-4 w-4 fill-current text-black" />
                        <span className="ml-1 font-medium">{listing.ratings}</span>
                    </div>
                    <span className="text-gray-500">·</span>
                    <span className="underline font-medium">{listing.reviews} reviews</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-500">{listing.location}</span>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Share className="h-4 w-4" />
                        <span className="underline">Share</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => setIsFavorite(!isFavorite)}
                    >
                        <Heart className={`h-4 w-4 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
                        <span className="underline">Save</span>
                    </Button>
                </div>
            </div>

            {/* Image Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8">
                <div className="md:col-span-2 row-span-2 relative rounded-l-xl overflow-hidden">
                    <img
                        src={listing.images[0] || "/placeholder.svg"}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                        style={{ height: "100%", minHeight: "300px" }}
                    />
                </div>
                {listing.images.slice(1, 5).map((image: string, index: number) => (
                    <div
                        key={index}
                        className={`relative overflow-hidden ${index === 1 ? "rounded-tr-xl" : index === 3 ? "rounded-br-xl" : ""}`}
                    >
                        <img
                            src={image || "/placeholder.svg"}
                            alt={`${listing.title} - Image ${index + 2}`}
                            className="w-full h-full object-cover"
                            style={{ height: "150px" }}
                            onClick={() => setActiveImage(index + 1)}
                        />
                    </div>
                ))}
                <Button variant="outline" className="absolute bottom-4 right-4 bg-white rounded-md px-3 py-1 text-sm">
                    Show all photos
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Listing Details */}
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-6 border-b pb-6">
                        <div>
                            <h2 className="text-xl font-semibold">
                                {listing.property_type} in {listing.location.split(",")[0]}
                            </h2>
                            <p className="text-gray-500 mt-1">
                                {listing.guests} guests · {listing.bedrooms} bedrooms · {listing.beds} beds · {listing.bathrooms} baths
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                            <img
                                src={listing.host.image || "/placeholder.svg?height=50&width=50"}
                                alt={listing.host.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="border-b pb-6 mb-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-2">
                                <Home className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Entire {listing.property_type.toLowerCase()}</h3>
                                <p className="text-gray-500">You'll have the {listing.property_type.toLowerCase()} to yourself.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-2">
                                <Star className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Highly rated host</h3>
                                <p className="text-gray-500">{listing.host.name} has received excellent reviews.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="p-2">
                                <CalendarIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Free cancellation before check-in</h3>
                                <p className="text-gray-500">Cancel before check-in for a partial refund.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6 border-b pb-6">
                        <h3 className="text-xl font-semibold mb-4">About this place</h3>
                        <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
                    </div>

                    <div className="mb-6 border-b pb-6">
                        <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {listing.amenities.map((amenity: string, index: number) => {
                                const icons: Record<string, any> = {
                                    WiFi: <Wifi className="h-5 w-5" />,
                                    Kitchen: <Utensils className="h-5 w-5" />,
                                    "Free parking": <Car className="h-5 w-5" />,
                                    TV: <Tv className="h-5 w-5" />,
                                    "Air Conditioning": <Snowflake className="h-5 w-5" />,
                                    "Coffee maker": <Coffee className="h-5 w-5" />,
                                }

                                return (
                                    <div key={index} className="flex items-center gap-4">
                                        {icons[amenity] || <Home className="h-5 w-5" />}
                                        <span>{amenity}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Booking Card */}
                <div className="lg:w-96">
                    <div className="border rounded-xl p-6 shadow-lg sticky top-24">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <span className="text-xl font-semibold">
                                    {listing.currency === "USD" ? "$" : "₹"} {listing.price_per_night}
                                </span>{" "}
                                <span className="text-gray-500">night</span>
                            </div>
                            <div className="flex items-center">
                                <Star className="h-4 w-4 fill-current" />
                                <span className="ml-1">{listing.ratings}</span>
                                <span className="text-gray-500 ml-1">·</span>
                                <span className="text-gray-500 ml-1 underline">{listing.reviews} reviews</span>
                            </div>
                        </div>

                        <div className="border rounded-t-lg overflow-hidden">
                            <div className="grid grid-cols-2">
                                <div className="border-r border-b p-3">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">CHECK-IN</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal p-0",
                                                    !checkIn && "text-muted-foreground",
                                                )}
                                            >
                                                {checkIn ? format(checkIn, "MMM d, yyyy") : "Add date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="border-b p-3">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">CHECKOUT</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal p-0",
                                                    !checkOut && "text-muted-foreground",
                                                )}
                                            >
                                                {checkOut ? format(checkOut, "MMM d, yyyy") : "Add date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            <div className="p-3">
                                <label className="block text-xs font-medium text-gray-700 mb-1">GUESTS</label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        type="number"
                                        min="1"
                                        max={listing.guests}
                                        placeholder="Add guests"
                                        className="pl-10"
                                        value={guests}
                                        onChange={(e) => setGuests(Number.parseInt(e.target.value) || 1)}
                                    />
                                </div>
                            </div>
                        </div>

                        <Button className="w-full mt-4 bg-rose-500 hover:bg-rose-600 text-white">Reserve</Button>

                        <p className="text-center text-gray-500 text-sm mt-2">You won't be charged yet</p>

                        {checkIn && checkOut && (
                            <div className="mt-6 space-y-4">
                                <div className="flex justify-between">
                                    <span className="underline">
                                        {listing.currency === "USD" ? "$" : "₹"} {listing.price_per_night} x{" "}
                                        {Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))} nights
                                    </span>
                                    <span>
                                        {listing.currency === "USD" ? "$" : "₹"} {totalPrice}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="underline">Cleaning fee</span>
                                    <span>
                                        {listing.currency === "USD" ? "$" : "₹"} {listing.cleaning_fee || 50}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="underline">Service fee</span>
                                    <span>
                                        {listing.currency === "USD" ? "$" : "₹"} {Math.round(totalPrice * 0.15)}
                                    </span>
                                </div>
                                <hr className="my-4" />
                                <div className="flex justify-between font-semibold">
                                    <span>Total before taxes</span>
                                    <span>
                                        {listing.currency === "USD" ? "$" : "₹"}{" "}
                                        {totalPrice + (listing.cleaning_fee || 50) + Math.round(totalPrice * 0.15)}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="mt-4 pt-4 border-t text-center">
                            <div className="flex items-center justify-center text-rose-500">
                                <svg viewBox="0 0 32 32" className="h-4 w-4 mr-1 fill-current">
                                    <path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zm0 28c-6.627 0-12-5.373-12-12s5.373-12 12-12 12 5.373 12 12-5.373 12-12 12z"></path>
                                    <path d="M16 8c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm0 14c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"></path>
                                </svg>
                                Prices include all fees
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

