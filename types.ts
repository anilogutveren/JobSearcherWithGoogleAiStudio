
export interface JobPosting {
  title: string;
  company: string;
  location: string;
  description: string;
  url?: string;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface GeminiSearchResponse {
  jobs: JobPosting[];
  sources: GroundingSource[];
}
