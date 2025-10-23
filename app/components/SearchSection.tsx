"use client"
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const SearchSection = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [prevQuery, setPrevQuery] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function fetchQuery() {
    if (!prompt.trim()) return;
    try {
      setPrevQuery("");
      setAiResponse("");
      setLoading(true);
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setPrevQuery(prompt);
      setAiResponse(data.data);
      setLoading(false);
      setPrompt("");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="w-2/3 h-screen flex flex-col justify-center items-center space-y-4">
      {/* Generated result section */}
      {aiResponse && (
        <div className="w-4/5 h-4/5 p-4 mt-4 overflow-y-auto flex flex-col items-end">
          <div className='p-2 border-none rounded-2xl bg-card w-fit'>
            {prevQuery}
          </div>
          <div className='mt-4 prose prose-invert max-w-none'>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {aiResponse}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {
        loading && (
          <div className="w-4/5 h-4/5 p-4 mt-4 overflow-y-auto flex flex-col items-end">
             <div className="flex flex-col space-y-3">
                <Skeleton className="h-8 w-[250px] rounded-3xl" />
              </div>
          </div>
        )
      }

      {/* Search bar section */}
      <div className="w-4/5 border p-4 rounded-2xl shadow-md">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full resize-none"
          placeholder="Ask NESA"
        />
        <div className="w-full flex justify-end mt-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-2xl"
            onClick={fetchQuery}
          >
            <Search />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SearchSection;