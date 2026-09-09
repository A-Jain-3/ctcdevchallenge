import { getRestaurantsByCuisine } from '@/lib/apiClient';

export default async function ByCuisinePage() {
  const groups = await getRestaurantsByCuisine();

  return (
    <div>
      <h2 className="mb-4 text-lg font-medium">Restaurants by Cuisine</h2>
      {Object.entries(groups).map(([cuisine, restaurants]) => (
        <div key={cuisine} className="mb-6">
          <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">
            {cuisine}
          </h3>
          <ul className="space-y-3">
            {restaurants.map((restaurant) => (
              <li key={restaurant.id} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-baseline justify-between">
                  <span className="font-medium">{restaurant.name}</span>
                  <span className="text-sm text-gray-500">
                    {restaurant.rating}★
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  {restaurant.address}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}