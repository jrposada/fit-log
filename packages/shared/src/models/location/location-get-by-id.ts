import z from 'zod';

import { Location } from './location';

export type LocationsGetByIdParams = {
  id: string;
};
export const locationsGetByIdParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type LocationsGetByIdResponse = {
  location: Location;
};
