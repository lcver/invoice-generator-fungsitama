'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
      <WellcomeSkeleton />
      <WorksapceSkeleton />
    </div>
  );
}

function WellcomeSkeleton() {
  return (
    <div className="grid justify-items-center space-y-2">
      <Skeleton className="h-8 w-[150px]" />
      <Skeleton className="h-4 w-[300px]" />
    </div>
  );
}

function WorksapceSkeleton() {
  return (
    <div>
      <Skeleton className="h-4 w-[250px]" />
    </div>
  );
}
