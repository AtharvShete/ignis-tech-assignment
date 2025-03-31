"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { format } from "date-fns"

export function ExpandedSearchBar() {
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
        <div className="bg-white rounded-full shadow-lg border flex flex-col md:flex-row">
            <div className="flex-1 p-4 border-b md:border-b-0 md:border-r">
                <div className="text-xs font-bold mb-1">Where</div>
                <Input
                    placeholder="Search destinations"
                    className="border-0 p-0 h-auto text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
            </div>

            <div className="flex-1 p-4 border-b md:border-b-0 md:border-r">
                <div className="text-xs font-bold mb-1">Check in</div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" className="p-0 h-auto text-base font-normal justify-start hover:bg-transparent">
                            {checkIn ? format(checkIn, "d MMM") : "Add dates"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="flex-1 p-4 border-b md:border-b-0 md:border-r">
                <div className="text-xs font-bold mb-1">Check out</div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" className="p-0 h-auto text-base font-normal justify-start hover:bg-transparent">
                            {checkOut ? format(checkOut, "d MMM") : "Add dates"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="flex-1 p-4 flex items-center justify-between">
                <div>
                    <div className="text-xs font-bold mb-1">Who</div>
                    <Button variant="ghost" className="p-0 h-auto text-base font-normal justify-start hover:bg-transparent">
                        {guests > 1 ? `${guests} guests` : "Add guests"}
                    </Button>
                </div>

                <Button onClick={handleSearch} size="icon" className="rounded-full bg-rose-500 hover:bg-rose-600 h-12 w-12">
                    <Search className="h-5 w-5 text-white" />
                </Button>
            </div>
        </div>
    )
}

