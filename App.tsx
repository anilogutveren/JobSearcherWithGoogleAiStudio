import React, { useState } from 'react';
import type { JobPosting, GroundingSource } from './types';
import { findJobs } from './services/geminiService';
import SearchBar from './components/SearchBar';
import JobCard from './components/JobCard';
import LoadingSpinner from './components/LoadingSpinner';
import SourceLink from './components/SourceLink';
import CodeSnippetDisplay from './components/CodeSnippetDisplay';

const App: React.FC = () => {
  const [searchResults, setSearchResults] = useState<JobPosting[]>([]);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastQuery, setLastQuery] = useState<string>('');

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setSearchResults([]);
    setSources([]);
    setLastQuery('');

    try {
      const { jobs, sources: jobSources } = await findJobs(query);
      setSearchResults(jobs);
      setSources(jobSources);
      if (jobs.length > 0) {
        setLastQuery(query);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return (
        <div className="text-center p-8 bg-red-900/50 border border-red-700 rounded-lg">
          <h3 className="text-xl font-bold text-red-300">An Error Occurred</h3>
          <p className="mt-2 text-red-400">{error}</p>
        </div>
      );
    }

    if (!hasSearched) {
      return (
        <div className="text-center p-8 bg-slate-800/50 border border-slate-700 rounded-lg">
          <h2 className="text-2xl font-bold text-green-400">Welcome to the Job Search Agent</h2>
          <p className="mt-2 text-slate-400">Enter a job description above to find the latest openings for Spring and Kotlin developers.</p>
        </div>
      );
    }

    if (searchResults.length === 0) {
      return (
        <div className="text-center p-8 bg-slate-800/50 border border-slate-700 rounded-lg">
          <h3 className="text-xl font-bold text-yellow-300">No Results Found</h3>
          <p className="mt-2 text-slate-400">Try refining your search query for better results.</p>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 gap-6">
          {searchResults.map((job, index) => (
            <JobCard key={index} job={job} />
          ))}
        </div>
        {sources.length > 0 && (
            <div className="mt-12 border-t border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-slate-300 mb-4">Sources</h3>
                <div className="flex flex-wrap gap-3">
                    {sources.map((source, index) => (
                        <SourceLink key={index} source={source} />
                    ))}
                </div>
            </div>
        )}
        {lastQuery && searchResults.length > 0 && (
          <CodeSnippetDisplay query={lastQuery} />
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-4">
                <img src="https://spring.io/images/spring-logo-9146a4d3298760c2e7e49595184e1975.svg" alt="Spring Logo" className="h-12 w-12"/>
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/74/Kotlin_Icon.svg" alt="Kotlin Logo" className="h-10 w-10"/>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                    <span className="text-green-400">Spring AI</span> Kotlin Job Agent
                </h1>
            </div>
          <p className="mt-3 text-lg text-slate-400">
            Powered by Gemini with Google Search Grounding
          </p>
        </header>

        <main>
          <div className="mb-8">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </div>

          <div className="mt-6">
            {renderContent()}
          </div>
        </main>

        <footer className="text-center mt-12 text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Job Search Agent. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
