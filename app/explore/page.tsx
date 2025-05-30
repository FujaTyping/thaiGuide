"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Search, Star, Clock, DollarSign } from "lucide-react"
import Link from "next/link"

// Define the structure of the destination data from the API
interface ApiDestination {
  id: number;
  name: string;
  category: string;
  image: string;
  description: string;
  rating: number;
  duration: string;
  price: string;
  tags: string; // Tags come as a comma-separated string from the API
  maps: string; // URL for the map
}

// Define the structure of the destination data used in the component
interface Destination {
  id: number;
  name: string;
  category: string;
  image: string;
  description: string;
  rating: number;
  duration: string;
  price: string;
  tags: string[]; // Tags will be an array of strings
  maps: string; // URL for the map
}

const API_URL = "https://script.google.com/macros/s/AKfycby6QfIZQ5vybUKjXTS_f8SopLxHKH5mJQutGzUx_9gNrOVhO8zmhI3iGaYJNh6kIN2Gyg/exec";

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = ["All", "Nature", "Food", "Culture", "Activities"]
  // Note: You might want to derive categories dynamically from the fetched data
  // const categories = ["All", ...new Set(destinations.map(d => d.category))];

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(API_URL)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: ApiDestination[] = await response.json()

        // Transform data: split tags string into an array
        const transformedData: Destination[] = data.map(item => ({
          ...item,
          tags: item.tags ? item.tags.split(',').map(tag => tag.trim()) : [],
        }));
        setDestinations(transformedData)
      } catch (e) {
        console.error("Failed to fetch destinations:", e)
        setError(e instanceof Error ? e.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchDestinations()
  }, [])

  const filteredDestinations = destinations.filter((dest) => {
    const matchesCategory = selectedCategory === "All" || dest.category === selectedCategory
    const matchesSearch =
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 font-poppins">Explore Phuket</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing destinations and authentic experiences in the heart of Southern Thailand
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-5 mb-8">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="text-sm">
                  {category === "Nature" && "🏞️"}
                  {category === "Food" && "🍜"}
                  {category === "Culture" && "🛕"}
                  {category === "Activities" && "🛶"}
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Loading destinations...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12 text-red-600">
            <p className="text-xl">Failed to load destinations: {error}</p>
          </div>
        )}

        {/* Destinations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((destination) => (
            <Card
              key={destination.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
            >
              <div className="relative">
                <img src={destination.image} alt="image" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                <Badge className="absolute top-4 left-4 bg-emerald-500">{destination.category}</Badge>
                <div className="absolute bottom-4 left-4 flex items-center bg-white/90 rounded-full px-2 py-1">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-semibold">{destination.rating}</span>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl">{destination.name}</CardTitle>
                <CardDescription>{destination.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {destination.duration}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {destination.price}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {destination.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="pt-2">
                    <Link href={`${destination.maps}`}>
                      <Button className="w-full bg-orange-500 hover:bg-orange-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!loading && !error && filteredDestinations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No destinations found matching your criteria.</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All")
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
