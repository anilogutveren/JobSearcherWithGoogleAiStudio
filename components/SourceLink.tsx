
import React from 'react';
import type { GroundingSource } from '../types';

interface SourceLinkProps {
  source: GroundingSource;
}

const SourceLink: React.FC<SourceLinkProps> = ({ source }) => {
  return (
    <a
      href={source.uri}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-green-400 transition-colors bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-full"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m-9 9h18"
        />
      </svg>
      {source.title || new URL(source.uri).hostname}
    </a>
  );
};

export default SourceLink;
