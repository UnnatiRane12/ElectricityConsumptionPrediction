import React from 'react';

const Skeleton = ({ className = "h-6 w-full" }) => {
  return (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl ${className}`}></div>
  );
};

export default Skeleton;
