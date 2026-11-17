# SEO data (Mark's Google Page 1 plan)

money-words.csv is the one list every report and scheduled task reads. One row per money word.

- owner_page: the only page allowed to carry the phrase (and its close copies) in its title, h1, web address and meta description. Any link whose words contain the phrase points here.
- group: proven (produced a client), buyer intent unproven, or noise (never listed). Unproven words come off after 6 months with no client.
- focus: "fuquay first" gets new pages, articles and link asks first. "fuquay next ring" comes after. "hold" is tracked but gets no new build-out until Fuquay-Varina is on page 1.
- owner_status: live, needs page, or needs phrase on owner.
- hands_off_until: 6 weeks after the owner page last changed. Do not edit the owner page before this date unless something is broken.

Volumes: DataForSEO via OpenSEO, US, pulled 2026-11-17.
Subdivision pages (neighborhoods.csv) are spokes: each links up to its town pillar using the pillar's money phrase as the link words.

leads-log.csv: one row per real website lead (no names, emails, phones or addresses): date, lead type, the page it came from, what the lead typed in the "What you searched" box, and the money word it proves (the owner page's word, or the typed search if it matches one). When a money word gets its first real lead, its group in money-words.csv changes to "proven" with the date and reason.
