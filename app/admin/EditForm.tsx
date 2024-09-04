import { useState } from "react";
import { UploadButton } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";

interface EditCourseFormProps {
  course: {
    id: string;
    title: string;
    description: string;
    image_src: string;
  };
  handleEdit: (updatedCourse: { id: string; title: string; description: string; image_src: string }) => Promise<void>;
}

export default function EditCourseForm({ course, handleEdit }: EditCourseFormProps) {
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description);
  const [imageUrl, setImageUrl] = useState(course.image_src);
  const [imagePreview, setImagePreview] = useState(course.image_src);

  const handleSubmit = async () => {
    await handleEdit({
      id: course.id,
      title,
      description,
      image_src: imageUrl || imagePreview,
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Edit Course</h2>

      {/* Title input */}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 rounded-md"
      />

      {/* Description input */}
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 rounded-md"
      />

      {/* Image Upload */}
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

      {/* Image Preview */}
      {imagePreview && (
        <div className="mt-4">
          <h3>Image Preview:</h3>
          <img src={imagePreview} alt="Image Preview" className="w-32 h-32 mt-2" />
        </div>
      )}

      {/* Submit Button */}
      <Button onClick={handleSubmit}>Update Course</Button>
    </div>
  );
}
