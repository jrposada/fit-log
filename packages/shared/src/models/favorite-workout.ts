import z from 'zod';

////////////
// Models //
////////////
export type FavoriteWorkout = {
  workoutId: string;
};
export const favoriteWorkoutSchema = z.object({
  workoutId: z.string().nonempty(),
});

/////////
// PUT //
/////////
export type FavoriteWorkoutsPutRequest = FavoriteWorkout;
export const favoriteWorkoutsPutRequestSchema = z.object({
  workoutId: z.string().nonempty(),
});

export type FavoriteWorkoutsPutResponse = {
  favorite: FavoriteWorkout;
};

////////////
// DELETE //
////////////
export type FavoriteWorkoutsDeleteResponse = undefined;
