"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Search, CalendarIcon, Users } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function SearchBar() {
    const router = useRouter()
    const [location, setLocation] = useState("")
    const [checkIn, setCheckIn] = useState<Date | undefined>(undefined)
    const [checkOut, setCheckOut] = useState<Date | undefined>(undefined)
    const [guests, setGuests] = useState(1)

    const handleSearch = () => {
        const params = new URLSearchParams()

        if (location) params.append("location", location)
        if (checkIn) params.append("checkIn", checkIn.toISOString())
        if (checkOut) params.append("checkOut", checkOut.toISOString())
        if (guests > 0) params.append("guests", guests.toString())

        router.push(`/search?${params.toString()}`)
    }

    return (
        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Where are you going?"
                        className="pl-10"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check in</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn("w-full justify-start text-left font-normal", !checkIn && "text-muted-foreground")}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {checkIn ? format(checkIn, "PPP") : "Select date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check out</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn("w-full justify-start text-left font-normal", !checkOut && "text-muted-foreground")}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {checkOut ? format(checkOut, "PPP") : "Select date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                    <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            type="number"
                            min="1"
                            placeholder="Add guests"
                            className="pl-10"
                            value={guests}
                            onChange={(e) => setGuests(Number.parseInt(e.target.value) || 1)}
                        />
                    </div>
                </div>

                <div className="flex items-end">
                    <Button className="w-full md:w-auto bg-rose-500 hover:bg-rose-600 text-white" onClick={handleSearch}>
                        <Search className="mr-2 h-4 w-4" />
                        Search
                    </Button>
                </div>
            </div>
        </div>
    )
}

