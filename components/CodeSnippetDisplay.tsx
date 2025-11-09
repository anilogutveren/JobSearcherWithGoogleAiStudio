import React, { useState } from 'react';

interface CodeSnippetDisplayProps {
  query: string;
}

const CodeSnippetDisplay: React.FC<CodeSnippetDisplayProps> = ({ query }) => {
  const [activeTab, setActiveTab] = useState<'curl' | 'kotlin'>('kotlin');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const getPrompt = (userQuery: string) => `
    You are an expert Job Search Agent specializing in Kotlin and Spring framework roles. 
    Based on the user's query: "${userQuery}", find the top 5 most relevant job postings. 
    Use Google Search to ensure the information is up-to-date.
    Format your entire response as a single JSON object within a markdown code block (\\\`\\\`\\\`json ... \\\`\\\`\\\`).
    The JSON object should have a single key "jobs" which is an array of job objects.
    Each job object must have the following properties: "title" (string), "company" (string), "location" (string), and "description" (string, a brief 2-3 sentence summary).
    If you find a direct application link, add it as a "url" property.
    Do not include any text, conversation, or explanation outside of the JSON markdown block.
    Your response should start with \\\`\\\`\\\`json and end with \\\`\\\`\\\`.
  `.replace(/\s+/g, ' ').trim();

  const curlSnippet = `
curl "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=$API_KEY" \\
    -H 'Content-Type: application/json' \\
    -d '{
      "contents": [{"parts": [{"text": "${getPrompt(query)}"}]}],
      "config": {
        "tools": [{"googleSearch": {}}]
      }
    }'
`.trim();

  const kotlinSnippet = `
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Mono

@Service
class GeminiJobService(private val webClient: WebClient) {

    fun findKotlinJobs(userQuery: String): Mono<String> {
        val apiKey = System.getenv("API_KEY")
        val apiUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=$apiKey"

        val prompt = """
            You are an expert Job Search Agent specializing in Kotlin and Spring framework roles. 
            Based on the user's query: "$userQuery", find the top 5 most relevant job postings. 
            Use Google Search to ensure the information is up-to-date.
            Format your entire response as a single JSON object within a markdown code block (\`\`\`json ... \`\`\`).
            The JSON object should have a single key "jobs" which is an array of job objects.
            Each job object must have the following properties: "title" (string), "company" (string), "location" (string), and "description" (string, a brief 2-3 sentence summary).
            If you find a direct application link, add it as a "url" property.
            Do not include any text, conversation, or explanation outside of the JSON markdown block.
            Your response should start with \`\`\`json and end with \`\`\`.
        """.trimIndent().replace("\\n", " ")

        val requestBody = mapOf(
            "contents" to listOf(
                mapOf("parts" to listOf(mapOf("text" to prompt)))
            ),
            "config" to mapOf(
                "tools" to listOf(mapOf("googleSearch" to emptyMap<String, Any>()))
            )
        )

        return webClient.post()
            .uri(apiUrl)
            .bodyValue(requestBody)
            .retrieve()
            .bodyToMono(String::class.java)
    }
}

// WebClient Configuration (e.g., in a @Configuration class)
// @Bean
// fun webClient(): WebClient = WebClient.builder().build()
`.trim();

  const handleCopy = () => {
    const textToCopy = activeTab === 'curl' ? curlSnippet : kotlinSnippet;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    });
  };

  const code = activeTab === 'curl' ? curlSnippet : kotlinSnippet;

  return (
    <div className="mt-12 border-t border-slate-700 pt-6">
      <h3 className="text-lg font-semibold text-slate-300 mb-2">Backend Integration Example</h3>
      <p className="text-sm text-slate-400 mb-4">
        This is a frontend app. You can use the following code on your Spring AI backend to get the same results.
      </p>
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <div className="flex justify-between items-center px-4 py-2 border-b border-slate-700">
            {/* Tabs */}
            <div className="flex gap-2">
                <button 
                    onClick={() => setActiveTab('kotlin')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${activeTab === 'kotlin' ? 'bg-green-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}>
                    Kotlin (Spring WebClient)
                </button>
                 <button 
                    onClick={() => setActiveTab('curl')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${activeTab === 'curl' ? 'bg-green-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}>
                    cURL
                </button>
            </div>
             {/* Copy Button */}
            <button 
                onClick={handleCopy}
                className="flex items-center gap-2 text-sm px-3 py-1 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors text-slate-300">
                {copyStatus === 'copied' ? (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                    </>
                )}
            </button>
        </div>
        <div className="p-4 overflow-x-auto">
          <pre className="text-sm text-slate-300">
            <code className={activeTab === 'kotlin' ? 'language-kotlin' : 'language-bash'}>
                {code}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeSnippetDisplay;
