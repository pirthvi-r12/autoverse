import { notFound } from "next/navigation";
import { getCarById } from "@/lib/data/cars";
import { CarForm } from "@/components/admin/car-form";

export default async function EditCarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const car = await getCarById(id);
  if (!car) notFound();

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Edit Car</h1>
      <CarForm car={car} />
    </div>
  );
}
