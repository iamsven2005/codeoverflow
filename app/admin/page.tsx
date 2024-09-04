//@ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { UploadButton } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";
import { courses } from "@prisma/client";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import SortableItem from "./SortableItem";

function EditCourseForm({ course, handleEdit }) {
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description);
  const [imageUrl, setImageUrl] = useState(course.image_src);
  const [imagePreview, setImagePreview] = useState(course.image_src);

  const handleSubmit = async () => {
    await handleEdit({
      ...course,
      title,
      description,
      image_src: imageUrl || imagePreview,
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Edit Course</h2>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 rounded-md"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 rounded-md"
      />

      <UploadButton
        endpoint="courseImage"
        onClientUploadComplete={(res) => {
          const uploadedUrl = res[0]?.url || "";
          setImageUrl(uploadedUrl);
          setImagePreview(uploadedUrl);
          alert("Image Uploaded");
        }}
        onUploadError={(error: Error) => {
          alert(`Error: ${error.message}`);
        }}
      />

      {imagePreview && (
        <div className="mt-4">
          <h3>Image Preview:</h3>
          <img src={imagePreview} alt="Image Preview" className="w-32 h-32 mt-2" />
        </div>
      )}

      <Button onClick={handleSubmit}>Update Course</Button>
    </div>
  );
}

export default function CoursePage() {
  const [courses, setCourses] = useState<courses[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<courses[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await fetch("/api/courses");
      const data: courses[] = await response.json();
      setCourses(data);
      setFilteredCourses(data);
    };

    fetchCourses();
  }, []);

  const handleSaveCourse = async (course: courses) => {
    const endpoint = course.id ? `/api/courses/${course.id}` : "/api/courses";
    const method = course.id ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
      });

      if (response.ok) {
        const updatedCourse: courses = await response.json();
        if (course.id) {
          const updatedCourses = courses.map((c) =>
            c.id === course.id ? updatedCourse : c
          );
          setCourses(updatedCourses);
          setFilteredCourses(updatedCourses);
        } else {
          setCourses([...courses, updatedCourse]);
          setFilteredCourses([...filteredCourses, updatedCourse]);
        }
      } else {
        alert("Failed to save course");
      }
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedCourses = courses.filter((course) => course.id !== id);
        setCourses(updatedCourses);
        setFilteredCourses(updatedCourses);
        alert("Course deleted successfully");
      } else {
        alert("Failed to delete course");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = courses.findIndex((course) => course.id === active.id);
      const newIndex = courses.findIndex((course) => course.id === over.id);
      const newCourses = arrayMove(courses, oldIndex, newIndex);

      setCourses(newCourses);
      setFilteredCourses(newCourses);

      for (let i = 0; i < newCourses.length; i++) {
        await fetch(`/api/courses/${newCourses[i].id}/reorder`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ position: i + 1 }),
        });
      }
    }
  };

  useEffect(() => {
    const result = courses.filter((course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCourses(result);
  }, [searchQuery, courses]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsDialogOpen(true)}>Add New Course</Button>
        </DialogTrigger>

        <DialogContent>
          <EditCourseForm
            course={{ id: "", title: "", description: "", image_src: "" }}
            handleEdit={handleSaveCourse}
          />
        </DialogContent>
      </Dialog>

      <input
        type="text"
        placeholder="Search courses..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full border p-2 rounded-md mb-4"
      />

      <DndContext modifiers={[restrictToVerticalAxis]} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={filteredCourses.map((course) => course.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <SortableItem
                  key={course.id}
                  id={course.id}
                  course={course}
                  handleEdit={handleSaveCourse}
                  handleDelete={handleDeleteCourse}
                />
              ))
            ) : (
              <p>No courses available</p>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
