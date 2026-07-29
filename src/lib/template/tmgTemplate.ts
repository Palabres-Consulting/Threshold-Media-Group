// lib/templates/tmgTemplate.ts

import { marked } from "marked";

interface TemplateParams {
  title?: string;
  markdownContent: string;
  headerImage?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export function buildTMGEmailHtml({
  title = "TMG Weekly Digest",
  markdownContent,
  headerImage,
  ctaText = "REQUEST BOARD-LEVEL BRIEFING ACCESS",
  ctaUrl = "#",
}: TemplateParams): string {
  
  const sanitizedMarkdown = markdownContent.replace(
    /(?<![!\[\]])(?<!["'\(])(https?:\/\/[^\s<)]+\.(?:jpg|jpeg|png|webp|gif))/gi,
    (match) => match, // leaves image URLs completely untouched
  );

  // 1. Parse markdown cleanly without destroying HTML structure
  let bodyHtml = marked.parse(sanitizedMarkdown || "", {
    gfm: true,
    breaks: true,
    async: false,
  }) as string;

  // 2. INLINE CSS FIX: Email-safe styles for headers, paragraphs, links, and markdown images
  bodyHtml = bodyHtml
    .replace(
      /<h1>/g,
      '<h1 style="font-family: Georgia, serif; color: #111; font-size: 22px; line-height: 1.3; margin-top: 1.5em; margin-bottom: 0.5em; font-weight: 700;">',
    )
    // Clean, small uppercase editorial tracker matching Figma ("SIGNAL OF THE WEEK")
    .replace(
      /<h2>/g,
      '<h2 style="font-family: -apple-system, sans-serif; color: #f2540d; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-top: 2em; margin-bottom: 0.75em;">',
    )
    // Article titles styled in clean serif
    .replace(
      /<h3>/g,
      '<h3 style="font-family: Georgia, serif; color: #111; font-size: 18px; font-weight: 600; line-height: 1.4; margin-top: 1.2em; margin-bottom: 0.4em;">',
    )
    .replace(
      /<p>/g,
      '<p style="font-size: 14px; color: #333; margin-bottom: 1.2em; line-height: 1.6; font-family: -apple-system, sans-serif;">',
    )
    .replace(/<ul>/g, '<ul style="padding-left: 20px; margin-bottom: 1.2em;">')
    .replace(
      /<li>/g,
      '<li style="font-size: 14px; margin-bottom: 8px; color: #333; line-height: 1.6; font-family: -apple-system, sans-serif;">',
    )
    .replace(
      /<a href=/g,
      '<a style="color: #f2540d; text-decoration: none; font-weight: 600;" href=',
    )
    // Inline CSS for images generated inside the markdown content (matches Figma card image styling)
    .replace(
      /<img /g,
      '<img style="width: 100%; height: auto; border-radius: 12px; margin-top: 12px; margin-bottom: 16px; display: block;" ',
    );

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f3f3ef; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1a1a1a; line-height: 1.6; }
    table { border-collapse: collapse; }
    img { max-width: 100%; height: auto; border-radius: 12px; }
  </style>
</head>
<body style="background-color: #f3f3ef; padding: 20px 10px;">
  <center>
    <table role="presentation" width="100%" style="max-width: 600px; background-color: #fdfdfb; border-radius: 16px; overflow: hidden; border: 1px solid #e5e5e0; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
      
      <!-- HEADER BANNER -->
      <tr>
        <td align="center" style="background: linear-gradient(135deg, #f2540d 0%, #ff7a00 100%); padding: 24px 16px;">
          <table role="presentation">
            <tr>
              <td align="center" style="background-color: #000; padding: 6px 16px; border-radius: 4px;">
                <span style="color: #ffffff; font-family: Georgia, serif; font-weight: bold; font-size: 22px; letter-spacing: -0.5px;">TMG Weekly</span>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-top: 2px;">
                <span style="color: #000000; font-family: Georgia, serif; font-style: italic; font-weight: bold; font-size: 20px;">Digest</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- BODY CONTENT AREA -->
      <tr>
        <td style="padding: 32px 28px;">
          ${
    headerImage
      ? `<img src="${headerImage}" alt="Header Image" style="width: 100%; margin-bottom: 24px; border-radius: 12px;" />`
      : ""
  }
          
          <div class="content-body">
            ${bodyHtml}
          </div>

          <!-- CTA BUTTON -->
          ${
    ctaText
      ? `
          <div style="text-align: center; margin-top: 40px; margin-bottom: 10px;">
            <a href="${ctaUrl}" target="_blank" style="background-color: #f2540d; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 9999px; font-weight: bold; font-size: 12px; letter-spacing: 0.5px; text-transform: uppercase; display: inline-block;">
              ${ctaText}
            </a>
          </div>
          `
      : ""
  }
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td align="center" style="padding: 20px; font-size: 11px; color: #888888; border-top: 1px solid #eeeeee;">
          © ${
    new Date().getFullYear()
  } Threshold Media Group. All rights reserved.
        </td>
      </tr>

    </table>
  </center>
</body>
</html>
  `;
}
