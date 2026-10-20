import { CarForm } from "@/components/admin/car-form";

export default function NewCarPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Add Car (Manual)</h1>
      <CarForm />
    </div>
  );
}
