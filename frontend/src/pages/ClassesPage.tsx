import { useAppState } from "../state";
import { Badge, PageHeading } from "../components/ui";
import type { ClassInfo } from "../lib/types";
import { useEffect, useState } from "react";
import { fetchClasses } from "../api/classes";
import { ClassCard } from "../components/ClassCard";

export function ClassesPage() {
  const { currentUser } = useAppState();
  const [classes, setClasses] = useState<ClassInfo[]>([]);

  useEffect(() => {
    async function loadClasses() {
      try {
        const classesData = await fetchClasses();
        setClasses(classesData);
      } catch (error) {
        console.error("Failed to load classes:", error);
      }
    }

    loadClasses();
  }, [currentUser?.id]);

  const openClassesCount = classes.filter(
    (item) => !item.bookedByMe && item.capacity - item.registered > 0,
  ).length;

  return (
    <div className="container mx-auto px-6 py-10 lg:px-10">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <Badge>{openClassesCount} open classes</Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {classes.map((classItem) => (
          <ClassCard key={classItem._id} classItem={classItem} />
        ))}
      </div>
    </div>
  );
}
