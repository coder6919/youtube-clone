
/**
 * Optimizes Cloudinary URLs by adding transformation parameters for 
 * format, quality, and specific dimensions.
 */
export const getOptimizedUrl = (url, width, height) => {
  if (!url) return "";
  if (!url.includes("/upload/")) return url;

  // f_auto: best format, q_auto: best compression
  let transformations = "f_auto,q_auto";
  if (width) transformations += `,w_${width}`;
  if (height) transformations += `,h_${height},c_fill`;

  return url.replace("/upload/", `/upload/${transformations}/`);
};