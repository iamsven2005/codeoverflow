"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import SortableItem from "./Sort"; // Ensure this component is correctly imported and implemented
import { units } from "@prisma/client";

interface Props {
  params: {
    courseId: string;
  };
}



export default function UnitsManager({ params }: Props) {
  const [units, setUnits] = useState<units[]>([]);
  const [newUnit, setNewUnit] = useState({ title: "", description: "", order: 0 });

  // Fetch the units for a specific course
  useEffect(() => {
    const fetchUnits = async () => {
      const response = await fetch(`/api/units?courseId=${params.courseId}`);
      if (response.ok) {
        const data = await response.json();
        setUnits(data);
      }
    };
    fetchUnits();
  }, [params.courseId]);

  // Handle unit creation
  const handleCreateUnit = async () => {
    const response = await fetch("/api/units", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newUnit, course_id: params.courseId }),
    });
    const data = await response.json();
    setUnits((prev) => [...prev, data]);
    setNewUnit({ title: "", description: "", order: 0 });
  };

  // Handle drag end and reordering
  const handleDragEnd = async (event: { active: any; over: any }) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = units.findIndex((unit) => unit.id === active.id);
      const newIndex = units.findIndex((unit) => unit.id === over.id);
      const newUnits = arrayMove(units, oldIndex, newIndex);

      // Update order in frontend state
      setUnits(newUnits);

      // Send the updated order to the backend
      for (let i = 0; i < newUnits.length; i++) {
        await fetch(`/api/units/${newUnits[i].id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: i + 1 }),
        });
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Units for Course</h1>

      {/* Form to add new units */}
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add New Unit</Button>
        </DialogTrigger>
        <DialogContent>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Create New Unit</h2>
            <input
              type="text"
              placeholder="Title"
              value={newUnit.title}
              onChange={(e) => setNewUnit((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full border p-2 rounded-md"
            />
            <textarea
              placeholder="Description"
              value={newUnit.description}
              onChange={(e) => setNewUnit((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full border p-2 rounded-md"
            />
            <Button onClick={handleCreateUnit}>Create Unit</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* List of units with drag-and-drop ordering */}
      <DndContext modifiers={[restrictToVerticalAxis]} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={units.map((unit) => unit.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4 mt-6">
            {units.length > 0 ? (
              units.map((unit) => (
                <SortableItem key={unit.id} id={unit.id} course={unit}>
                  <div className="p-4 border rounded-md shadow">
                    <h3 className="text-lg font-semibold">{unit?.title || "Untitled"}</h3>
                    <p>{unit?.description || "No description available"}</p>
                    <p>Order: {unit?.order ?? "Not set"}</p>
                  </div>
                </SortableItem>
              ))
            ) : (
              <p>No units available for this course.</p>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
