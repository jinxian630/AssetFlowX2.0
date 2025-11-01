// ============================================================================
// AssetFlowX - Course Management Page
// View and delete course
// ============================================================================

"use client"

import { useState, FormEvent, useEffect, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {TooltipProvider} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner"
import { Edit, Trash2, MoreHorizontal, PlusCircle } from "lucide-react"
import { PageHeading } from "@/components/ui/page-heading"

// --- Define the Course type ---
interface Course {
  id: string;
  title: string;
  description: string;
  price: string;
  stdEnroll: string,
  stdFinish: string,
  stdCompleteTask: string,
  stdPass: string,
  stdFail: string
}

const initialCourses: Course[] = [
  {
    id:"1",
    title:"Web 3 Fundamental",
    description:"This course introduces the core concepts of Web 3.0, including blockchain technology, decentralized applications (dApps), smart contracts, and digital assets. You'll learn how Web 3 transforms the internet by enabling trustless systems, user ownership, and decentralized governance. Through practical examples and simple explanations, this course builds a solid foundation for understanding the next generation of the web",
    price:"$99.00",
    stdEnroll:"2400",
    stdFinish:"1200",
    stdCompleteTask:"1000",
    stdPass:"700",
    stdFail:"300"
  },
  {
    id:"2",
    title:"Advanced Solidity",
    description:"This course dives deep into advanced concepts of Solidity, the primary programming language for Ethereum smart contracts. You'll explore topics such as contract optimization, security best practices, design patterns, gas efficiency, and upgradeable contracts. By the end of the course, you'll be able to write robust, secure, and scalable smart contracts suitable for real-world decentralized applications (dApps) and DeFi projects.",
    price:"$149.00",
    stdEnroll:"5300",
    stdFinish:"4200",
    stdCompleteTask:"3500",
    stdPass:"3000",
    stdFail:"500"
  }
]

// Validation / formatting helpers
function validatePrice(price: string): boolean {
    if (!price) return false;
    let priceString = price.trim();
    if (priceString.startsWith('$')) priceString = priceString.substring(1);
    if (priceString === "") return false;
    const priceNum = parseFloat(priceString);
    return !isNaN(priceNum) && isFinite(priceNum) && priceNum >= 0;
}

function formatPriceForDisplay(price: string): string {
    if (!price) return "";
    let priceString = price.trim();
    if (priceString.startsWith('$')) priceString = priceString.substring(1);
    const priceNum = parseFloat(priceString);
    if (!isNaN(priceNum) && isFinite(priceNum)) return `$${priceNum.toFixed(2)}`;
    return price;
}


export default function CourseTaskManagePage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editPrice, setEditPrice] = useState("")
  const [editPriceError, setEditPriceError] = useState<string | null>(null);
  const [isModifyModalOpen, setModifyModalOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  useEffect(() => {
    try {
      const pending = localStorage.getItem("af_pending_course");
      if (pending) {
        const parsed = JSON.parse(pending);

        // Simple validation, your new Course object has all fields
        if (parsed && parsed.id && parsed.title && parsed.price) {
          let isNewCourse = true; // Flag to show the correct toast message

          setCourses((prevCourses) => {
            const courseExists = prevCourses.some((c) => c.id === parsed.id);

            if (courseExists) {
              // --- UPDATE LOGIC ---
              isNewCourse = false;
              // Map over the previous courses and replace the one that matches
              return prevCourses.map((course) =>
                course.id === parsed.id ? parsed : course
              );
            } else {
              // --- ADD NEW COURSE LOGIC (your old logic) ---
              isNewCourse = true;
              return [...prevCourses, parsed]; // 'parsed' is already the full new course object
            }
          });

          // Show a different toast message depending on the action
          if (isNewCourse) {
            toast.success(`Course "${parsed.title}" created successfully!`);
          } else {
            toast.success(`Course "${parsed.title}" updated successfully!`);
          }
        }

        localStorage.removeItem("af_pending_course");
      }
    } catch (err) {
      console.error("Failed to load pending course:", err);
    }
  }, []);

  const handleViewDetail = (courseToView: Course) => {
    try {
      // Save the full course object (including description) to localStorage
      localStorage.setItem("viewing_course_details", JSON.stringify(courseToView));
      
      // Navigate to the detail page
      router.push(`/course-management/course?courseId=${courseToView.id}`);
    } catch (err) {
      console.error("Failed to save course details to localStorage", err);
      // Still try to navigate
      router.push(`/course-management/course?courseId=${courseToView.id}`);
    }
  };

  function handleModify(e: FormEvent) {
    e.preventDefault()
    if (!courseToEdit) return;
     if (!editTitle || !validatePrice(editPrice)) {
        if (!validatePrice(editPrice)) setEditPriceError("Invalid price format (e.g., $99.00 or 99.00)");
        else setEditPriceError(null);
        toast.error("Please fill in all fields correctly.");
        return;
     }
    setCourses(courses.map(c => c.id === courseToEdit.id ? { ...c, title: editTitle, price: editPrice.trim() } : c))
    setCourseToEdit(null)
    setModifyModalOpen(false);
    toast.success(`Course "${editTitle}" updated successfully!`);
  }

  function openDeleteDialog(course: Course) {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  }

  function confirmDelete() {
    if (courseToDelete) {
        setCourses(courses.filter(course => course.id !== courseToDelete.id));
        toast.success(`Course "${courseToDelete.title}" deleted successfully!`);
    }
    setDeleteDialogOpen(false);
    setCourseToDelete(null);
  }

  const handleEditPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditPrice(value);
     if (value && !validatePrice(value)) {
        setEditPriceError("Invalid price (e.g., $99.00 or 99.00)");
    } else {
        setEditPriceError(null);
    }
  };


  return (
    <TooltipProvider>
      <div className="p-8">
        <div className="mb-8">
          <PageHeading title="Course & Task Management" description="This is the instructor-only dashboard to manage all of your content." />
        </div>

        {/* --- Create New Course --- */}
        <div className="mb-8 flex justify-end">
          <Link href="/course-management/new-course">
            <Button size="lg">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Course
            </Button>
          </Link>
        </div>

        {/* --- MANAGE SECTION --- */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Existing Courses</CardTitle>
            <CardDescription>View or delete your existing courses here.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.length === 0 ? (
                  <TableRow><TableCell colSpan={3} className="h-24 text-center">No courses found.</TableCell></TableRow>
                ) : (
                  courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>{formatPriceForDisplay(course.price)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {/* --- UPDATED THIS ONCLICK --- */}
                            <DropdownMenuItem onClick={() => handleViewDetail(course)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>View Detail</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/40"
                              onClick={() => openDeleteDialog(course)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* --- MODIFY MODAL --- */}
      <Dialog open={isModifyModalOpen} onOpenChange={(isOpen) => { if (!isOpen) setCourseToEdit(null); setModifyModalOpen(isOpen); }}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleModify}>
            <DialogHeader>
              <DialogTitle>Modify Course</DialogTitle>
              <DialogDescription>Make changes to "{courseToEdit?.title || 'this course'}". Click save when done.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">Title</Label>
                <Input id="edit-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="col-span-3" required />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-price" className="text-right pt-2">Price</Label>
                 <div className="col-span-3">
                    <Input
                        id="edit-price"
                        value={editPrice}
                        onChange={handleEditPriceChange}
                        className={`${editPriceError ? 'border-red-500' : ''}`}
                        required
                    />
                     <div className="h-6">
                        {editPriceError && (
                          <p className="text-sm text-red-600 pt-1">{editPriceError}</p>
                        )}
                    </div>
                 </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button type="submit" disabled={!!editPriceError || !editTitle}>
                  Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- DELETE CONFIRMATION DIALOG --- */}
       <Dialog open={isDeleteDialogOpen} onOpenChange={(isOpen) => { if (!isOpen) setCourseToDelete(null); setDeleteDialogOpen(isOpen); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>This action cannot be undone. This will permanently delete "{courseToDelete?.title || 'this course'}".</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Yes, delete course</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </TooltipProvider>
  )
}
