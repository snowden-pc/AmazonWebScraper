"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Search } from 'lucide-react';

interface AmazonItem {
  title: string;
  price: string;
  rating: string;
  imageUrl: string;
  link: string;
}

// Replace 'amazon_affiliate' with your actual Amazon affiliate tag
const AFFILIATE_TAG = 'amazon_affiliate';

const addAffiliateTag = (url: string): string => {
  const amazonUrl = new URL(url);
  amazonUrl.searchParams.set('tag', AFFILIATE_TAG);
  return amazonUrl.toString();
};

const AmazonSearch: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<AmazonItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/amazon-search?keyword=${encodeURIComponent(keyword)}`);
      if (!response.ok) throw new Error('Failed to fetch results');
      const data = await response.json();
      // Add affiliate tags to all product links
      const dataWithAffiliateLinks = data.map((item: AmazonItem) => ({
        ...item,
        link: addAffiliateTag(item.link)
      }));
      setResults(dataWithAffiliateLinks);
    } catch (error) {
      setError('An error occurred while fetching results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Amazon Product Search</h1>
      <div className="flex justify-center mb-8">
        <div className="flex w-full max-w-md">
          <Input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter product keyword..."
            className="rounded-r-none"
          />
          <Button 
            onClick={handleSearch} 
            disabled={loading}
            className="rounded-l-none"
          >
            {loading ? (
              'Searching...'
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" /> Search
              </>
            )}
          </Button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((item, index) => (
          <Card key={index} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="aspect-w-1 aspect-h-1 w-full mb-4">
                <img src={item.imageUrl} alt={item.title} className="object-contain w-full h-full" />
              </div>
              <p className="text-2xl font-bold mb-2">${item.price}</p>
              <div className="flex items-center">
                <Star className="text-yellow-400 mr-1" />
                <span>{item.rating}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <a href={item.link} target="_blank" rel="noopener noreferrorer">View on Amazon</a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {results.length === 0 && !loading && !error && (
        <p className="text-center text-gray-500 mt-8">No results to display. Try searching for a product!</p>
      )}
    </div>
  );
};

export default AmazonSearch;
