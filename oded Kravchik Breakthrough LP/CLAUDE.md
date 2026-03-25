# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hebrew (RTL) landing page for "שוברים תקרות" — a personal development and mental coaching certification course by Dr. Oded Kravchik, using the FTC (Freedom To Choose) methodology. The page's goal is lead generation (form submission → Zapier webhook → thank you page redirect).

## Architecture

**Single-file static page.** Everything lives in `index.html` — HTML, CSS (in `<style>`), and JavaScript (in `<script>`). No framework, no build step, no package manager.

- **Deployment target:** Embedded as HTML widget inside Elementor Canvas page on `oded-kravtchik.co.il` (WordPress)
- **All images use full URLs** from `oded-kravtchik.co.il/wp-content/uploads/` — never local `assets/` paths
- **Font:** Heebo from Google Fonts (weights: 300, 400, 700, 900) — the only external dependency

## Design System

Dark premium theme. All values defined in CSS `:root` variables:

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#0D0D0D` | Primary background |
| `--bg-alt` | `#141414` | Alternating section background |
| `--bg-card` | `#1A1A1A` | Card backgrounds |
| `--border` | `#2A2A2A` | Card/element borders |
| `--text` | `#FFFFFF` | Primary text |
| `--text-sec` | `#B0B0B0` | Secondary text |
| `--gold` | `#D4A843` | Primary accent (CTAs, highlights) |
| `--gold-light` | `#F5C842` | Hover states |

CTA buttons: `--gold` background, `--bg` text, `border-radius: 6px`, `padding: 16px 40px`. NOT pill-shaped.

## Form Flow

1. Hidden fields auto-populate UTM params from URL query string (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_ad`)
2. On submit: `navigator.sendBeacon` fires webhook to Zapier (`hooks.zapier.com/hooks/catch/5016768/udnkhkm/`) with all fields as JSON
3. Immediate redirect to `https://oded-kravtchik.co.il/thankyoupage/` — no waiting for webhook response

## Video Testimonials

Thumbnail cards with play button overlay. Click replaces thumbnail with YouTube iframe (`autoplay=1&rel=0&start=N`). Videos play inline, no new tab. Each card has a `data-video` (YouTube ID) and `data-start` (seconds) attribute.

## Copy Rules

All copy is in Hebrew, gender-neutral (plural form: "מרגישים", "רוצים", not "אתה מרגיש"). Refer to `copy-brief.md` for tone, messaging priorities, and banned phrases. Key rules:
- No emojis, no em dashes, no generic coaching clichés
- Tone: direct, warm, human — not corporate or over-enthusiastic
- No connecting words like "יתרה מכך", "ראשית", "בנוסף"

## Reference Files

- `project-spec.md` — Full project specification (section structure, design principles, technical requirements)
- `copy-brief.md` — Copywriting strategy, messaging priorities, banned phrases
- `design-brief.md` — Visual design system, responsive breakpoints, component specs
- `syllabus.md` — Course curriculum (10 sessions, 3 phases), dates, pricing
- `course-info.md` — Instructor bio, course objectives, team details
- `testimonials.md` — YouTube video URLs and text quotes

## Key Constraints

- RTL layout: `<html lang="he" dir="rtl">`
- Mobile-first responsive: breakpoints at 767px and 1199px
- No external dependencies beyond Google Fonts
- No base64-embedded images — all images via full WordPress media URLs
- No popups/modals — form is inline at bottom, CTAs smooth-scroll to it
