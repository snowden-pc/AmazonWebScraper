// app/api/amazon-search/route.ts

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface AmazonItem {
  title: string;
  price: string;
  rating: string;
  imageUrl: string;
  link: string;
}

async function scrapeAmazon(keyword: string): Promise<AmazonItem[]> {
  const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
  
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const $ = cheerio.load(response.data);
    const items: AmazonItem[] = [];

    $('.s-result-item[data-component-type="s-search-result"]').each((i, el) => {
      const title = $(el).find('h2 span').text().trim();
      const price = $(el).find('.a-price-whole').first().text().trim();
      const rating = $(el).find('.a-icon-star-small .a-icon-alt').first().text().trim();
      const imageUrl = $(el).find('img.s-image').attr('src') || '';
      const link = 'https://www.amazon.com' + ($(el).find('a.a-link-normal').attr('href') || '');

      if (title && price) {
        items.push({ title, price, rating, imageUrl, link });
      }
    });

    return items;
  } catch (error) {
    console.error('Error scraping Amazon:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const keyword = searchParams.get('keyword');

  if (!keyword) {
    return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
  }

  try {
    const items = await scrapeAmazon(keyword);
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error searching Amazon:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}