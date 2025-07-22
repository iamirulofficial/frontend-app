'use client';
import { redirect, useParams } from 'next/navigation';
import { use } from 'react';

// Redirect to the first step of the new planning flow
export default function ProjectRootPage({ params }: { params: { projectId: string } }) {
  redirect(`/projects/${params.projectId}/planning/charter`);
}
