import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ClimbGrade } from '@shared/models/climb/climb';
import { z } from 'zod';

import { ClimbingParamList } from '../../types';

export type ClimbDetailNavigationProp = NativeStackNavigationProp<
  ClimbingParamList,
  'ClimbDetail'
>;

export type ClimbDetailRouteProp = RouteProp<ClimbingParamList, 'ClimbDetail'>;

export const GRADE_OPTIONS: ClimbGrade[] = [
  'V0',
  'V1',
  'V2',
  'V3',
  'V4',
  'V5',
  'V6',
  'V7',
  'V8',
  'V9',
  'V10',
  'V11',
  'V12',
  'V13',
  'V14',
  'V15',
  'V16',
  'V17',
];

const holdSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
});

export const formSchema = z.object({
  name: z.string().nonempty(),
  grade: z.string().nonempty(),
  description: z.string().optional(),
  holds: z.array(holdSchema),
  image: z.string().nonempty(),
  location: z.string().nonempty(),
  sector: z.string().nonempty(),
});

export type FormData = z.infer<typeof formSchema>;
