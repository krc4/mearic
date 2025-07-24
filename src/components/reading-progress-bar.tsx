'use client';

import { useState, useEffect } from 'react';

export function ReadingProgressBar() {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const updateScrollCompletion = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      if (scrollHeight) {
        setCompletion(Number((currentProgress / scrollHeight).toFixed(2)) * 100);
      }
    };

    window.addEventListener('scroll', updateScrollCompletion);

    return () => {
      window.removeEventListener('scroll', updateScrollCompletion);
    };
  }, []);

  return (
    <div
      style={{ transform: `translateX(${completion - 100}%)` }}
      className="fixed top-0 left-0 h-1 w-full bg-primary transition-transform duration-150 z-50"
    />
  );
}
