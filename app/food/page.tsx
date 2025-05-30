"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Star, MapPin, Clock, DollarSign, Utensils, Coffee } from "lucide-react"

// Define types for clarity
interface Dish {
  id: number
  name: string
  description: string
  image: string
  spiceLevel: string
  price: string
  category: string
  ingredients: string[] // Target type for display
  whereToFind: string
}

interface FetchedDish {
  id: number | string // API might send ID as string or number
  name: string
  description: string
  image: string
  spiceLevel: string
  price: string
  category: string
  ingredients: string // Type from API (comma-separated string)
  whereToFind: string
}

// Define types for Restaurant data
interface Restaurant {
  id: number
  name: string
  type: string
  rating: number
  priceRange: string
  image: string
  description: string
  specialties: string[] // Target type for display
  location: string
  hours: string
  atmosphere: string
  maps: string // URL for the map
}

interface FetchedRestaurant {
  id: number | string // API might send ID as string or number
  name: string
  type: string
  rating: number | string // API might send rating as string or number
  priceRange: string
  image: string
  description: string
  specialties: string // Type from API (comma-separated string)
  location: string
  hours: string
  atmosphere: string
  maps: string // URL for the map
}

export default function FoodGuidePage() {
  const [selectedCategory, setSelectedCategory] = useState("dishes")
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loadingDishes, setLoadingDishes] = useState<boolean>(true)
  const [errorDishes, setErrorDishes] = useState<string | null>(null)
  const DISHES_API_URL =
    "https://script.google.com/macros/s/AKfycbxxd8kjpcMVmDXVHj2Kv77zjCwrtieHnqb-_LJJAeGgY3SqrZKKIiGnMDCSDSMnP1CxRw/exec"

  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loadingRestaurants, setLoadingRestaurants] = useState<boolean>(true)
  const [errorRestaurants, setErrorRestaurants] = useState<string | null>(null)

  const RESTAURANTS_API_URL =
    "https://script.google.com/macros/s/AKfycbw7PgdvkBOvxBFNe7mDQurrUEFDWsy8LCrChAN-t9tDVGxdtgu6BJiAOLkJ088MmErqnA/exec"

  const foodTips = [
    {
      title: "Best Times to Eat",
      content: "Breakfast: 7-9 AM, Lunch: 11 AM-2 PM, Dinner: 6-8 PM. Many street vendors close early.",
    },
    {
      title: "Spice Levels",
      content: "Southern Thai food is typically spicier than other regions. Ask for 'mai pet' (not spicy) if needed.",
    },
    {
      title: "Food Safety",
      content:
        "Choose busy stalls with high turnover. Look for places where locals eat. Avoid raw vegetables if you have a sensitive stomach.",
    },
    {
      title: "Payment",
      content: "Most street vendors accept cash only. Restaurants may accept cards. Typical meal costs 40-150 THB.",
    },
    {
      title: "Dietary Restrictions",
      content: "Vegetarian options available but may contain fish sauce. Say 'gin jay' for strict vegetarian food.",
    },
  ]

  useEffect(() => {
    const fetchDishes = async () => {
      setLoadingDishes(true)
      setErrorDishes(null)
      try {
        const response = await fetch(DISHES_API_URL)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: FetchedDish[] = await response.json()

        const transformedDishes: Dish[] = data.map((item) => ({
          ...item,
          id: Number(item.id), // Ensure id is a number
          image: item.image || "/placeholder.svg", // Fallback image
          ingredients: item.ingredients ? item.ingredients.split(",").map((s) => s.trim()) : [],
        }))
        setDishes(transformedDishes)
      } catch (error) {
        console.error("Failed to fetch dishes:", error)
        setErrorDishes(error instanceof Error ? error.message : "An unknown error occurred while fetching dishes.")
      } finally {
        setLoadingDishes(false)
      }
    }

    fetchDishes()

    const fetchRestaurants = async () => {
      setLoadingRestaurants(true)
      setErrorRestaurants(null)
      try {
        const response = await fetch(RESTAURANTS_API_URL)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: FetchedRestaurant[] = await response.json()

        const transformedRestaurants: Restaurant[] = data.map((item) => ({
          ...item,
          id: Number(item.id),
          rating: Number(item.rating),
          image: item.image || "/placeholder.svg?height=200&width=300", // Fallback image
          specialties: item.specialties ? item.specialties.split(",").map((s) => s.trim()) : [],
        }))
        setRestaurants(transformedRestaurants)
      } catch (error) {
        console.error("Failed to fetch restaurants:", error)
        setErrorRestaurants(
          error instanceof Error ? error.message : "An unknown error occurred while fetching restaurants."
        )
      } finally {
        setLoadingRestaurants(false)
      }
    }
    fetchRestaurants()
  }, []) // Empty dependency array means this effect runs once on mount

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 font-poppins">Food Guide</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the authentic flavors of Southern Thailand with our comprehensive food guide
          </p>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dishes">Local Dishes</TabsTrigger>
            <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
            <TabsTrigger value="tips">Food Tips</TabsTrigger>
          </TabsList>

          {/* Local Dishes Tab */}
          <TabsContent value="dishes">
            {loadingDishes && <p className="text-center text-gray-600">Loading local dishes...</p>}
            {errorDishes && <p className="text-center text-red-600">Error: {errorDishes}</p>}
            {!loadingDishes && !errorDishes && (
              <>
                {dishes.length === 0 ? (
                  <p className="text-center text-gray-600">No local dishes found.</p>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dishes.map((dish) => (
                      <Card key={dish.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                        <div className="relative">
                          <img src={dish.image} alt="Food" className="w-full h-48 object-cover" />
                          <Badge className="absolute top-4 left-4 bg-emerald-500">{dish.category}</Badge>
                          <div className="absolute top-4 right-4 bg-white/90 rounded-full px-2 py-1 text-sm font-semibold">
                            {dish.price}
                          </div>
                        </div>

                        <CardHeader>
                          <CardTitle className="text-xl">{dish.name}</CardTitle>
                          <CardDescription>{dish.description}</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Spice Level:</span>
                            <span>{dish.spiceLevel}</span>
                          </div>

                          <div>
                            <span className="text-sm font-medium">Ingredients:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {dish.ingredients.map((ingredient) => (
                                <Badge key={ingredient} variant="outline" className="text-xs">
                                  {ingredient}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Where to find:</span> {dish.whereToFind}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Restaurants Tab */}
          <TabsContent value="restaurants">
            {loadingRestaurants && <p className="text-center text-gray-600">Loading restaurants...</p>}
            {errorRestaurants && <p className="text-center text-red-600">Error: {errorRestaurants}</p>}
            {!loadingRestaurants && !errorRestaurants && (
              <>
                {restaurants.length === 0 ? (
                  <p className="text-center text-gray-600">No restaurants found.</p>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {restaurants.map((restaurant) => (
                      <Card
                        key={restaurant.id}
                        className="overflow-hidden hover:shadow-lg transition-all duration-300"
                      >
                        <div className="md:flex">
                          <div className="md:w-1/3 relative">
                            <img
                              src={restaurant.image}
                              alt={restaurant.name}
                              className="w-full h-48 md:h-full object-cover"
                            />
                            <Badge className="absolute top-4 left-4 bg-emerald-500">{restaurant.type}</Badge>
                            <div className="absolute bottom-4 left-4 flex items-center bg-white/90 rounded-full px-2 py-1">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              <span className="text-sm font-semibold">{restaurant.rating.toFixed(1)}</span>
                            </div>
                          </div>

                          <div className="md:w-2/3 p-6">
                            <CardHeader className="p-0 mb-4">
                              <CardTitle className="text-xl mb-2">{restaurant.name}</CardTitle>
                              <CardDescription>{restaurant.description}</CardDescription>
                            </CardHeader>

                            <CardContent className="p-0 space-y-3">
                              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  {restaurant.location}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-2" />
                                  {restaurant.hours}
                                </div>
                                <div className="flex items-center">
                                  <DollarSign className="h-4 w-4 mr-2" />
                                  {restaurant.priceRange}
                                </div>
                                <div className="flex items-center">
                                  <Utensils className="h-4 w-4 mr-2" />
                                  {restaurant.atmosphere}
                                </div>
                              </div>

                              <div>
                                <span className="text-sm font-medium">Specialties:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {restaurant.specialties.map((specialty) => (
                                    <Badge key={specialty} variant="outline" className="text-xs">
                                      {specialty}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <a href={`${restaurant.maps}`}>
                                <Button className="w-full bg-orange-500 hover:bg-orange-600 mt-4">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  Get Directions
                                </Button>
                              </a>
                            </CardContent>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Food Tips Tab */}
          <TabsContent value="tips">
            <div className="grid md:grid-cols-2 gap-6">
              {foodTips.map((tip, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        {index === 0 && <Clock className="h-4 w-4 text-emerald-600" />}
                        {index === 1 && <Utensils className="h-4 w-4 text-emerald-600" />}
                        {index === 2 && <Star className="h-4 w-4 text-emerald-600" />}
                        {index === 3 && <DollarSign className="h-4 w-4 text-emerald-600" />}
                        {index === 4 && <Coffee className="h-4 w-4 text-emerald-600" />}
                      </div>
                      {tip.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{tip.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Food Etiquette Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Food Etiquette & Cultural Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Dining Etiquette</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Use a spoon and fork {"(spoon in right hand)"}</li>
                      <li>• Share dishes when eating in groups</li>
                      <li>• Don&apos;t finish everything on your plate</li>
                      <li>• Wait for elders to start eating first</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Useful Phrases</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• &quot;Aroy mak&quot; - Very delicious</li>
                      <li>• &quot;Mai pet&quot; - Not spicy</li>
                      <li>• &quot;Gin jay&quot; - Vegetarian food</li>
                      <li>• &quot;Check bin&quot; - Check please</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
