export const decodeEntities = (value: string) =>
  value
    .replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8211;/g, "–")
    .replace(/&amp;/g, "&");

export const safeText = (value: string | undefined) =>
  decodeEntities(value?.replace(/<[^>]+>/g, "").trim() || "No description available.");

export const truncateText = (value: string | undefined, wordLimit = 18) => {
  const text = safeText(value);
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= wordLimit) return text;
  return `${words.slice(0, wordLimit).join(" ")}...`;
};

export const safeTitle = (value: string | undefined) =>
  decodeEntities(value?.trim() || "Untitled post");

export const formatAuthorDate = (dateString: string | undefined) => {
  if (!dateString) return "Unknown date";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Unknown date";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
