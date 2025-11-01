// ============================================================================
// AssetFlowX - Course Management Page (My Course)
// View Enrolled course
// ============================================================================

"use client"

import { PageHeading } from '@/components/ui/page-heading';
import { Input } from "@/components/ui/input"
import React, { useState } from 'react';
import { Search, BookOpen, CircleCheckBig, TrendingUp, Clock, StarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const allCourseOpt = [
    {
        opt:"All Courses",
        count:8
    },
    {
        opt:"In Progress",
        count:2
    },
    {
        opt:"Completed",
        count:5
    },
    {
        opt:"Not Started",
        count:1
    }
]

const allCourseEnrolled = [
    {
        course:"Web 3 Fundamental",
        icon: "🌐",
        duration:"6h 45min",
        rate:4.9,
        action:"Review",
        percent:100
    },
    {
        course:"Advanced Solidity",
        icon: "💎",
        duration:"10h 40min",
        rate:4.7,
        action:"Review",
        percent:100
    },
    {
        course:"DeFi Mastery",
        icon: "📈",
        duration:"5h 15min",
        rate:4.5,
        action:"Review",
        percent:100
    },
    {
        course:"NFT Art and Marketplaces",
        icon: "🎨",
        duration:"9h 10min",
        rate:4.3,
        action:"Review",
        percent:100
    },
    {
        course:"DAO Governance",
        icon: "🏛️",
        duration:"3h 45min",
        rate:4.0,
        action:"Review",
        percent:100
    },
    {
        course:"UI/UX Fundamentals",
        icon: "✨",
        duration:"7h 12min",
        rate:4.8,
        action:"Continue",
        percent:90
    },
    {
        course:"Digital Marketing",
        icon: "📱",
        duration:"2h 50min",
        rate:4.2,
        action:"Continue",
        percent:75
    },
    {
        course:"Cloud Fundamentals",
        icon: "☁️",
        duration:"12h 10min",
        rate:4.6,
        action:"Start",
        percent:0
    }
]

export default function myCourse(){
    const [displayTitle, setTitle] = useState("All Courses")
    const [searchTerm, setSearchTerm] = useState("")

    const filteredCourses = allCourseEnrolled.filter((course) => {
        
        let matchCourse = false;
        if (displayTitle === "All Courses") {
            matchCourse = true; 
        }
        
        else if (displayTitle === "In Progress") {
            matchCourse = course.action === "Continue";
        }
       
        else if (displayTitle === "Completed") {
            matchCourse =  course.action === "Review";
        }
        
        else if (displayTitle === "Not Started") {
            matchCourse = course.action === "Start"; 
        }
        
        let matchSearch = true;
        if (searchTerm !== ""){
            matchSearch = course.course.toLowerCase().includes(searchTerm.toLowerCase());
        }

        return matchCourse && matchSearch;
        
    });

    return (
        <main>
            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex md:flex-wrap justify-between items-center">
                    <PageHeading
                    title="My Courses"
                    description="Track your learning progress and continue your educational journey" />

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                        id="mycourse"
                        placeholder="Search courses..."
                        className="pl-9"
                        onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                </div>
            </div>

            {/* Course Dashboard */}
            <div className="max-w-7xl mx-auto px-6 py-8 ">
                <div className="grid grid-flow-row grid-cols-3 gap-7">
                    {/* Courses Enrolled */}
                    <div className="flex justify-between rounded-lg shadow-xl dark:shadow-purple-500/15 p-7 gap-x-5 border-1">
                        <div>
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                                <BookOpen className="text-white" size={24} />
                            </div>
                            <p className="font-bold text-3xl">8</p>
                            <p className="text-sm">Courses Enrolled</p>
                        </div>
                        <div>
                            <div className="w-2 h-2 rounded-2xl bg-green-400 my-3"></div>
                            <p className="text-xs text-gray-500">Active</p>
                        </div>
                    </div>

                    {/* Courses Completed */}
                    <div className="flex justify-between rounded-lg shadow-xl dark:shadow-purple-500/15 p-7 gap-x-5 border-1">
                        <div>
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mb-4">
                                <CircleCheckBig className="text-white" size={24} />
                            </div>
                            <p className="font-bold text-3xl">5</p>
                            <p className="text-sm">Courses Completed</p>
                        </div>
                        <div>
                            <div className="w-2 h-2 rounded-2xl bg-green-400 my-3"></div>
                            <p className="text-xs text-gray-500">Active</p>
                        </div>
                    </div>

                    {/* In Progress */}
                    <div className="flex justify-between rounded-lg shadow-xl dark:shadow-purple-500/15 p-7 gap-x-5 border-1">
                        <div>
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                                <TrendingUp className="text-white" size={24} />
                            </div>
                            <p className="font-bold text-3xl">3</p>
                            <p className="text-sm">In Progress</p>
                        </div>
                        <div>
                            <div className="w-2 h-2 rounded-2xl bg-green-400 my-3"></div>
                            <p className="text-xs text-gray-500">Active</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Button Option */}
            <div className="flex my-auto mx-7 gap-7">
                {allCourseOpt.map((option) => (
                        <Button 
                        key={option.opt}
                        variant={displayTitle===option.opt? "default":"outline"}
                        className="rounded-3xl dark:hover:bg-zinc-400"
                        onClick={() => setTitle(option.opt)}>
                            {`${option.opt} (${option.count})`}
                        </Button>
                )) }
            </div>

            {/* Course Display */}
            <div className="my-10 mx-9">
                <h1 className="font-bold">{displayTitle}</h1>

                <div className="my-5">
                    <div>
                        {filteredCourses.map((allCourse) => (
                            <div key={allCourse.course} className="p-5 my-5 flex justify-between border-2 rounded-xl shadow-xl dark:shadow-purple-500/15 dark:hover:">
                                <div className="flex gap-5">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center text-3xl shadow-md">
                                        {allCourse.icon}
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-xl">{allCourse.course}</h2>
                                        <div className="flex gap-5 my-2">
                                            <div className="flex items-center space-x-1">
                                                <Clock className="w-4 h-4 items-center"/>
                                                <span className="text-sm items-center">{allCourse.duration}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span className="text-sm">{allCourse.rate}</span>
                                            </div>
                                        </div>
                                        <div className="w-50 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full transition-all duration-300"style={{ width: `${allCourse.percent}%` }} ></div>
                                            
                                        </div>
                                        <p className="text-sm">{`${allCourse.percent}% complete`}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="mb-2">
                                        <Button variant="outline" className={` ${allCourse.action==="Review"? "bg-green-600" : (allCourse.action==="Start"? "bg-gray-600" : "bg-blue-500")} text-white w-30`}>{allCourse.action}</Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}