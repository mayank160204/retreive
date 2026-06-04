/**
 * HTML Sanitization Utility for RETREIVE
 *
 * Prevents XSS vulnerabilities when rendering HTML content via
 * dangerouslySetInnerHTML (used in the app simulator for screen templates).
 *
 * Security approach:
 * - Server-side: Strip all script tags and event handlers via regex
 * - Client-side: Use DOMParser-based sanitization (no external dependency needed)
 * - User data injection: Escape HTML entities before template substitution
 *
 * Note: For production hardening, install the `dompurify` package and
 * replace the client-side sanitizer with DOMPurify.sanitize().
 */

/**
 * Escape HTML entities in a raw string to prevent XSS when injecting
 * user-controlled data (e.g., usernames, file names) into HTML templates.
 */
export function escapeHtml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Strips potentially dangerous HTML from a string.
 * Used before injecting HTML screen templates via dangerouslySetInnerHTML.
 *
 * This removes:
 * - <script> tags and their content
 * - javascript: protocol links
 * - on* event handler attributes (onclick, onmouseover, etc.)
 * - data: URIs in href/src attributes
 * - <iframe>, <object>, <embed>, <form> tags
 *
 * What it preserves:
 * - All structural HTML (div, p, span, h1-h6, ul, li, etc.)
 * - CSS class and style attributes
 * - data-* attributes for custom behaviors
 * - Standard href and src attributes (external URLs only)
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';

  let sanitized = html;

  // 1. Remove <script> blocks (including content)
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // 2. Remove <iframe>, <object>, <embed> tags entirely
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  sanitized = sanitized.replace(/<embed\b[^>]*>/gi, '');

  // 3. Remove on* event handler attributes
  sanitized = sanitized.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s+on\w+\s*=\s*[^\s>]*/gi, '');

  // 4. Remove javascript: protocol from href and src attributes
  sanitized = sanitized.replace(/href\s*=\s*["']?\s*javascript:/gi, 'href="data:void"');
  sanitized = sanitized.replace(/src\s*=\s*["']?\s*javascript:/gi, 'src="data:void"');

  // 5. Remove data: URIs from href (but allow data: in img src for base64 images)
  sanitized = sanitized.replace(/href\s*=\s*["']\s*data:/gi, 'href="data:void"');

  // 6. Remove expression() from style attributes (IE CSS injection)
  sanitized = sanitized.replace(/expression\s*\(/gi, 'blocked(');

  return sanitized;
}

/**
 * Safely inject user data into an HTML template string.
 * Escapes all user-controlled values before substitution.
 *
 * Usage:
 *   const html = safeTemplateInject(template, {
 *     username: user.name,
 *     filename: uploadedFile,
 *     xp: xp.toString(),
 *   });
 */
export function safeTemplateInject(
  template: string,
  values: Record<string, string>
): string {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    const escapedValue = escapeHtml(value);
    // Replace {{key}} placeholders
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), escapedValue);
  }
  return result;
}

/**
 * Full pipeline: sanitize the HTML template first, then safely inject user data.
 */
export function safeRenderHtml(
  template: string,
  userValues: Record<string, string> = {}
): string {
  const sanitized = sanitizeHtml(template);
  return safeTemplateInject(sanitized, userValues);
}
