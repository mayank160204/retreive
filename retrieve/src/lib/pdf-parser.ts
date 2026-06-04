/**
 * PDF Parser Utility for RETREIVE
 *
 * Provides client-side PDF text extraction and automatic passage segmentation.
 * Uses the pdf.js library (pdfjs-dist) to parse PDFs in the browser without
 * any server-side processing.
 *
 * Features:
 * - Text extraction from all pages
 * - Automatic passage segmentation (~300 words per passage)
 * - Paragraph boundary detection
 * - Reading time estimation
 * - Word count calculation
 *
 * Usage:
 *   const result = await parsePdfFile(file);
 *   console.log(result.passages); // Array of segmented passages
 */

export interface Passage {
  id: string;
  order: number;
  text: string;
  wordCount: number;
  estimatedReadingTimeSeconds: number;
  pageStart: number;
  pageEnd: number;
}

export interface PdfParseResult {
  fileName: string;
  totalPages: number;
  totalWordCount: number;
  passages: Passage[];
  rawText: string;
  parsedAt: Date;
}

// Target words per passage (PRD spec: ~300 words)
const WORDS_PER_PASSAGE = 300;
// Maximum overshoot before forcing a break
const MAX_WORDS_PER_PASSAGE = 400;

/**
 * Extract text from a single PDF page using pdf.js TextContent API.
 * Preserves paragraph structure by looking for large vertical gaps between
 * text items, which indicate paragraph boundaries.
 */
function extractPageText(textContent: { items: Array<{str: string; transform: number[]; height: number}> }): string {
  const items = textContent.items;
  
  if (!items || items.length === 0) return '';

  let result = '';
  let lastY: number | null = null;
  let lastHeight = 0;

  for (const item of items) {
    const currentY = item.transform ? item.transform[5] : null;
    const itemHeight = item.height || 12;

    if (lastY !== null && currentY !== null) {
      const yDiff = Math.abs(lastY - currentY);
      
      // Detect paragraph break: y-gap greater than 1.5x the font height
      if (yDiff > lastHeight * 1.5) {
        result += '\n\n';
      } else if (yDiff > 2) {
        // Line break within same paragraph
        result += ' ';
      }
    }

    result += item.str;
    lastY = currentY;
    lastHeight = itemHeight;
  }

  return result;
}

/**
 * Segment a long text into passages of approximately WORDS_PER_PASSAGE words.
 * Breaks at paragraph boundaries when possible; falls back to sentence boundaries.
 */
function segmentIntoPassages(
  text: string,
  pageBreaks: number[] = []
): Array<{ text: string; pageStart: number; pageEnd: number }> {
  // Clean up the text
  const cleaned = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n') // Normalize excessive blank lines
    .replace(/[ \t]+/g, ' ')    // Normalize spaces
    .trim();

  // Split into paragraphs
  const paragraphs = cleaned.split(/\n\n+/).filter((p) => p.trim().length > 20);

  const passages: Array<{ text: string; pageStart: number; pageEnd: number }> = [];
  let currentPassageText = '';
  let currentWordCount = 0;
  let charOffset = 0;

  for (const paragraph of paragraphs) {
    const paragraphWords = paragraph.trim().split(/\s+/).length;

    // If adding this paragraph would exceed max, finalize current passage
    if (
      currentWordCount + paragraphWords > MAX_WORDS_PER_PASSAGE &&
      currentPassageText.trim().length > 0
    ) {
      // Calculate page range for this passage
      const passageCharStart = text.indexOf(currentPassageText.trim().substring(0, 50));
      const pageStart = getPageForCharOffset(passageCharStart, pageBreaks);
      const pageEnd = getPageForCharOffset(passageCharStart + currentPassageText.length, pageBreaks);

      passages.push({
        text: currentPassageText.trim(),
        pageStart,
        pageEnd,
      });

      currentPassageText = '';
      currentWordCount = 0;
    }

    currentPassageText += (currentPassageText ? '\n\n' : '') + paragraph.trim();
    currentWordCount += paragraphWords;
    charOffset += paragraph.length;

    // If we've hit the target word count, finalize passage
    if (currentWordCount >= WORDS_PER_PASSAGE) {
      const passageCharStart = text.indexOf(currentPassageText.trim().substring(0, 50));
      const pageStart = getPageForCharOffset(passageCharStart, pageBreaks);
      const pageEnd = getPageForCharOffset(passageCharStart + currentPassageText.length, pageBreaks);

      passages.push({
        text: currentPassageText.trim(),
        pageStart,
        pageEnd,
      });

      currentPassageText = '';
      currentWordCount = 0;
    }
  }

  // Add remaining text as final passage
  if (currentPassageText.trim().length > 0) {
    passages.push({
      text: currentPassageText.trim(),
      pageStart: pageBreaks.length > 0 ? pageBreaks[pageBreaks.length - 1] : 1,
      pageEnd: pageBreaks.length > 0 ? pageBreaks[pageBreaks.length - 1] : 1,
    });
  }

  return passages;
}

function getPageForCharOffset(charOffset: number, pageBreaks: number[]): number {
  for (let i = 0; i < pageBreaks.length; i++) {
    if (charOffset < pageBreaks[i]) {
      return i + 1;
    }
  }
  return pageBreaks.length || 1;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function estimateReadingTimeSeconds(wordCount: number, wordsPerMinute = 150): number {
  return Math.ceil((wordCount / wordsPerMinute) * 60);
}

/**
 * Main function: Parse a PDF File object and return segmented passages.
 *
 * Must be called in a browser environment (uses pdfjsLib from CDN or npm).
 */
export async function parsePdfFile(file: File): Promise<PdfParseResult> {
  if (!file || file.type !== 'application/pdf') {
    throw new Error('Invalid file: must be a PDF.');
  }

  if (file.size > 50 * 1024 * 1024) {
    throw new Error('File too large: maximum size is 50MB.');
  }

  // Load pdf.js dynamically to avoid SSR issues
  let pdfjs: typeof import('pdfjs-dist');
  try {
    pdfjs = await import('pdfjs-dist');
    
    // Configure the worker - use CDN for simplicity
    if (typeof window !== 'undefined') {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    }
  } catch {
    throw new Error('PDF parser library failed to load. Please refresh and try again.');
  }

  // Convert File to ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  // Load PDF document
  const loadingTask = pdfjs.getDocument({
    data: arrayBuffer,
    useSystemFonts: true,
  });

  const pdf = await loadingTask.promise;
  const totalPages = pdf.numPages;

  let fullText = '';
  const pageBreaks: number[] = []; // Character offsets where each page ends

  // Extract text from each page
  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    const pageText = extractPageText(
      textContent as { items: Array<{str: string; transform: number[]; height: number}> }
    );
    
    fullText += pageText + '\n\n';
    pageBreaks.push(fullText.length);
  }

  // Segment into passages
  const rawSegments = segmentIntoPassages(fullText, pageBreaks);

  // Build final Passage objects
  const passages: Passage[] = rawSegments.map((segment, index) => {
    const wordCount = countWords(segment.text);
    return {
      id: `passage-${index + 1}-${Date.now()}`,
      order: index + 1,
      text: segment.text,
      wordCount,
      estimatedReadingTimeSeconds: estimateReadingTimeSeconds(wordCount),
      pageStart: segment.pageStart,
      pageEnd: segment.pageEnd,
    };
  });

  const totalWordCount = passages.reduce((sum, p) => sum + p.wordCount, 0);

  return {
    fileName: file.name,
    totalPages,
    totalWordCount,
    passages,
    rawText: fullText,
    parsedAt: new Date(),
  };
}

/**
 * Normalize text for speech matching (used by the karaoke reader).
 * Strips punctuation, lowercases, and collapses whitespace.
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s']/g, '') // Remove punctuation except apostrophes
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Tokenize a passage into an array of words for word-by-word highlighting.
 * Returns objects with original word and its normalized form.
 */
export function tokenizePassage(text: string): Array<{
  original: string;
  normalized: string;
  index: number;
}> {
  const words = text.split(/(\s+)/).filter((token) => token.trim().length > 0);
  
  return words.map((word, index) => ({
    original: word,
    normalized: normalizeText(word),
    index,
  }));
}

/**
 * Calculate accuracy score by comparing spoken words to passage words.
 * Returns a 0-100 percentage.
 */
export function calculateAccuracy(
  spokenWords: string[],
  passageTokens: Array<{ normalized: string }>
): number {
  if (passageTokens.length === 0) return 0;
  
  const normalizedSpoken = spokenWords.map(normalizeText);
  let matchCount = 0;

  for (const spokenWord of normalizedSpoken) {
    const matchIdx = passageTokens.findIndex(
      (token) => token.normalized === spokenWord
    );
    if (matchIdx !== -1) {
      matchCount++;
    }
  }

  return Math.min(100, Math.round((matchCount / passageTokens.length) * 100));
}
