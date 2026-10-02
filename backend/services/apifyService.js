import { ApifyClient } from "apify-client";

const ACTOR_ID = process.env.APIFY_ACTOR_ID || "orgupdate/linkedin-jobs-scraper";

// Same search dobara aaye to Apify dobara na chale (10 min cache)
const cache = new Map();
const CACHE_MS = 10 * 60 * 1000;

function normalize(item, i) {
  return {
    id: item.URL || i,
    title: item.job_title || "Untitled",
    company: item.company_name || "Unknown company",
    location: item.location || "",
    salary: item.salary && item.salary !== "N/A" ? item.salary : "",
    source: item.posted_via || "",
    description: item.description || "",
    applyUrl: item.URL || "",
  };
}

export async function fetchLinkedInJobs({
  keyword = "software intern",
  location = "India",
  pages = 1,
} = {}) {
  const token = process.env.APIFY_TOKEN || process.env.APIFY_API_TOKEN;
  if (!token) {
    throw new Error("APIFY_TOKEN .env mein nahi mila (backend/.env check karo)");
  }

  const countryName = String(location).toLowerCase().trim();
  const key = `${keyword.toLowerCase().trim()}|${countryName}|${pages}`;

  // Cache mein promise rakhte hain, taaki do request ek saath aayein
  // to bhi actor sirf ek baar chale
  const hit = cache.get(key);
  if (hit && Date.now() - hit.time < CACHE_MS) return hit.promise;

  const promise = (async () => {
    const client = new ApifyClient({ token });
    const input = {
      includeKeyword: keyword,
      countryName,
      datePosted: "month",
      pagesToFetch: pages,
    };
    console.log("Apify input:", input);

    const run = await client.actor(ACTOR_ID).call(input);
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    return items.map(normalize);
  })();

  cache.set(key, { time: Date.now(), promise });
  promise.catch(() => cache.delete(key)); // fail hua to cache mein na rahe

  return promise;
}