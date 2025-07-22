
'use client'
import { redirect, useParams } from 'next/navigation';
import { use } from 'react';

export default function ProjectRootPage({ params }: { params: { projectId: string } }) {
  redirect(`/projects/${params.projectId}/dashboard`);
}
