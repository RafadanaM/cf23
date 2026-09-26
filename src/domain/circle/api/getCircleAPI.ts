import appAPIClient from '@/core/api/client';
import { Result } from '@/core/api/types';
import { NormalizedCircles } from '../types';

async function getCircleAPI(): Promise<Result<NormalizedCircles>> {
  return appAPIClient.get<NormalizedCircles>('/v1/circles');
}

export default getCircleAPI;
