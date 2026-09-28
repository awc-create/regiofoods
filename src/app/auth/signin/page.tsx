import { Suspense } from 'react';
import type { Metadata } from 'next';
import SignInClient from './SignInClient';

export const metadata: Metadata = {
  title: 'Sign in | Regio Foods Admin',
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <Suspense>
      <SignInClient />
    </Suspense>
  );
}
