// ============================================================================
// AssetFlowX - Course Management Page (manage task)
// Modify task 
// ============================================================================

"use client";

import React, { ChangeEventHandler, useEffect, useRef, useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

export default function TaskDashboard() {
  const router = useRouter();
  const [stdCompleteTask, setStdCompleteTask] = useState("0");
  const [stdPass, setStdPass] = useState("0");
  const [stdFail, setStdFail] = useState("0");
  const [courseId, setCourseId] = useState<string | null>(null);

  // State for PDF upload
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null);
  const [assignmentName, setAssignmentName] = useState<string | null>(null);
  const [assignmentError, setAssignmentError] = useState<string | null>(null);
  const assignmentInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const storedDetails = localStorage.getItem("viewing_course_details");
      if (storedDetails) {
        const details = JSON.parse(storedDetails);

        // Set all the state
        setCourseId(details.id || null);
        setAssignmentName(details.assignment || null); 

        // Set dashboard data
        setStdCompleteTask(details.stdCompleteTask || "0");
        setStdPass(details.stdPass || "0");
        setStdFail(details.stdFail || "0");
      }
    } catch (err) {
      console.error("Failed to load course details from localStorage", err);
    }
  }, []);

  const openAssignmentPicker = () => {
    assignmentInputRef.current?.click();
  };

  // Handles the file selection
  const onAssignmentChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate for PDF type
    if (file.type !== "application/pdf") {
      setAssignmentError("Please select a PDF file.");
      setAssignmentFile(null);
      return;
    }

    setAssignmentError(null);
    setAssignmentFile(file);
    setAssignmentName(file.name);
  };

  // Clears the file preview and resets the input
  const deleteAssignment = () => {
    setAssignmentFile(null);
    setAssignmentName(null);
    setAssignmentError(null);
    if (assignmentInputRef.current) {
      assignmentInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    try {
      // 1. Get the full course details from storage
      const storedDetails = localStorage.getItem("viewing_course_details");
      const currentDetails = storedDetails ? JSON.parse(storedDetails) : {};

      // 2. Create the updated object, only changing the assignment name
      const updatedCourse = {
        ...currentDetails,
        id: courseId,
        assignment: assignmentName,
      };

      // 3. Set item for main page to read
      localStorage.setItem("af_pending_course", JSON.stringify(updatedCourse));

      // 4. Update the "viewing" item as well
      localStorage.setItem("viewing_course_details", JSON.stringify(updatedCourse));

      // 5. Navigate back
      window.location.href = "/course-management";
    } catch (err) {
      console.error("Failed to save course changes", err);
    }
  };

  // --- Calculations for Dashboard ---
  const enrollNum = Number(stdCompleteTask);
  const passNum = Number(stdPass);
  const failNum = Number(stdFail);

  const passPercent = enrollNum > 0 ? (passNum / enrollNum) * 100 : 0;
  const failPercent = enrollNum > 0 ? (failNum / enrollNum) * 100 : 0;

  // Determine current material name
  const currentAssignmentName = assignmentFile ? assignmentFile.name : assignmentName;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Navigation */}
      <nav className="bg-neutral-900 text-neutral-100 p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-6">
            <Link href="/course-management/course" className="text-neutral-400 hover:text-white cursor-pointer">
              Manage Course
            </Link>
            <span className="font-bold">Manage Task</span>
          </div>
          <Button variant="ghost" className="text-neutral-300 hover:text-white hover:bg-neutral-800" onClick={() => router.push('/course-management')}>
            Back
          </Button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <PageHeading title="Task Dashboard" />
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Card className="flex-1">
              <CardContent className="p-0">
                <CircularProgressChart
                  label="Total Student Enrolled"
                  value={stdCompleteTask}
                  progress={100}
                  colorClass="text-blue-500"
                />
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardContent className="p-0">
                <CircularProgressChart
                  label="Total Student Fail"
                  value={`${failPercent.toFixed(0)}%`}
                  progress={failPercent}
                  colorClass="text-red-500"
                />
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardContent className="p-0">
                <CircularProgressChart
                  label="Total Student Pass"
                  value={`${passPercent.toFixed(0)}%`}
                  progress={passPercent}
                  colorClass="text-green-500"
                />
              </CardContent>
            </Card>
          </div>
        </header>

        <div className="border-b border-border"></div>

        <Card>
          <CardContent className="space-y-6">
            <input
              ref={assignmentInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={onAssignmentChange}
            />

            <div className="w-full h-[200px] bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 p-4">
              {currentAssignmentName ? (
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="font-medium text-foreground mt-2">File selected:</p>
                  <p
                    className="text-sm text-muted-foreground break-all"
                    title={currentAssignmentName}
                  >
                    {currentAssignmentName}
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
              <h3 className="text-xl font-bold text-foreground mb-2">
                Assignment & Task
              </h3>
              <p className="text-sm text-muted-foreground">
                Upload the PDF document for this course's assignment.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                className="bg-green-500 text-white border-green-500 hover:bg-green-600 hover:text-white"
                onClick={openAssignmentPicker}
                type="button"
              >
                {currentAssignmentName ? "Replace PDF" : "Upload PDF"}
              </Button>

              <Button
                variant="destructive"
                className="hover:bg-red-500 hover:text-white"
                onClick={deleteAssignment}
                disabled={!currentAssignmentName}
                type="button"
              >
                Delete
              </Button>
            </div>

            {/* 3. Add error message display */}
            {assignmentError && (
              <p className="text-sm text-red-600 pt-1">{assignmentError}</p>
            )}
          </CardContent>
        </Card>


        <div className="flex justify-start space-x-3">
          <Button type="submit" variant="default" size="lg" className="hover:bg-green-600 hover:text-white" onClick={handleSave}>
            Save Changes
          </Button>
          <Button type="button" variant="outline" size="lg" className="hover:bg-gray-400" onClick={() => router.push('/course-management')}>
            Cancel
          </Button>
        </div>

      </main>
    </div>
  );
}