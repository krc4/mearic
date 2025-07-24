'use client';

import { useState, useEffect } from 'react';

export function ReadingProgressBar() {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const updateScrollCompletion = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setCompletion(Number((currentProgress / scrollHeight).toFixed(2)) * 100);
      } else {
        setCompletion(0);
      }
    };

    window.addEventListener('scroll', updateScrollCompletion);

    updateScrollCompletion();

    return () => {
      window.removeEventListener('scroll', updateScrollCompletion);
    };
  }, []);

  return (
    <div
      style={{ width: `${completion}%` }}
      className="fixed top-0 left-0 h-1 bg-primary transition-width duration-150 ease-linear z-50"
    />
  );
}
