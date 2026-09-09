import { NextResponse } from 'next/server';
import { pool } from '@/db/pool';
import { handleError, NotFoundError, ValidationError } from '@/lib/errors';
import { toRestaurant } from '@/lib/types';

type Params = { params: { id: string } };

function parseId(raw: string): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    throw new NotFoundError('Restaurant not found');
  }
  return id;
}

/**
 * Validates a restaurant request body.
 * Returns an array of error messages - empty array means valid.
 */
function validateRestaurantInput(body: unknown): string[] {
  const errors: string[] = [];

  if (typeof body !== 'object' || body === null) {
    return ['Request body must be a JSON object'];
  }

  const { name, cuisine, address, rating } = body as Record<string, unknown>;

  // name - required, non-empty string
  if (typeof name !== 'string' || name.trim().length === 0) {
    errors.push('name is required and must be a non-empty string');
  }

  // cuisine - optional, but if present must be a string
  if (cuisine !== undefined && cuisine !== null && typeof cuisine !== 'string') {
    errors.push('cuisine must be a string or null');
  }

  // address - optional, but if present must be a string
  if (address !== undefined && address !== null && typeof address !== 'string') {
    errors.push('address must be a string or null');
  }

  // rating - optional, but if present must be a number between 0 and 5
  if (rating !== undefined && rating !== null) {
    if (typeof rating !== 'number' || Number.isNaN(rating)) {
      errors.push('rating must be a number');
    } else if (rating < 0 || rating > 5) {
      errors.push('rating must be between 0 and 5');
    }
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join('; '));
  }

  return { name, cuisine, address, rating } as {
    name: string;
    cuisine: string | null | undefined;
    address: string | null | undefined;
    rating: number | null | undefined;
  };

}

/**
 * GET /api/restaurants/:id
 * Returns a single restaurant, or 404 if it doesn't exist.
 */
export async function GET(_req: Request, { params }: Params) {
  try {
    const id = parseId(params.id);
    const { rows } = await pool.query(
      'SELECT * FROM restaurants WHERE id = $1',
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    return NextResponse.json(toRestaurant(rows[0]));
  } catch (err) {
    return handleError(err);
  }
}

/**
 * PUT /api/restaurants/:id
 * Update an existing restaurant.
 */
export async function PUT(req: Request, ctx: Params) {
  try {
    const { id } = ctx.params;
    const body = await req.json();

    const { name, cuisine, address, rating } = validateRestaurantInput(body);
    const { rows } = await pool.query(
      `UPDATE restaurants
       SET name = $1, cuisine = $2, address = $3, rating = $4
       WHERE id = $5
       RETURNING *`,
      [name, cuisine ?? null, address ?? null, rating ?? null, id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(toRestaurant(rows[0]));
  } catch (err) {
    return handleError(err);
  }
}

/**
 * DELETE /api/restaurants/:id
 * Delete a restaurant.
 *
 * TODO (A2): implement. Delete the row matching :id and return 204 (or 404
 * if it doesn't exist).
 *
 * Worth noticing: the migration already made a call about what happens to that
 * restaurant's visits. Go read it. If you disagree with it, say so in your
 * write-up.
 */
export async function DELETE(_req: Request, ctx: Params) {
  try {
    const id = parseId(ctx.params.id);

    const { rows } = await pool.query(
      `DELETE FROM restaurants WHERE id = $1 RETURNING *`,
      [id]
    );

    if (rows.length === 0) {
      throw new NotFoundError('Restaurant not found');
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleError(err);
  }
}

/**
 * SORT
 * Groups the restaurants by the cuisines they're in.
 */
export async function SORT(
  restaurants: Restaurant[]
): Record<string, Restaurant[]> {
  const groups: Record<string, Restaurant[]> = {};

  for (const restaurant of restaurants) {
    const key = restaurant.cuisine ?? 'Uncategorized';
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(restaurant);
  }

  return groups;
}