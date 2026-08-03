// lib/templates/tmgTemplate.ts

export type HeaderType = "ai_or_die" | "weekly_brief" | "weekly_digest";

export interface ArticleItem {
  title: string;
  snippet?: string;
  category?: string;
  url: string;
  imageUrl?: string; 
}

export interface SignalOfTheWeek {
  title: string;
  category?: string;
  imageUrl?: string;
  content: string;
  whyItMatters?: string;
  articleUrl?: string;
  conclusion?: string; 
}

export interface TemplateParams {
  title?: string;
  headerType?: HeaderType;
  headline?: string;
  openingNote?: string;
  signalOfTheWeek?: SignalOfTheWeek;
  alsoThisWeek?: ArticleItem[]; 
  recommendedReads?: ArticleItem[]; 
  adBannerUrl?: string; 
  adBannerLink?: string;
  ctaUrl?: string;
}

const formatLineBreaks = (text?: string) => {
  if (!text) return "";
  return text.replace(/(?:\r\n|\r|\n)/g, '<br />');
};

export function buildTMGEmailHtml({
  title = "TMG Weekly",
  headerType = "weekly_digest",
  headline,
  openingNote,
  signalOfTheWeek,
  alsoThisWeek = [],
  recommendedReads = [],
  adBannerUrl,
  adBannerLink = "#",
  ctaUrl = "https://thresholdmedia.group/pricing",
}: TemplateParams): string {

  let headerImageUrl = "";
  switch (headerType) {
    case "ai_or_die":
      headerImageUrl = "https://hwudgwuoqvrjutlgtxhv.supabase.co/storage/v1/object/public/Newsletter/aiOrDie.jpg"; 
      break;
    case "weekly_brief":
      headerImageUrl = "https://hwudgwuoqvrjutlgtxhv.supabase.co/storage/v1/object/public/Newsletter/weeklyBrief.jpg";
      break;
    case "weekly_digest":
    default:
      headerImageUrl = "https://hwudgwuoqvrjutlgtxhv.supabase.co/storage/v1/object/public/Newsletter/weeklyDigest.jpg";
      break;
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #333333; line-height: 1.6; }
    table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { max-width: 100%; height: auto; display: block; border: 0; outline: none; text-decoration: none; }
    a { color: #E85D04; text-decoration: none; }
  </style>
</head>
<body style="background-color: #ffffff; padding: 0; margin: 0;">
  <center>
    <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; margin: 0 auto; padding: 0;">
      
      <!-- HEADER BANNER -->
      <tr>
        <td style="padding: 0; text-align: center;">
          <img src="${headerImageUrl}" alt="TMG ${headerType.replace(/_/g, ' ')}" style="width: 100%; max-width: 600px; display: block; border: 0;" />
        </td>
      </tr>

      <!-- INTRO & OPENING NOTE -->
      <tr>
        <td style="padding: 40px 30px 20px 30px; background-color: #ffffff; text-align: left;">
          ${headline ? `<h1 style="font-family: Georgia, serif; font-size: 26px; color: #111111; line-height: 1.3; margin: 0 0 16px 0; font-weight: normal;">${headline}</h1>` : ""}
          ${openingNote ? `<p style="font-size: 14px; color: #444444; line-height: 1.6; margin: 0;">${formatLineBreaks(openingNote)}</p>` : ""}
        </td>
      </tr>

      <!-- SIGNAL OF THE WEEK -->
      ${signalOfTheWeek ? `
      <tr>
        <td style="padding: 20px 30px 40px 30px; background-color: #ffffff;">
          <p style="text-align: center; font-size: 11px; font-weight: 800; color: #E85D04; letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 16px 0;">SIGNAL OF THE WEEK</p>
          
          <h2 style="text-align: center; font-family: Georgia, serif; font-size: 22px; color: #111111; margin: 0 0 24px 0; line-height: 1.3; font-weight: normal;">${signalOfTheWeek.title}</h2>
          
          ${signalOfTheWeek.imageUrl ? `<img src="${signalOfTheWeek.imageUrl}" alt="Featured Analysis" style="width: 100%; height: auto; border-radius: 4px; margin-bottom: 24px; display: block;" />` : ""}
          
          <div style="font-size: 14px; color: #444444; line-height: 1.6; margin-bottom: 16px;">
            ${formatLineBreaks(signalOfTheWeek.content)}
          </div>

          ${signalOfTheWeek.whyItMatters ? `
          <div style="border-left: 3px solid #E85D04; padding-left: 16px; margin-top: 24px; margin-bottom: 20px;">
            <p style="font-size: 14px; color: #444444; line-height: 1.6; margin: 0;">
              ${formatLineBreaks(signalOfTheWeek.whyItMatters)}
            </p>
          </div>
          ` : ""}

          ${signalOfTheWeek.articleUrl ? `
          <div style="margin-bottom: 20px;">
            <a href="${signalOfTheWeek.articleUrl}" style="display: inline-block; font-size: 14px; font-weight: bold; color: #E85D04; text-decoration: none;">Read the full article &rarr;</a>
          </div>
          ` : ""}

          ${signalOfTheWeek.conclusion ? `
          <div style="font-size: 14px; color: #444444; line-height: 1.6; margin-top: 10px;">
            ${formatLineBreaks(signalOfTheWeek.conclusion)}
          </div>
          ` : ""}
        </td>
      </tr>
      ` : ""}

      <!-- TMG PRO BANNER ($14/MONTH) -->
      <tr>
        <td style="background-color: #E85D04; padding: 40px 30px; text-align: center;">
          <table role="presentation" width="100%" align="center">
            <tr>
              <td align="center">
                <span style="background-color: #FFB800; color: #000000; font-size: 12px; font-weight: bold; padding: 4px 12px; display: inline-block; margin-bottom: 16px;">TMG Pro Individual</span>
                <h2 style="font-size: 32px; font-weight: bold; color: #ffffff; margin: 0 0 16px 0;">$14/month</h2>
                <p style="font-size: 14px; color: #ffffff; margin: 0 0 24px 0; line-height: 1.5;">
                  Premium access to TMG's intelligence verticals and<br/>personalized weekly briefings
                </p>
                <a href="${ctaUrl}" target="_blank" style="background-color: #000000; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 40px; font-weight: bold; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; display: inline-block;">
                  SUBSCRIBE
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- ALSO THIS WEEK -->
      ${alsoThisWeek.length > 0 ? `
      <tr>
        <td style="padding: 40px 30px 20px 30px; background-color: #ffffff;">
          <p style="text-align: center; font-size: 11px; font-weight: 800; color: #E85D04; letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 30px 0;">ALSO THIS WEEK</p>
          
          ${alsoThisWeek.map((item) => `
            <table role="presentation" width="100%" style="margin-bottom: 24px;">
              <tr>
                ${item.imageUrl ? `
                <td width="120" style="padding-right: 20px; vertical-align: top;">
                  <img src="${item.imageUrl}" alt="Thumbnail" style="width: 120px; height: 120px; object-fit: cover; border-radius: 4px;" />
                </td>
                ` : ""}
                <td style="vertical-align: top;">
                  <h4 style="font-family: Georgia, serif; font-size: 18px; color: #111111; margin: 0 0 8px 0; line-height: 1.3; font-weight: normal;">${item.title}</h4>
                  ${item.snippet ? `<p style="font-size: 13px; color: #666666; margin: 0 0 8px 0; line-height: 1.5;">${item.snippet}</p>` : ""}
                  <a href="${item.url}" style="font-size: 13px; font-weight: bold; color: #1A56DB; text-decoration: none;">Read the full article &rarr;</a>
                </td>
              </tr>
            </table>
          `).join("")}
        </td>
      </tr>
      ` : ""}

      <!-- RECOMMENDED READS -->
      ${recommendedReads.length > 0 ? `
      <tr>
        <td style="padding: 20px 30px 40px 30px; background-color: #ffffff;">
          <p style="text-align: center; font-size: 11px; font-weight: 800; color: #E85D04; letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 20px 0;">RECOMMENDED READS</p>
          
          ${recommendedReads.map((item) => `
            <div style="border-bottom: 1px solid #EEEEEE; padding: 16px 0;">
              <a href="${item.url}" style="font-family: Georgia, serif; font-size: 16px; font-weight: bold; color: #111111; text-decoration: none; display: block; margin-bottom: 4px;">${item.title}</a>
              ${item.category ? `<span style="font-size: 12px; color: #666666; text-transform: uppercase; font-weight: bold;">${item.category}</span>` : ""}
            </div>
          `).join("")}
        </td>
      </tr>
      ` : ""}

      <!-- ADVERTISEMENT PLACEHOLDERS -->
      ${adBannerUrl ? `
      <tr>
        <td style="padding: 40px 30px; background-color: #222222; text-align: center;">
          <a href="${adBannerLink}" target="_blank">
            <img src="${adBannerUrl}" alt="Advertisement" style="width: 100%; max-width: 400px; margin: 0 auto; display: block;" />
          </a>
        </td>
      </tr>
      ` : ""}

      <!-- FOOTER TOP -->
      <tr>
        <td style="background-color: #311235; padding: 40px 30px; text-align: center;">
          <h3 style="margin: 0 0 20px 0; font-weight: normal; font-family: Georgia, serif; font-size: 20px; color: #ffffff;">Stay connected with TMG</h3>
          
          <table role="presentation" align="center" style="margin: 0 auto 30px auto;">
            <tr>
              <td style="padding: 0 10px;"><a href="https://thresholdmedia.group/" style="color: #E85D04; font-size: 13px; text-decoration: none;">Latest Analysis</a></td>
              <td style="color: #ffffff; font-size: 13px;">|</td>
              <td style="padding: 0 10px;"><a href="https://web.facebook.com/profile.php?id=61574508447602" style="color: #E85D04; font-size: 13px; text-decoration: none;">Facebook</a></td>
              <td style="color: #ffffff; font-size: 13px;">|</td>
              <td style="padding: 0 10px;"><a href="https://www.youtube.com/@ThresholdMediagroup" style="color: #E85D04; font-size: 13px; text-decoration: none;">Youtube</a></td>
              <td style="color: #ffffff; font-size: 13px;">|</td>
              <td style="padding: 0 10px;"><a href="https://www.linkedin.com/company/threshold-media-group-guin%C3%A9e/" style="color: #E85D04; font-size: 13px; text-decoration: none;">Linkedin</a></td>
            </tr>
          </table>

          <a href="${ctaUrl}" target="_blank" style="background-color: #FFB800; color: #000000; text-decoration: none; padding: 14px 32px; border-radius: 40px; font-weight: bold; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; display: inline-block;">
            UNLOCK FULL ACCESS
          </a>
        </td>
      </tr>

      <!-- FOOTER BOTTOM -->
      <tr>
        <td style="background-color: #222222; padding: 30px; text-align: left;">
          <p style="font-size: 11px; color: #999999; line-height: 1.6; margin: 0 0 16px 0;">
            You are receiving this email because you are subscribed to the Threshold Media Group (TMG) newsletter.
          </p>
          <p style="font-size: 11px; color: #999999; line-height: 1.6; margin: 0;">
            © ${new Date().getFullYear()} Threshold Media Group. All rights reserved.
          </p>
        </td>
      </tr>

    </table>
  </center>
</body>
</html>
  `;
}