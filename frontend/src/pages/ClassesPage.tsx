import { useAppState } from "../state";
import type { ClassInfo } from "../lib/types";
import { useEffect, useState } from "react";
import { fetchClasses } from "../api/classes";
import { ClassCard } from "../components/ClassCard";
import { ActivityMapModal } from "../components/ActivityMap";
import { FloatingMapButton } from "../components/FloatingMapButton";

export function ClassesPage() {
  const { currentUser } = useAppState();
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [mapOpen, setMapOpen] = useState(false);

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

  return (
    <div className="container mx-auto px-6 py-10 lg:px-10">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {classes.map((classItem) => (
          <ClassCard key={classItem._id} classItem={classItem} />
        ))}
      </div>
      <FloatingMapButton onClick={() => setMapOpen(true)} />
      <ActivityMapModal open={mapOpen} onClose={() => setMapOpen(false)} />
    </div>
  );
}
