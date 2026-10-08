import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export function GET() {
  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

CareerProfile helps students record academic details and self-assessed skills, choose a target career, compare their proficiency with weighted role requirements, and keep projects by semester.

## Product behavior

- Career readiness is deterministic: each skill contributes its career weight multiplied by current proficiency divided by expected proficiency, capped at the expected level.
- Required skills are marked matched, partial, or missing based on the student's recorded proficiency.
- Recommendations are simple rules based on the largest weighted gaps.
- Student skill levels are self-reported and are not verified credentials.
- Projects can be added, edited, removed, and arranged by academic year and semester.
- The demo uses sample data only. It does not save changes.

## Current scope

- Ten target careers with defined required skills, proficiency levels, and weights.
- Private student profile, skills, and project records for signed-in users.
- A dashboard, skill comparison, proof list, journey timeline, roadmap, and profile editor.
- GitHub profile URLs can be recorded, but repository syncing is not enabled.
- Certificate and internship records, semester-result uploads, OCR, and admin verification are not enabled.

## Useful pages

- [Overview](/): product information and account entry.
- [Sample demo](/demo): try role comparisons with illustrative data.
- [Sign up](/signup): create an account.
- [Sign in](/login): open a saved student profile.

## Signed-in API

The authenticated API route at /api/career-profile supports:

- GET: read the current user's profile, skills, and projects.
- PATCH: save academic details, GitHub profile URL, and target career.
- POST: add a skill or project.
- PUT: update a skill proficiency or project.
- DELETE: remove an owned skill or project.

Database policies scope student rows to their owning account. Never treat a submitted proficiency as an independently verified credential.

## Readiness calculation

score = round(sum(weight × min(current proficiency / expected proficiency, 1)))

Career requirement weights sum to 100. Proficiency levels are Exploring (1), Learning (2), Practicing (3), and Confident (4). A missing skill contributes zero.
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
