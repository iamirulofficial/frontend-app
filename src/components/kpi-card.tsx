'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface KpiCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  prefix?: string;
  suffix?: string;
  colorClass?: string;
}

const AnimatedCounter = ({ to, duration = 1.5 }: { to: number, duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start = 0;
    const end = to;
    const totalFrames = duration * 60; // 60 fps
    let frame = 0;
    
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    
    const counter = () => {
      frame++;
      const progress = easeOutCubic(frame / totalFrames);
      const current = start + (end - start) * progress;
      setCount(current);

      if (frame < totalFrames) {
        requestAnimationFrame(counter);
      } else {
        setCount(end); // ensure final value is accurate
      }
    };
    requestAnimationFrame(counter);
  }, [to, duration]);
  
  const isInt = Number.isInteger(to) && Number.isInteger(count);

  return <span ref={ref}>{isInt ? Math.round(count) : count.toFixed(2)}</span>;
};


export function KpiCard({ title, value, icon, prefix = '', suffix = '', colorClass = 'text-primary' }: KpiCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`h-6 w-6 ${colorClass}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold font-headline">
          {prefix}
          <AnimatedCounter to={value} />
          {suffix}
        </div>
      </CardContent>
    </Card>
  );
}
