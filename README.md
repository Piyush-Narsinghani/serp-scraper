# Google SERP + AI Overview scraper

Upload a CSV, get Google's first page **including the AI Overview** for every row, and download the results as a new CSV. Runs entirely in your browser.

**Use it:** https://piyush-narsinghani.github.io/serp-scraper/

## Providers
| Provider | What you get | Cost |
|---|---|---|
| **SerpApi** (default) | Top 10 results, answer box, knowledge panel, People also ask, related searches, top stories **+ Google AI Overview** (full text + cited links) | 1 search per row, 2 when Google lazy-loads the AI Overview (fetched automatically) |
| **Serper** | Same first-page data, **no AI Overview** | 1 credit per row |

API keys are typed into the page and stored only in your browser (if you tick "Remember"). Nothing is stored in this repository.

## Output columns
Original columns (unchanged, same order) + `serp_provider`, `serp_query`, `serp_status`, `serp_error`, `serp_fetched_at`, `ai_overview_status` (inline / lazy-loaded / none / error), `ai_overview_text`, `ai_overview_sources`, `result_count`, `r1_title…r10_title`, `r1_link…r10_link`, `r1_snippet…r10_snippet`, `answer_box`, `knowledge_graph`, `people_also_ask`, `related_searches`, `top_stories`, `raw_json`.

## If SerpApi says "Failed to fetch" (browser blocks the request)
Set up the free relay once (~5 minutes):
1. Sign in at https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Create Worker** → name it e.g. `serp-relay` → **Deploy**.
2. Click **Edit code**, replace everything with the contents of [`relay-worker.js`](relay-worker.js), click **Deploy**.
3. Copy the worker URL (e.g. `https://serp-relay.<you>.workers.dev`) into the page's **Relay URL** box and press **Start**.

The relay only forwards to serpapi.com and stores nothing.

## GitHub influencers → LinkedIn
The **GitHub influencers → LinkedIn** card fetches the top N GitHub users by followers (GitHub token, no scopes; ~42 paced requests for 2,000 users) and records any LinkedIn they show on GitHub. You can also upload the CSV from `github_influencers_linkedin.py`; the page detects it automatically.

Press **Use LinkedIn search preset** (set automatically for these lists): it searches `"Name" Company site:linkedin.com/in` with Serper, **skips rows that already have a `linkedin_url`** (no credit used) and adds:
`linkedin_final`, `linkedin_final_source` (github_… / personal_website / google_strong / google_partial / google_weak (check) / not found), `linkedin_google_url`, `linkedin_google_title`, `linkedin_google_match`, `linkedin_google_rank`.
`strong` = every word of the name is in the LinkedIn title/URL (2+ words); `partial` = some words or a one-word name — spot-check those; `weak` matches are not copied into `linkedin_final`.

The **LinkedIns** counter shows known + strong/partial matches; set **Stop automatically when this many LinkedIns are found** to stop the run (and the credit spend) at a target. Rows are searched in file order, so with a rank-sorted list you keep the top-ranked people.
