"use client"
import { Suspense } from 'react';
import Contact from './index';

export default function ContactPage() {
  return (
    <Suspense>
      <Contact />
    </Suspense>
  );
}
