# Product: CareerProfile

## Platform

Web application built with Next.js, React, TypeScript, and Supabase.

## Users

Students who want a clear record of their academic context, skills, and project work, and a practical view of how that experience maps to a career they are exploring.

## Purpose

Help students organize career-relevant information and understand the requirements behind their next learning steps. Career readiness is a transparent, weighted calculation from self-reported proficiency; it is not an employment prediction or a verified credential.

## MVP capabilities

- Student profile: name, university, degree, branch, academic achievements, academic year, semester, graduation year, target career, and GitHub profile URL.
- Skills: add and remove technical or soft skills, set proficiency from Exploring to Confident, and compare them with career requirements.
- Career comparison: 10 defined career profiles, with expected proficiency and a weight for each required skill.
- Projects: add, edit, and remove project records with description, technologies, academic year, semester, and optional URL.
- Journey: display projects grouped by academic year and semester.
- Roadmap: show rule-based next steps ordered by the largest weighted gaps.
- Demo: use illustrative sample data without saving changes.

## Calculation

For each career requirement, contribution equals its weight multiplied by current proficiency divided by expected proficiency, capped at the expected level. The final score is the rounded sum of contributions. Missing skills contribute zero; proficiency is self-assessed.

## Data and access

Supabase Auth identifies the student. Row-level security restricts profile, skill, and project rows to their owner. `supabase/bootstrap.sql` initializes a fresh Supabase project; the timestamped migration is for a database that already has this repository's earlier schema.

## Not enabled in this MVP

Automated GitHub repository syncing, certificate and internship tracking, semester-result uploads, OCR, and admin verification.
