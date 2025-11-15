export type FavoriteWorkoutDbRecord = {
  PK: 'favorite-workout';

  /** workout#<user-id>#<workout-id> */
  SK: `favorite-workout#${string}#${string}`;
};
