import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import EditCourseForm from "./EditForm";
import { string } from "zod";

function SortableItem({ id, course, handleEdit, handleDelete }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const router = useRouter(); // Use Next.js's useRouter hook for navigation

  // Inline styles for DnD transformation
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Handle navigating to the units page for this course
  const goToUnitsPage = () => {
    router.push(`/admin/${course.id}`);
  };

  return (
    <div ref={setNodeRef} style={style} className="border p-4 rounded-md shadow">
      {/* Non-draggable content (Edit/Delete buttons) */}
      <div className="mt-4 flex space-x-2">
        <Dialog>
          <DialogTrigger asChild>
            {/* Prevent drag event on click */}
            <Button
              onClick={(e) => e.stopPropagation()} // Stop event propagation
            >
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <EditCourseForm course={course} handleEdit={handleEdit} />
          </DialogContent>
        </Dialog>

        <Button
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation(); // Stop event propagation
            handleDelete(course.id);
          }}
        >
          Delete
        </Button>

        {/* Button to go to the units page */}
        <Button
          onClick={(e) => {
            e.stopPropagation(); // Prevent drag event
            goToUnitsPage(); // Navigate to the units page for the course
          }}
        >
          Manage Units
        </Button>
      </div>

      {/* Draggable content */}
      <div {...attributes} {...listeners} className="draggable-content mt-4 p-2 bg-gray-50 rounded-md">
        <h2 className="text-lg font-semibold">{course.title}</h2>
        <p>{course.description}</p>
        {course.image_src && <img src={course.image_src} alt={course.title} className="w-32 h-32 mt-2" />}
        <p className="text-sm">Position: {course.position}</p>
      </div>
    </div>
  );
}

export default SortableItem;
