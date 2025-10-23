"use client"
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react'

export interface News{
  url: string;
  headline: string;
  content: string;
  author: string;
  date: Date;
}

const NEWS = () => {

  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchNews() {
    setLoading(true);
    const res = await fetch("/api/news");
    const result = await res.json();
    setNews(result.news);
    setLoading(false);
  }

  useEffect(()=>{
    fetchNews();
  },[]);

  if (loading) {
    return (
      <div className="w-1/3 h-screen overflow-y-auto custom-scrollbar p-4">
        {Array.from({ length: 10 }).map((_, idx) => (
          <Skeleton key={idx} className="h-[150px] w-full rounded mb-4" />
        ))}
      </div>
    )
  }else{
    return (
      <div className='w-1/3 h-screen overflow-y-auto'>
        {
          news.map((item, index) => (
            <Card key={index} className='mb-4'>
              <CardHeader>
                <CardTitle>
                  {item.headline}
                </CardTitle>
                <p className='text-sm text-gray-500'>
                  Source: <a href={item.url} target="_blank" rel="noopener noreferrer">{item.author}</a> | {new Date(item.date).toLocaleTimeString()}
                </p>
              </CardHeader>
              {/* Optionally display the content */}
              <div className='p-6 pt-0 text-sm'>
                  {item.content}
              </div>
            </Card>
          ))
        }
      </div>
    )
  }
}

export default NEWS