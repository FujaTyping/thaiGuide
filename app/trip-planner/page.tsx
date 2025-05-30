/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Clock, DollarSign, Users, Star, Plus, Trash2 } from "lucide-react"

interface Activity {
  id: number
  name: string
  category: string
  duration: string
  cost: string // e.g., "$$"
  rating: number
  image: string
  description: string
  tags: string[]
  bestFor: string[]
  timeNeeded: number
  price?: string // Optional: as per API data, e.g., "1,500–3,000 THB"
}

export default function TripPlannerPage() {
  const [selectedActivities, setSelectedActivities] = useState<number[]>([])
  const [tripDuration, setTripDuration] = useState("")
  const [groupSize, setGroupSize] = useState("")
  const [budget, setBudget] = useState("")
  const [interests, setInterests] = useState<string[]>([])
  const [allActivities, setAllActivities] = useState<Activity[]>([])
  const [isLoadingActivities, setIsLoadingActivities] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const interestOptions = ["Adventure", "Culture", "Food", "Nature", "Relaxing", "Photography", "Learning"]

  useEffect(() => {
    const fetchActivitiesData = async () => {
      setIsLoadingActivities(true)
      setFetchError(null)
      try {
        const response = await fetch("https://script.google.com/macros/s/AKfycby6QfIZQ5vybUKjXTS_f8SopLxHKH5mJQutGzUx_9gNrOVhO8zmhI3iGaYJNh6kIN2Gyg/exec")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()

        // Assuming the API returns an array of activity objects
        const transformedActivities: Activity[] = data.map((item: any) => ({
          id: Number(item.id),
          name: String(item.name),
          category: String(item.category),
          duration: String(item.duration),
          cost: String(item.cost),
          rating: Number(item.rating),
          image: String(item.image),
          description: String(item.description),
          tags: typeof item.tags === 'string' ? item.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : [],
          bestFor: typeof item.bestFor === 'string' ? item.bestFor.split(',').map((bf: string) => bf.trim()).filter(Boolean) : [],
          timeNeeded: Number(item.timeNeeded),
          price: item.price ? String(item.price) : undefined,
        }))
        setAllActivities(transformedActivities)
      } catch (error) {
        console.error("Failed to fetch activities:", error)
        setFetchError(error instanceof Error ? error.message : "An unknown error occurred while fetching activities.")
      } finally {
        setIsLoadingActivities(false)
      }
    }

    fetchActivitiesData()
  }, [])

  const handleActivityToggle = (activityId: number) => {
    setSelectedActivities((prev) =>
      prev.includes(activityId) ? prev.filter((id) => id !== activityId) : [...prev, activityId],
    )
  }

  const handleInterestToggle = (interest: string) => {
    setInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]))
  }

  const getFilteredActivities = () => {
    return allActivities.filter((activity) => {
      // Interest (Tags) Filter
      let matchesInterests = true
      if (interests.length > 0) {
        matchesInterests = activity.tags.some((tag) => interests.includes(tag))
      }

      // Group Size (Best For) Filter
      let matchesGroupSize = true
      if (groupSize) {
        // groupSize state is like "solo", "couple" (lowercase)
        // activity.bestFor is an array like ["Solo", "Couple", "Family"] (can be mixed case from API)
        matchesGroupSize = activity.bestFor.some(
          (bf) => bf.toLowerCase() === groupSize.toLowerCase(),
        )
      }

      // Budget Filter
      let matchesBudget = true
      if (budget) {
        // budget state is "budget", "moderate", "luxury"
        // activity.cost is expected to be "$", "$$", "$$$"
        const budgetMap: { [key: string]: string } = {
          budget: "$",
          moderate: "$$",
          luxury: "$$$",
        }
        if (budgetMap[budget]) {
          matchesBudget = activity.cost === budgetMap[budget]
        } else {
          matchesBudget = false // Or handle as per desired logic if budget value is unexpected
        }
      }

      // Trip Duration Filter
      // Filters out activities that are individually too long for the selected total trip duration.
      let matchesTripDuration = true
      if (tripDuration && tripDuration !== "7+") { // "7+" implies no upper limit for this filter
        const activityHours = activity.timeNeeded // in hours
        let maxTotalTripHoursForActivity = Infinity

        // Assuming 8 activity hours per day for the trip
        if (tripDuration === "1-2") maxTotalTripHoursForActivity = 2 * 8 // 16 hours
        else if (tripDuration === "3-4") maxTotalTripHoursForActivity = 4 * 8 // 32 hours
        else if (tripDuration === "5-7") maxTotalTripHoursForActivity = 7 * 8 // 56 hours

        if (activityHours > maxTotalTripHoursForActivity) {
          matchesTripDuration = false
        }
      }

      return matchesInterests && matchesGroupSize && matchesBudget && matchesTripDuration
    })
  }

  const getTotalTime = () => {
    return selectedActivities.reduce((total, activityId) => {
      const activity = allActivities.find((a) => a.id === activityId)
      return total + (activity?.timeNeeded || 0)
    }, 0)
  }

  const getEstimatedDays = () => {
    const totalHours = getTotalTime()
    return Math.ceil(totalHours / 8) // Assuming 8 hours of activities per day
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 font-poppins">Trip Planner</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create your perfect Phuket itinerary with personalized recommendations
          </p>
        </div>

        <Tabs defaultValue="preferences" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preferences">1. Preferences</TabsTrigger>
            <TabsTrigger value="activities">2. Select Activities</TabsTrigger>
            <TabsTrigger value="itinerary">3. Your Itinerary</TabsTrigger>
          </TabsList>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Tell us about your trip</CardTitle>
                <CardDescription>Help us recommend the best activities for you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Trip Duration</Label>
                    <Select value={tripDuration} onValueChange={setTripDuration}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2">1-2 Days</SelectItem>
                        <SelectItem value="3-4">3-4 Days</SelectItem>
                        <SelectItem value="5-7">5-7 Days</SelectItem>
                        <SelectItem value="7+">More than a week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="group">Group Type</Label>
                    <Select value={groupSize} onValueChange={setGroupSize}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select group type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solo">Solo Traveler</SelectItem>
                        <SelectItem value="couple">Couple</SelectItem>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="friends">Friends</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Range</Label>
                    <Select value={budget} onValueChange={setBudget}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="budget">Budget ($)</SelectItem>
                        <SelectItem value="moderate">Moderate ($$)</SelectItem>
                        <SelectItem value="luxury">Luxury ($$$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>What interests you? (Select all that apply)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {interestOptions.map((interest) => (
                      <div key={interest} className="flex items-center space-x-2">
                        <Checkbox
                          id={interest}
                          checked={interests.includes(interest)}
                          onCheckedChange={() => handleInterestToggle(interest)}
                        />
                        <Label htmlFor={interest} className="text-sm">
                          {interest}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Recommended Activities</CardTitle>
                <CardDescription>Based on your preferences, here are activities perfect for your trip</CardDescription>
              </CardHeader>
            </Card>

            {isLoadingActivities && <p className="text-center py-4">Loading activities...</p>}
            {fetchError && <p className="text-center py-4 text-red-500">Error: {fetchError}</p>}
            {!isLoadingActivities && !fetchError && (
              <>
                {getFilteredActivities().length === 0 && allActivities.length > 0 && (
                  <p className="text-center py-4 text-gray-500">
                    No activities match your current filters. Try adjusting your interests.
                  </p>
                )}
                {allActivities.length === 0 && !fetchError && (
                  <p className="text-center py-4 text-gray-500">
                    No activities available at the moment. Please check back later.
                  </p>
                )}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredActivities().map((activity) => (
                    <Card
                      key={activity.id}
                      className={`overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer ${selectedActivities.includes(activity.id) ? "ring-2 ring-emerald-500 bg-emerald-50" : ""
                        }`}
                      onClick={() => handleActivityToggle(activity.id)}
                    >
                      <div className="relative">
                        <img src={activity.image} alt="Banner" className="w-full h-48 object-cover" />
                        <Badge className="absolute top-4 left-4 bg-emerald-500">{activity.category}</Badge>
                        <div className="absolute top-4 right-4 bg-white/90 rounded-full p-2">
                          {selectedActivities.includes(activity.id) ? (
                            <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                          ) : (
                            <Plus className="w-4 h-4 text-gray-600" />
                          )}
                        </div>
                        <div className="absolute bottom-4 left-4 flex items-center bg-white/90 rounded-full px-2 py-1">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-semibold">{activity.rating}</span>
                        </div>
                      </div>

                      <CardHeader>
                        <CardTitle className="text-lg">{activity.name}</CardTitle>
                        <CardDescription>{activity.description}</CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm text-gray-600">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {activity.duration}
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              {activity.cost}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {activity.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="h-4 w-4 mr-1" />
                            Best for: {activity.bestFor.join(", ")}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* Itinerary Tab */}
          <TabsContent value="itinerary">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Custom Itinerary</CardTitle>
                    <CardDescription>
                      {selectedActivities.length} activities selected • Estimated {getEstimatedDays()} days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedActivities.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No activities selected yet. Go back to add some activities to your trip!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedActivities.map((activityId, index) => {
                          const activity = allActivities.find((a) => a.id === activityId)
                          if (!activity) return null

                          return (
                            <div key={activityId} className="flex items-center gap-4 p-4 border rounded-lg bg-white">
                              <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 font-semibold">
                                {index + 1}
                              </div>
                              <img src={activity.image} alt="Banner" className="w-20 h-15 object-cover rounded" />
                              <div className="flex-1">
                                <h4 className="font-semibold">{activity.name}</h4>
                                <p className="text-sm text-gray-600">{activity.description}</p>
                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                  <span className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {activity.duration}
                                  </span>
                                  <span className="flex items-center">
                                    <DollarSign className="h-3 w-3 mr-1" />
                                    {activity.cost}
                                  </span>
                                </div>
                              </div>
                              <Button variant="outline" size="icon" onClick={() => handleActivityToggle(activityId)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Trip Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Activities</span>
                      <span className="font-semibold">{selectedActivities.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Time</span>
                      <span className="font-semibold">{getTotalTime()} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recommended Days</span>
                      <span className="font-semibold">{getEstimatedDays()} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Trip Type</span>
                      <span className="font-semibold capitalize">{groupSize || "Not set"}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Travel Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                      <p>Best time to visit is November to April for cooler weather</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                      <p>Book accommodations in advance during peak season</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                      <p>Rent a scooter or car for easier transportation between sites</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                      <p>Try local street food but choose busy stalls for freshness</p>
                    </div>
                  </CardContent>
                </Card>

                {selectedActivities.length > 0 && (
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                    <Calendar className="mr-2 h-4 w-4" />
                    Save Itinerary
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
