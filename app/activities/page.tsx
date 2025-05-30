"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Clock, DollarSign, Star, Users } from "lucide-react"

// Interface for the raw data fetched from the API
interface ApiActivity {
  id: number
  title: string
  description: string
  location: string
  duration: string
  price: number // Price is a number from the API
  category: string // Comma-separated string, e.g., "Speedboat,Sightseeing"
  image: string
  rating: string // e.g., "4.9/5 average"
  groupSize: number // Group size is a number
  includes: string // Newline-separated string
  maps: string; // URL for the map or booking link
  // 'bestTime' is not available in the new API data
}

// Interface for the processed activity data used in the component
interface ProcessedActivity {
  id: number
  title: string
  description: string
  location: string
  duration: string
  displayPrice: string // Formatted price for display
  primaryCategory: string // For the badge, usually the first category
  allCategories: string[] // All categories for filtering
  image: string
  rating: number // Parsed numeric rating
  groupSize: string // Formatted group size string
  includes: string[] // Array of included items
  maps: string; // URL for the map or booking link
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<ProcessedActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>(["All"])
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbyiqShMaQdMbjRsFrHhdC9gtQbldFvDquSr_ONIHMCd_bgV8xeWV_ROGIUpdEL8MmY1/exec",
        )
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: ApiActivity[] = await response.json()

        const uniqueCategories = new Set<string>()
        const processedData: ProcessedActivity[] = data.map((item) => {
          console.log(item);
          const itemCategories = item.category.split(",").map((c) => c.trim()).filter(Boolean)
          itemCategories.forEach((cat) => uniqueCategories.add(cat))

          return {
            id: item.id,
            title: item.title,
            description: item.description,
            location: item.location,
            duration: item.duration,
            displayPrice: `${item.price.toLocaleString()} THB`,
            primaryCategory: itemCategories[0] || "General",
            allCategories: itemCategories,
            image: item.image || "/placeholder.svg?height=200&width=300",
            rating: parseFloat(item.rating.split("/")[0]) || 0,
            groupSize: `Up to ${item.groupSize} people`,
            includes: item.includes.split("\n").map((i) => i.trim()).filter(Boolean),
            maps: item.maps || "#", // Use the maps URL from API or fallback to "#"
          }
        })

        setActivities(processedData)
        setCategories(["All", ...Array.from(uniqueCategories)])
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message)
        } else {
          setError("An unknown error occurred")
        }
        console.error("Failed to fetch activities:", e)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredActivities = activities.filter(
    (activity) => selectedCategory === "All" || activity.allCategories.includes(selectedCategory),
  )

  // Emojis for known categories, can be expanded
  const categoryEmojis: { [key: string]: string } = {
    Nature: "🏞️",
    Food: "🍜",
    Culture: "🛕",
    Activities: "🛶",
    Speedboat: "🚤",
    Sightseeing: "👀",
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-emerald-50 flex justify-center items-center">
        <p className="text-xl text-gray-700">Loading activities...</p>
        {/* Consider adding a spinner component here */}
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-emerald-50 flex justify-center items-center">
        <p className="text-xl text-red-600">Error loading activities: {error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 font-poppins">Activities & Tours</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover exciting activities and guided tours to make the most of your Phuket experience
          </p>
        </div>

        {/* Category Filters */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="w-full"> {/* Removed grid-cols-5 for better responsiveness with dynamic categories */}
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="text-sm">
                {categoryEmojis[category] && `${categoryEmojis[category]} `}
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Activities Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredActivities.map((activity) => (
            <Card key={activity.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="md:flex">
                <div className="md:w-1/3 relative">
                  <img src={activity.image} alt="Image" className="w-full h-48 md:h-full object-cover" />
                  <Badge className="absolute top-4 left-4 bg-emerald-500">{activity.primaryCategory}</Badge>
                  <div className="absolute bottom-4 left-4 flex items-center bg-white/90 rounded-full px-2 py-1">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-semibold">{activity.rating}</span>
                  </div>
                </div>

                <div className="md:w-2/3 p-6">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-xl mb-2">{activity.title}</CardTitle>
                    <CardDescription className="text-base">{activity.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="p-0 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {activity.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {activity.duration}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        {activity.displayPrice}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        {activity.groupSize}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Includes:</h4>
                      <div className="flex flex-wrap gap-1">
                        {activity.includes.map((item) => (
                          <Badge key={item} variant="outline" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4"> {/* Adjusted alignment as 'Best Time' is removed */}
                      <div className="flex gap-2">
                        <a href={`${activity.maps}`}>
                          <Button className="bg-orange-500 hover:bg-orange-600">Details</Button>
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredActivities.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Activities Found</h2>
            <p className="text-gray-500">
              Try selecting a different category or check back later for new activities.
            </p>
          </div>
        )}

        {/* Booking Information */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Booking Information</CardTitle>
            <CardDescription>Important details for booking activities in  Phuket</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Advance Booking</h4>
                <p className="text-sm text-gray-600">
                  Book 1-3 days in advance during peak season (Nov-Apr). Same-day booking often available during low
                  season.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Cancellation Policy</h4>
                <p className="text-sm text-gray-600">
                  Most tours offer free cancellation 24 hours before the activity. Weather-related cancellations are
                  fully refundable.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">What to Bring</h4>
                <p className="text-sm text-gray-600">
                  Comfortable shoes, sun protection, insect repellent, and a waterproof bag for water activities.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
