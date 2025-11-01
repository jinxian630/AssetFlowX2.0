// ============================================================================
// AssetFlowX - Course Management Page (manage course)
// Modify course 
// ============================================================================

"use client";
import React, { ChangeEventHandler, useEffect, useRef, useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FileText } from 'lucide-react';
import { PageHeading } from '@/components/ui/page-heading';

const CircularProgressChart: React.FC<{
  progress: number;
  label: string;
  value: string;
  colorClass: string;
}> = ({ progress, label, value, colorClass }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
        {/* Background Circle */}
        <circle
          className="text-gray-200 dark:text-gray-700"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        {/* Progress Circle */}
        <circle
          className={colorClass}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
      </svg>
      {/* Text Inside Circle */}
      <div className="absolute flex flex-col items-center text-center">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xl font-bold text-foreground">{value}</span>
      </div>
    </div>
  );
};

export default function CourseDashboard() {
  const router = useRouter();
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [coursePrice, setCoursePrice] = useState('');
  const [courseId, setCourseId] = useState<string | null>(null);

  // State for dashboard
  const [stdEnroll, setStdEnroll] = useState("0");
  const [stdFinish, setStdFinish] = useState("0");
  const [stdCompleteTask, setStdCompleteTask] = useState("0");
  const [stdPass, setStdPass] = useState("0");
  const [stdFail, setStdFail] = useState("0");

  // State for PDF upload
  const [courseMaterial, setCourseMaterial] = useState<File | null>(null);
  const [materialName, setMaterialName] = useState<string | null>(null); // For saved file name
  const [materialError, setMaterialError] = useState<string | null>(null);
  const courseMaterialInputRef = useRef<HTMLInputElement | null>(null);

  // --- Load Data from LocalStorage ---
  useEffect(() => {
    try {
      const storedDetails = localStorage.getItem("viewing_course_details");
      if (storedDetails) {
        const details = JSON.parse(storedDetails);

        // Set all the state
        setCourseId(details.id || null);
        setCourseTitle(details.title || '');
        setCourseDescription(details.description || '');
        setCoursePrice(String(details.price || '0').replace('$', '') || '0'); 
        
        // Set PDF file names
        setMaterialName(details.courseMaterial || null);

        // Set dashboard data
        setStdEnroll(details.stdEnroll || "0");
        setStdFinish(details.stdFinish || "0");
        setStdCompleteTask(details.stdCompleteTask || "0");
        setStdPass(details.stdPass || "0");
        setStdFail(details.stdFail || "0");
      }
    } catch (err) {
      console.error("Failed to load course details from localStorage", err);
    }
  }, []);

  const openMaterialPicker = () => {
    courseMaterialInputRef.current?.click();
  };

  // Handles the file selection, validates it's a PDF
  const onMaterialChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate for PDF type
    if (file.type !== "application/pdf") {
      setMaterialError("Please select a PDF file.");
      setCourseMaterial(null);
      return;
    }

    setMaterialError(null);
    setCourseMaterial(file); // Store the entire File object
  };

  // Clears the file preview and resets the input
  const deleteMaterial = () => {
    setCourseMaterial(null);
    setMaterialError(null);
    if (courseMaterialInputRef.current) {
      courseMaterialInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    // 1. Format price back to string
    const priceNum = parseFloat(coursePrice);
    const displayPrice = !isNaN(priceNum) ? `$${priceNum.toFixed(2)}` : "$0.00";

    // 2. Build the updated course object
    const updatedCourse = {
      id: courseId,
      title: courseTitle,
      description: courseDescription,
      price: displayPrice,
      stdEnroll: stdEnroll,
      stdFinish: stdFinish,
      stdCompleteTask: stdCompleteTask,
      stdPass: stdPass,
      stdFail: stdFail,
      // Save the file name
      courseMaterial: materialName, 
    };

    try {
      // 3. Set item for main page to read (same as create-course page)
      localStorage.setItem("af_pending_course", JSON.stringify(updatedCourse));
      // 4. Update the "viewing" item as well
      localStorage.setItem("viewing_course_details", JSON.stringify(updatedCourse));
      
      // 5. Navigate back
      window.location.href = '/course-management';
    } catch (err) {
      console.error("Failed to save course changes", err);
    }
  };

  const enrollNum = Number(stdEnroll);
  const finishNum = Number(stdFinish);
  const finishPercent = enrollNum > 0 ? (finishNum / enrollNum) * 100 : 0;
  
  const currentMaterialName = courseMaterial ? courseMaterial.name : materialName;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Navigation */}
      <nav className="bg-neutral-900 text-neutral-100 p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-6">
            <span className="font-bold">Manage Course</span>
            <Link href="/course-management/task" className="text-neutral-400 hover:text-white">
              Manage Task
            </Link>
          </div>
          <Button variant="ghost" className="text-neutral-300 hover:text-white hover:bg-neutral-800" onClick={() => router.push('/course-management')}>
            Back
          </Button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <PageHeading title="Course Dashboard" />
          <div className="flex items-center gap-4">
            <Card className="flex-1">
              <CardContent className="p-0">
                <CircularProgressChart
                  label="Total Student Enrolled"
                  value={stdEnroll}
                  progress={100}
                  colorClass="text-blue-500"
                />
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardContent className="p-0">
                <CircularProgressChart
                  label="Total Student Finish"
                  value={`${finishPercent.toFixed(0)}%`}
                  progress={finishPercent}
                  colorClass="text-green-500"
                />
              </CardContent>
            </Card>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form className="lg:col-span-2 space-y-6" onSubmit={(e) => e.preventDefault()}>
            <Card>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="courseTitle" className="block text-sm font-medium text-muted-foreground mb-1">
                    Course Title
                  </label>
                  <Input
                    id="courseTitle"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="Enter course title"
                  />
                </div>

                <div>
                  <label htmlFor="courseDescription" className="block text-sm font-medium text-muted-foreground mb-1">
                    Course Description
                  </label>
                  <textarea
                    id="courseDescription"
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    rows={8}
                    className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter course description"
                  />
                </div>

                <div>
                  <label htmlFor="coursePrice" className="block text-sm font-medium text-muted-foreground mb-1">
                    Price
                  </label>
                  <Input
                    id="coursePrice"
                    type="number"
                    value={coursePrice}
                    onChange={(e) => setCoursePrice(e.target.value)}
                    placeholder="Enter price (e.g., 25)"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex justify-start space-x-3">
              <Button type="submit" variant="default" size="lg" className="hover:bg-green-600 hover:text-white" onClick={handleSave}>
                Save Changes
              </Button>
              <Button type="button" variant="outline" className="hover:bg-gray-400" size="lg" onClick={() => router.push('/course-management')}>
                Cancel
              </Button>
            </div>
          </form>

          {/* Right Column: Course Material */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="space-y-4">
                {/* 3. Add hidden file input, restricted to PDF */}
                <input
                  ref={courseMaterialInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={onMaterialChange}
                />

                {/* 3. Updated preview box to show file name */}
                <div className="w-full h-[200px] bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 p-4">
                  {currentMaterialName ? (
                    <div className="text-center">
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="font-medium text-foreground mt-2">File selected:</p>
                      <p
                        className="text-sm text-muted-foreground break-all"
                        title={currentMaterialName}
                      >
                        {currentMaterialName}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm">No PDF uploaded</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Please select a PDF file
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Course Material</h3>
                  {/* 3. Updated description */}
                  <p className="text-sm text-muted-foreground">
                    Upload the primary PDF document for this course.
                  </p>
                </div>

                {/* 3. Wire up buttons to handlers */}
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    className="flex-1 bg-green-500 text-white border-green-500 hover:bg-green-600 hover:text-white"
                    onClick={openMaterialPicker}
                    type="button"
                  >
                    {currentMaterialName ? "Replace PDF" : "Upload PDF"}
                  </Button>

                  <Button
                    variant="destructive"
                    className="flex-1 hover:bg-red-500 hover:text-white"
                    onClick={deleteMaterial}
                    disabled={!currentMaterialName}
                    type="button"
                  >
                    Delete
                  </Button>
                </div>

                {/* 3. Add error message display */}
                {materialError && (
                  <p className="text-sm text-red-600 pt-1">{materialError}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}