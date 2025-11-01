// ============================================================================
// AssetFlowX - Course Management Page
// Create new course
// ============================================================================

"use client";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { PageHeading } from "@/components/ui/page-heading";

export default function CreateCourse() {
  const router = useRouter();
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [coursePrice, setCoursePrice] = useState('');

  // upload previews
  const [courseMaterial, setCourseMaterial] = useState<File | null>(null);
  const courseMaterialInputRef = useRef<HTMLInputElement | null>(null);

  const [assignment, setAssignment] = useState<File | null>(null);
  const assignmentInputRef = useRef<HTMLInputElement | null>(null);

  // validation errors
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [materialError, setMaterialError] = useState<string | null>(null);
  const [assignmentError, setAssignmentError] = useState<string | null>(null);

  // helpers
  const openCourseMaterialPicker = () => courseMaterialInputRef.current?.click();
  const openAssignmentPicker = () => assignmentInputRef.current?.click();

  // Updated handler for PDF
  const onCourseMaterialChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate for PDF
    if (file.type !== "application/pdf") {
      setMaterialError("Please select a PDF file.");
      setCourseMaterial(null);
      return;
    }

    setMaterialError(null);
    setCourseMaterial(file); // Store the File object
  };

  // Updated handler for PDF
  const onAssignmentChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate for PDF
    if (file.type !== "application/pdf") {
      setAssignmentError("Please select a PDF file.");
      setAssignment(null);
      return;
    }

    setAssignmentError(null);
    setAssignment(file); // Store the File object
  };

  const deleteCourseMaterial = () => {
    setCourseMaterial(null);
    if (courseMaterialInputRef.current) {
      courseMaterialInputRef.current.value = "";
    }
    setMaterialError(null);
  };

  const deleteAssignment = () => {
    setAssignment(null);
    if (assignmentInputRef.current) {
      assignmentInputRef.current.value = "";
    }
    setAssignmentError(null);
  };


  const formatPriceString = (value: string) => {
    const trimmed = value.toString().trim();
    const n = trimmed.startsWith('$') ? trimmed.slice(1) : trimmed;
    const num = parseFloat(n);
    if (isNaN(num)) return trimmed;
    return `$${num.toFixed(2)}`;
  };

  const validateAll = () => {
    let ok = true;
    if (!courseTitle.trim()) { setTitleError("Title is required"); ok = false; } else setTitleError(null);
    if (!courseDescription.trim()) { setDescriptionError("Description is required"); ok = false; } else setDescriptionError(null);
    if (!coursePrice.toString().trim()) { setPriceError("Price is required"); ok = false; }
    else {
      const num = parseFloat(coursePrice.toString().replace(/^\$/, ""));
      if (isNaN(num) || num <= 0) { setPriceError("Price must be a number greater than 0"); ok = false; } else setPriceError(null);
    }
    if (!courseMaterial) { setMaterialError("Course material PDF is required"); ok = false; } else setMaterialError(null);
    if (!assignment) { setAssignmentError("Assignment PDF is required"); ok = false; } else setAssignmentError(null);

    return ok;
  };

  const handleCancel = () => {
    router.push("/course-management");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;

    // Build course payload
    const newCourse = {
      id: Date.now().toString(),
      title: courseTitle.trim(),
      description: courseDescription.trim(),
      price: formatPriceString(coursePrice),
      courseMaterial: courseMaterial?.name, 
      assignment: assignment?.name, 
    };

    // Persist to localStorage as a "pending" course so main page picks it up and shows success
    try {
      localStorage.setItem("af_pending_course", JSON.stringify(newCourse));
    } catch (err) {
      console.error("localStorage error:", err);
    }

    router.push("/course-management");
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <PageHeading title="Create New Course" />
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Course Title</label>
                  <Input id="courseTitle" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} placeholder="Enter course title" />
                  {titleError && <p className="text-sm text-red-600 mt-1">{titleError}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Course Description</label>
                  <textarea
                    id="courseDescription"
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    rows={6}
                    className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Enter course description"
                  />
                  {descriptionError && <p className="text-sm text-red-600 mt-1">{descriptionError}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Price</label>
                  <Input id="coursePrice" type="text" value={coursePrice} onChange={(e) => setCoursePrice(e.target.value)} placeholder="Enter price (e.g., 25 or $25)" />
                  {priceError && <p className="text-sm text-red-600 mt-1">{priceError}</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardContent className="space-y-4">
                <div className="w-full h-[200px] bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 p-4">
                  {courseMaterial ? (
                    <div className="text-center">
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="font-medium text-foreground mt-2">File selected:</p>
                      <p
                        className="text-sm text-muted-foreground break-all"
                        title={courseMaterial.name}
                      >
                        {courseMaterial.name}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-sm">No course material uploaded</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Please select a PDF file
                      </div>
                    </div>
                  )}
                </div>

                <input
                  ref={courseMaterialInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={onCourseMaterialChange}
                />

                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Course Material</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload the main PDF document for this course.
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                    onClick={openCourseMaterialPicker}
                    type="button"
                  >
                    {courseMaterial ? "Replace PDF" : "Upload PDF"}
                  </Button>

                  <Button
                    variant="destructive"
                    className="flex-1 hover:bg-red-500 hover:text-white"
                    onClick={deleteCourseMaterial}
                    type="button"
                    disabled={!courseMaterial}
                  >
                    Delete
                  </Button>
                </div>

                {materialError && <p className="text-sm text-red-600 mt-1">{materialError}</p>}
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardContent className="space-y-4">
            <div className="w-full h-[200px] bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 p-4">
              {assignment ? (
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="font-medium text-foreground mt-2">File selected:</p>
                  <p
                    className="text-sm text-muted-foreground break-all"
                    title={assignment.name}
                  >
                    {assignment.name}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-sm">No assignment PDF uploaded</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Please select a PDF file
                  </div>
                </div>
              )}
            </div>

            <input
              ref={assignmentInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={onAssignmentChange}
            />

            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">Assignment & Task</h3>
              <p className="text-sm text-muted-foreground">
                Upload the PDF assignment that students will see.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                onClick={openAssignmentPicker}
                type="button"
              >
                {assignment ? "Replace PDF" : "Upload PDF"}
              </Button>

              <Button
                variant="destructive"
                className="flex-1 hover:bg-red-500 hover:text-white"
                onClick={deleteAssignment}
                type="button"
                disabled={!assignment}
              >
                Delete
              </Button>
            </div>

            {assignmentError && (
              <p className="text-sm text-red-600 mt-1">{assignmentError}</p>
            )}

          </CardContent>
        </Card>

        <div className="flex justify-start space-x-3 pt-4 border-t border-border">
          <Button type="submit" variant="default" size="lg" className="hover:bg-green-600 hover:text-white">
            Save & Add Course
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="hover:bg-gray-400 hover:text-white"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
