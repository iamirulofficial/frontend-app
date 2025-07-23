'use client';
import { redirect, useParams } from 'next/navigation';

// Redirect to the first step of the new execution flow
export default function ProjectRootPage({ params }: { params: { projectId: string } }) {
  redirect(`/projects/${params.projectId}/execution/workstreams`);
}
