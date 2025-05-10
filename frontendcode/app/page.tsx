"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Static data to simulate database content
const subjectsData = [
  {
    id: 1,
    name: "Mathematics",
    tasks: [
      { id: 1, title: "Complete Calculus Assignment", deadline: "2025-05-15", priority: "high" },
      { id: 2, title: "Study for Algebra Test", deadline: "2025-05-20", priority: "medium" },
      { id: 3, title: "Submit Geometry Project", deadline: "2025-05-25", priority: "high" },
    ],
  },
  {
    id: 2,
    name: "Physics",
    tasks: [
      { id: 4, title: "Lab Report on Mechanics", deadline: "2025-05-12", priority: "high" },
      { id: 5, title: "Read Chapter 7 on Thermodynamics", deadline: "2025-05-18", priority: "low" },
      { id: 6, title: "Group Project on Electromagnetism", deadline: "2025-05-30", priority: "medium" },
    ],
  },
  {
    id: 3,
    name: "Computer Science",
    tasks: [
      { id: 7, title: "Programming Assignment in Python", deadline: "2025-05-14", priority: "high" },
      { id: 8, title: "Database Design Project", deadline: "2025-05-22", priority: "medium" },
      { id: 9, title: "Algorithm Analysis Paper", deadline: "2025-05-28", priority: "high" },
    ],
  },
  {
    id: 4,
    name: "History",
    tasks: [
      { id: 10, title: "Research Paper on Ancient Civilizations", deadline: "2025-05-16", priority: "medium" },
      { id: 11, title: "Timeline Project on World War II", deadline: "2025-05-23", priority: "high" },
      { id: 12, title: "Read Chapters 10-12 on Renaissance", deadline: "2025-05-19", priority: "low" },
    ],
  },
  {
    id: 5,
    name: "English",
    tasks: [
      { id: 13, title: "Essay on Shakespeare", deadline: "2025-05-17", priority: "high" },
      { id: 14, title: "Book Report on 'To Kill a Mockingbird'", deadline: "2025-05-24", priority: "medium" },
      { id: 15, title: "Grammar Exercises", deadline: "2025-05-13", priority: "low" },
    ],
  },
]

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<(typeof subjectsData)[0] | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setHasSearched(true)

    if (!searchQuery.trim()) {
      setSearchResults(null)
      return
    }

 
 try {
    const res = await fetch(`http://localhost:5000/api/subjects?name=${encodeURIComponent(searchQuery)}`)
    const data = await res.json()
    setSearchResults(data || null)
  } catch (error) {
    console.error("Error fetching data:", error)
    setSearchResults(null)
  } finally {
    
  }


  }

  // Function to format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Function to determine if a deadline is approaching (within 7 days)
  const isDeadlineApproaching = (dateString: string) => {
    const deadline = new Date(dateString)
    const today = new Date()
    const diffTime = deadline.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays >= 0
  }

  // Function to get badge color based on priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "warning"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="w-full max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Subject Task Tracker</h1>

        <form onSubmit={handleSearch} className="flex w-full mb-8 gap-2">
          <Input
            type="text"
            placeholder="Enter a subject (e.g., Mathematics, Physics, Computer Science)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>

        {hasSearched && !searchResults && (
          <Alert className="mb-6">
            <AlertTitle>No results found</AlertTitle>
            <AlertDescription>No tasks found for "{searchQuery}". Try searching for another subject.</AlertDescription>
          </Alert>
        )}

        {searchResults && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>{searchResults.name}</CardTitle>
              <CardDescription>{searchResults.tasks.length} tasks found</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {searchResults.tasks.map((task) => (
                  <Card key={task.id} className="overflow-hidden">
                    <div className={`p-4 ${isDeadlineApproaching(task.deadline) ? "border-l-4 border-red-500" : ""}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{task.title}</h3>
                        <Badge variant={getPriorityColor(task.priority) as any}>{task.priority}</Badge>
                      </div>
                      <p
                        className={`text-sm ${isDeadlineApproaching(task.deadline) ? "text-red-500 font-medium" : "text-gray-500"}`}
                      >
                        Due: {formatDate(task.deadline)}
                        {isDeadlineApproaching(task.deadline) && " (Approaching)"}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
