// src/app/helpers/readTime.ts

export function calculateReadTime(htmlContent: string): number {
  const wordsPerMinute = 200;
  
  // 1. Strip all HTML tags out of the content to get just the text
  const textOnly = htmlContent.replace(/<[^>]*>?/gm, '');
  
  // 2. Split the text by spaces to count the total words
  const wordCount = textOnly.trim().split(/\s+/).length;
  
  // 3. Calculate the minutes and round up to the nearest whole number
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  
  return readTime; // Returns an integer (e.g., 4)
}