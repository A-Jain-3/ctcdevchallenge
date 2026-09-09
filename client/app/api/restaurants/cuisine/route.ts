import { NextResponse } from 'next/server';
import { pool } from '@/db/pool';
import { handleError } from '@/lib/errors';
import { toRestaurant } from '@/lib/types';

/**
 * GET /api/restaurants/cuisine
 * Returns restaurants grouped by cuisine.
 */
export async function GET() {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM restaurants ORDER BY cuisine, name'
    );
    const restaurants = rows.map(toRestaurant);

    const groups: Record<string, typeof restaurants> = {};
    for (const restaurant of restaurants) {
      const key = restaurant.cuisine ?? 'Uncategorized';
      if (!groups[key]) groups[key] = [];
      groups[key].push(restaurant);
    }

    return NextResponse.json(groups);
  } catch (err) {
    return handleError(err);
  }
}