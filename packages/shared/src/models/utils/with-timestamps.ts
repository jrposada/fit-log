export type WithTimestamps<T> = T & {
  createdAt: string;
  updatedAt: string;
};
