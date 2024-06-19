import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../../server/server';
 
export const trpc = createTRPCReact<AppRouter>();