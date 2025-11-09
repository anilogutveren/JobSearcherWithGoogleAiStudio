
import React from 'react';
import type { JobPosting } from '../types';

interface JobCardProps {
  job: JobPosting;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg hover:shadow-green-500/20 transition-all duration-300 transform hover:-translate-y-1 border border-slate-700">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-green-400">{job.title}</h3>
          <p className="text-lg text-slate-300">{job.company}</p>
          <p className="text-sm text-slate-400 mt-1">{job.location}</p>
        </div>
        {job.url && (
            <a href={job.url} target="_blank" rel="noopener noreferrer" className="ml-4 flex-shrink-0 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Apply
            </a>
        )}
      </div>
      <p className="text-slate-300 mt-4">{job.description}</p>
    </div>
  );
};

export default JobCard;
