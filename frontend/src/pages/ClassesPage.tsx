import { useAppState } from "../state";
import { Badge, Button, Card, PageHeading } from "../components/ui";
import { formatClassDate } from "./helpers";
import type { ClassInfo } from "../lib/types";
import { useEffect, useState } from "react";
import { fetchClasses, fetchAllClasses } from "../api/classes";

export function ClassesPage() {
  const { currentUser } = useAppState();
  const [classes, setClasses] = useState<ClassInfo[]>([]);

  useEffect(() => {
    async function loadClasses() {
      if (currentUser) {
        const classesData = await fetchClasses();
        console.log(currentUser);
        setClasses(classesData);
      } else {
        const classesData = await fetchAllClasses();
        console.log(classesData);
        setClasses(classesData);
      }
    }

    loadClasses();
  }, [currentUser?.id]);

  return (
    <div className="container mx-auto px-6 py-10 lg:px-10">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeading
          title="Discover classes"
          subtitle="Browse upcoming wellness and fitness experiences."
        />
        <div className="flex items-center gap-3">
          <Badge>
            {
              classes.filter(
                (item: ClassInfo) =>
                  !item.bookedByMe && item.capacity - item.bookedCount > 0,
              ).length
            }{" "}
            open classes
          </Badge>
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        {classes.map((item: ClassInfo) => (
          <Card key={item.id} className="space-y-5">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-48 w-full rounded-[1.75rem] object-cover"
            />
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {item.title}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {item.instructor} · {item.location}
                  </p>
                </div>
                <Badge>{item.requiredCredits} credits</Badge>
              </div>
              <p className="text-sm leading-6 text-slate-600">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                <span>{formatClassDate(item.dateTime)}</span>
                <span>{item.capacity - item.bookedCount} spots left</span>
                {item.friendsGoing.length > 0 ? (
                  <span>{item.friendsGoing.length} friends going</span>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="secondary" as="a" href={`/classes/${item.id}`}>
                  View details
                </Button>
                <Button as="a" href={`/classes/${item.id}?action=book`}>
                  {item.bookedByMe ? "Booked" : "Book class"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
