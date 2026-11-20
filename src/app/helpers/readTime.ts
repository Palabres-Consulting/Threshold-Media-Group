
export function calculateReadTime(htmlContent: string): number {
  const wordsPerMinute = 200;

  if (!htmlContent?.trim()) return 0;

  // Remove HTML tags
  const textOnly = htmlContent.replace(/<[^>]*>?/gm, "");

  // Count words without creating an array of all words
  let wordCount = 0;
  let insideWord = false;

  for (let i = 0; i < textOnly.length; i++) {
    const isWhitespace = /\s/.test(textOnly[i]);

    if (!isWhitespace && !insideWord) {
      wordCount++;
      insideWord = true;
    } else if (isWhitespace) {
      insideWord = false;
    }
  }

  return Math.ceil(wordCount / wordsPerMinute);
}
