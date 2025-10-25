import { ReactNode, Suspense } from 'react';

type MainLayoutProps = {
  children: ReactNode;
};

const LoadingPage = () => <div>Loading...</div>;

export default function MainLayout({ children }: MainLayoutProps) {
  return <Suspense fallback={<LoadingPage />}>{children}</Suspense>;
}
