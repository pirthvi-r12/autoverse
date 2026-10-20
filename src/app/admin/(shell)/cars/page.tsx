import Link from "next/link";
import { getCars } from "@/lib/data/cars";
import { deleteCarAction, markCarSoldAction } from "@/lib/admin/actions";
import { formatPrice } from "@/lib/format";

export default async function AdminCarsPage() {
  const cars = await getCars({ status: "all", sort: "newest" });

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <h1 className="text-2xl font-bold sm:text-3xl">Car Management</h1>
        <Link
          href="/admin/cars/new"
          className="btn-touch w-full rounded-full bg-accent text-center text-black sm:w-auto"
        >
          Add car
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-white/60">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id} className="border-t border-white/10">
                <td className="px-4 py-3">{car.name}</td>
                <td className="px-4 py-3">{formatPrice(car.price)}</td>
                <td className="px-4 py-3 capitalize">{car.status}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/admin/cars/${car.id}/edit`} className="text-accent">
                      Edit
                    </Link>
                    <form action={markCarSoldAction}>
                      <input type="hidden" name="id" value={car.id} />
                      <button type="submit" className="text-amber-300">
                        Mark sold
                      </button>
                    </form>
                    <form action={deleteCarAction}>
                      <input type="hidden" name="id" value={car.id} />
                      <button type="submit" className="text-red-400">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
