"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Search } from 'lucide-react';
import Image from 'next/image'; // Import the Image component

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
    } catch (e) {
      setError('An error occurred while fetching results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Rest of the code remains the same
};

export default AmazonSearch;
