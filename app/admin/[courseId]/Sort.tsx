import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface CourseProps {
  course: {
    id: string;
    title: string;
    description: string;
  };
  handleDelete: (id: string) => Promise<void>;
  handleSaveEdit: (id: string, updatedCourse: { title: string; description: string }) => Promise<void>;
}

export default function CourseManager({ course, handleDelete, handleSaveEdit }: CourseProps) {
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    await handleSaveEdit(course.id, { title, description });
    setIsDialogOpen(false);
  };

  return (
    <div className="p-5 ">      
      {/* Edit and Delete Buttons */}
      <div className="flex space-x-4 mb-6 flex-col">
        <p className="font-bold text-xl">{course.title}</p>
        <p>{course.description}</p>
        <div className="flex">

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Edit Course</Button>
          </DialogTrigger>
          <DialogContent>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Edit Course</h2>
              <input
                type="text"
                placeholder="Course Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-2 rounded-md"
              />
              <textarea
                placeholder="Course Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border p-2 rounded-md"
              />
              <Button onClick={handleSave}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button
          variant="destructive"
          onClick={() => {
            if (confirm("Are you sure you want to delete this course?")) {
              handleDelete(course.id);
              router.push("/admin/courses"); // Redirect after deletion
            }
          }}
        >
          Delete Course
        </Button>
        </div>

      </div>
    </div>
  );
}
