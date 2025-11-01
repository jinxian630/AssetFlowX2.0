// ============================================================================
// AssetFlowX - Course Management Page (Marketplace)
// View all course
// ============================================================================

"use client";
import React, { useState, useMemo } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { BadgeDollarSign, Eye, ListFilter, Search, StarIcon } from 'lucide-react';
import { PageHeading } from '@/components/ui/page-heading';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto min-h-screen bg-background font-sans">
        {children}
    </div>
  );
}

interface Category {
  name: string;
  count: number;
}

type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

interface Course {
  id: number;
  title: string;
  instructor: string;
  rating: number;
  students: number;
  durationWeeks: number;
  level: CourseLevel;
  icon: string;
  category: string;
  price: number;
  description: string;
}

const CATEGORIES: Category[] = [
  { name: 'All Courses', count: 16 },
  { name: 'Design', count: 4 },
  { name: 'Programming', count: 3 },
  { name: 'Business', count: 4 },
  { name: 'Language', count: 1 },
  { name: 'Science', count: 1 },
  { name: 'Technology', count: 2 },
  { name: 'Multimedia', count: 1 },
];

const COURSES: Course[] = [
  { id: 1, title: 'Advanced UI/UX Design', instructor: 'Sarah Johnson', rating: 4.8, students: 1200, durationWeeks: 8, level: 'Advanced', icon: '🎨', category: 'Design', price: 250, description: 'Master advanced interface and interaction design, prototyping, user research, accessibility, and design systems to deliver polished products.' },
  { id: 2, title: 'JavaScript Mastery', instructor: 'Michael Chen', rating: 4.9, students: 2500, durationWeeks: 12, level: 'Intermediate', icon: '⚡', category: 'Programming', price: 300, description: 'Deep dive into modern JavaScript (ES6+), asynchronous patterns, modules, tooling, and best practices for building scalable web apps.' },
  { id: 3, title: 'Digital Marketing Pro', instructor: 'Emma Davis', rating: 4.7, students: 950, durationWeeks: 6, level: 'Beginner', icon: '📱', category: 'Business', price: 375, description: 'Practical introduction to digital marketing: SEO, paid ads, social media, email campaigns, and analytics to grow brands online.' },
  { id: 4, title: 'Spanish Fluency', instructor: 'Carlos Rodriguez', rating: 4.6, students: 1800, durationWeeks: 10, level: 'Intermediate', icon: '🇪🇸', category: 'Language', price: 80, description: 'Build conversational fluency with focused practice in speaking, listening, grammar, and real-world vocabulary for everyday situations.' },
  { id: 5, title: 'Data Science Basics', instructor: 'Dr. Lisa Wang', rating: 4.8, students: 750, durationWeeks: 14, level: 'Advanced', icon: '📊', category: 'Science', price: 98, description: 'Foundational data science: statistics, data cleaning, visualization, and an introduction to machine learning with hands-on projects.' },
  { id: 6, title: 'Fundamental of AI', instructor: 'Alex Turner', rating: 4.5, students: 1400, durationWeeks: 5, level: 'Beginner', icon: '🤖', category: 'Technology', price: 202, description: 'Introductory AI course covering core concepts, basic ML models, datasets, and ethical considerations—designed for beginners without heavy math.' },
  { id: 7, title: 'Video Editing', instructor: 'Nelson Tan', rating: 4.5, students: 1400, durationWeeks: 5, level: 'Beginner', icon: '🎬', category: 'Multimedia', price: 98, description: 'Hands-on video editing: storytelling, timeline workflow, cuts, transitions, basic color correction, and exporting for web and social platforms.' },
  { id: 8, title: 'Photography Essentials', instructor: 'Prof. Jason', rating: 4.5, students: 1400, durationWeeks: 5, level: 'Beginner', icon: '📷', category: 'Design', price: 108, description: 'Learn camera settings, composition, lighting techniques, and basic post-processing to take and edit striking photographs.' },
  { id: 9, title: 'Web 3 Fundamental', instructor: 'Olivia Martinez', rating: 4.9, students: 1500, durationWeeks: 6, level: 'Beginner', icon: '🌐', category: 'Programming', price: 99, description: 'An introductory course on the core concepts of Web 3.0, including blockchain, dApps, and decentralization.' },
  { id: 10, title: 'Advanced Solidity', instructor: 'Ethan Brooks',  rating: 4.7, students: 1200, durationWeeks: 10, level: 'Advanced', icon: '💎', category: 'Programming', price: 199, description: 'A deep dive into advanced Solidity patterns, security, and optimization for smart contract development.' },
  { id: 11, title: 'DeFi Mastery', instructor: 'Sofia Lim', rating: 4.5, students: 900, durationWeeks: 8, level: 'Intermediate', icon: '📈', category: 'Business', price: 299, description: 'Explore the world of Decentralized Finance (DeFi), including lending, borrowing, and yield farming protocols.' },
  { id: 12, title: 'NFT Art and Marketplaces', instructor: 'Daniel Walker', rating: 4.3, students: 1100, durationWeeks: 5, level: 'Beginner', icon: '🎨', category: 'Design', price: 149, description: 'Learn how to create, mint, and sell digital art as NFTs on various marketplace platforms.' },
  { id: 13, title: 'DAO Governance', instructor: 'Ava Thompson', rating: 4.0, students: 700, durationWeeks: 4, level: 'Intermediate', icon: '🏛️', category: 'Business', price: 179, description: 'Understand the structures, voting mechanisms, and operational frameworks of Decentralized Autonomous Organizations (DAOs).' },
  { id: 14, title: 'UI/UX Fundamentals', instructor: 'Ryan Kim', rating: 4.8, students: 2200, durationWeeks: 6, level: 'Beginner', icon: '✨', category: 'Design', price: 115, description: 'A foundational course on user interface and user experience design principles for web and mobile applications.' },
  { id: 15, title: 'Digital Marketing', instructor: 'Chloe Anderson', rating: 4.2, students: 950, durationWeeks: 5, level: 'Beginner', icon: '📱', category: 'Business', price: 180, description: 'Learn the basics of online marketing, from social media and SEO to email campaigns and content strategy.' },
  { id: 16, title: 'Cloud Fundamentals', instructor: 'Benjamin Lee', rating: 4.6, students: 1800, durationWeeks: 8, level: 'Beginner', icon: '☁️', category: 'Technology', price: 100, description: 'An introduction to cloud computing concepts, services, and providers like AWS, Azure, and Google Cloud.' }
];

const CourseBadge: React.FC<{ level: CourseLevel }> = ({ level }) => {
    const levelConfig = {
        Beginner: 'bg-green-100 text-green-800 border-green-200',
        Intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        Advanced: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold whitespace-nowrap ${levelConfig[level]}`}>
            {level}
        </span>
    );
};


const CourseCard: React.FC<{ course: Course }> = ({ course }) => {

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 flex flex-col">
      <CardContent className="p-6 flex-1 flex flex-col">

        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center text-3xl shadow-md">
            {course.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-extrabold text-foreground mb-0.5">{course.title}</h3>
            <p className="text-sm text-muted-foreground">{course.instructor}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-y-2 mb-4 border-b pb-4 border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1 font-semibold">
              <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span>{course.rating.toFixed(1)}</span>
            </div>
            <span>•</span>
            <span className="hidden sm:inline whitespace-nowrap">{course.students} students</span>
            <span>•</span>
            <span className="whitespace-nowrap">{course.durationWeeks} weeks</span>
          </div>
          <CourseBadge level={course.level} />
        </div>

        <div className="flex items-center justify-between mt-auto">

          <div className="flex items-center space-x-1">
            <BadgeDollarSign className="text-yellow-500" />
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{course.price}</span>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-2"
              >
                <Eye className="mr-2 h-4 w-4" />
                <span>View</span>
              </Button>
            </PopoverTrigger>

            {/* Styled PopoverContent */}
            <PopoverContent className="w-80 bg-background shadow-lg border">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">
                    {course.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {course.description}
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
};


interface FilterState {
    level: CourseLevel | 'All';
    priceRange: [number, number];
}

interface FilterSheetProps {
    filterState: FilterState;
    setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
    setIsFilterOpen: (open: boolean) => void;
}

const FilterSheet: React.FC<FilterSheetProps> = ({ filterState, setFilterState, setIsFilterOpen }) => {
    
    const [localLevel, setLocalLevel] = useState(filterState.level);
    const [localPriceRange, setLocalPriceRange] = useState(filterState.priceRange);

    React.useEffect(() => {
        setLocalLevel(filterState.level);
        setLocalPriceRange(filterState.priceRange);
    }, [filterState]);


    const applyFilters = () => {
        setFilterState({
            level: localLevel,
            priceRange: localPriceRange,
        });
        setIsFilterOpen(false);
    };

    const resetFilters = () => {
        setLocalLevel('All');
        setLocalPriceRange([0, 1000]);
        setFilterState({
            level: 'All',
            priceRange: [0, 1000],
        });
        setIsFilterOpen(false);
    };

    return (
        <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
                <SheetTitle>Filter Courses</SheetTitle>
                <SheetDescription>
                    Narrow down the course results by level and price.
                </SheetDescription>
            </SheetHeader>
            <div className="grid gap-6 py-4">
                
                {/* Level Filter */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Course Level</label>
                    <div className="flex flex-wrap gap-2">
                        {['All', 'Beginner', 'Intermediate', 'Advanced'].map(level => (
                            <Button
                                key={level}
                                variant={localLevel === level ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setLocalLevel(level as CourseLevel | 'All')}
                            >
                                {level}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Price Range (NFT Points)</label>
                    <div className='flex items-center space-x-3'>
                        <Input
                            type="number"
                            min={0}
                            max={1000}
                            value={localPriceRange[0]}
                            onChange={(e) => setLocalPriceRange([Number(e.target.value), localPriceRange[1]])}
                            placeholder="Min"
                        />
                        <span className="text-muted-foreground">to</span>
                        <Input
                            type="number"
                            min={0}
                            max={1000}
                            value={localPriceRange[1]}
                            onChange={(e) => setLocalPriceRange([localPriceRange[0], Number(e.target.value)])}
                            placeholder="Max"
                        />
                    </div>
                </div>

            </div>
            <SheetFooter>
                <Button 
                    variant="secondary" 
                    onClick={resetFilters}
                    className="w-full sm:w-auto"
                >
                    Reset Filters
                </Button>
                <Button 
                    variant="default" 
                    onClick={applyFilters}
                    className="w-full sm:w-auto"
                >
                    Apply Filters
                </Button>
            </SheetFooter>
        </SheetContent>
    );
}


export default function App() {
  const [activeCategory, setActiveCategory] = useState<string>('All Courses');
  const [searchText, setSearchText] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterState, setFilterState] = useState<FilterState>({
    level: 'All',
    priceRange: [0, 1000],
  });
  
  const filteredCourses = useMemo(() => {
    let courses = COURSES;

    if (activeCategory !== 'All Courses') {
      courses = courses.filter(c => c.category === activeCategory);
    }

    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      courses = courses.filter(c =>
        c.title.toLowerCase().includes(lowerSearch) ||
        c.instructor.toLowerCase().includes(lowerSearch)
      );
    }

    if (filterState.level !== 'All') {
        courses = courses.filter(c => c.level === filterState.level);
    }

    courses = courses.filter(c => 
        c.price >= filterState.priceRange[0] && c.price <= filterState.priceRange[1]
    );


    return courses;
  }, [activeCategory, searchText, filterState]);


  return (
    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <DashboardShell>
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            {/* Title */}
            <PageHeading
            title="Marketplace"
            description="Discover different courses"/>
          </div>
        </header>


        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">

            {/* Categories Filter */}
            <Card className='p-6'>
              <h3 className="text-xl font-bold text-foreground mb-4">Categories</h3>
              <div className="space-y-2">
                {CATEGORIES.map((category) => (
                  <Button
                    key={category.name}
                    variant={activeCategory === category.name ? 'default' : 'ghost'}
                    className={`w-full justify-between px-4 py-3 h-auto`}
                    onClick={() => setActiveCategory(category.name)}
                  >
                    <span className='font-medium'>{category.name}</span>
                    <span className="text-sm opacity-75">{category.count}</span>
                  </Button>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-3">
            
            {/* Search and Filter Bar */}
            <Card className='p-6 mb-8'>
              <div className="flex items-center space-x-4">

                <div className="relative flex-1">
                  {/* Search Icon SVG */}
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search courses..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl focus:ring-indigo-500"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
                
                <SheetTrigger asChild>
                  <Button
                      variant="outline"
                      size="default"
                      className="shadow-sm" 
                  >
                      {/* Filter Icon SVG */}
                      <ListFilter/>
                      <span className='hidden sm:inline'>Filter</span>
                  </Button>
                </SheetTrigger>
              </div>
            </Card>

            {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
                </div>
            ) : (
                <Card className="text-center p-10 shadow-lg">
                    <p className="text-xl font-semibold text-foreground">No courses found matching your criteria.</p>
                    <p className="text-muted-foreground mt-2">Try adjusting your search term or selecting 'All Courses'.</p>
                </Card>
            )}
          </div>
        </div>
        
        <FilterSheet 
          filterState={filterState} 
          setFilterState={setFilterState} 
          setIsFilterOpen={setIsFilterOpen} 
        />
        
      </DashboardShell>
    </Sheet>
  );
}

