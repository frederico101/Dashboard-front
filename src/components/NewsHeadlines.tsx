import React, { useEffect, useState } from 'react';
import { fetchNewsHeadlines } from '../utils/api';

const NewsHeadlines: React.FC = () => {
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getNews = async () => {
      try {
        const data = await fetchNewsHeadlines('us');
        setNews(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getNews();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!news) {
    return <div>Error loading news headlines</div>;
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl mb-2">Top News Headlines</h2>
      <ul>
        {news.articles.map((article: any, index: number) => (
          <li key={index} className="mb-2">
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              {article.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsHeadlines;