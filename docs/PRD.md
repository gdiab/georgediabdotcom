# AI-Powered Blog Platform - PRD

## Problem Statement
Manual blogging is time-intensive and inconsistent. Need an automated content generation system that produces high-quality draft posts across defined niches while maintaining editorial control.

## Product Vision
An AI-powered blog platform that automatically generates draft posts from news sources and manual prompts, allowing single-admin editorial oversight before publication.

## Core Features

### Content Generation
- **Automated Pipeline**: Daily scheduler pulls from RSS feeds, Google News queries, and manual prompts
- **AI Writing**: GPT-4o generates 800-1200 word articles with headlines, TLDR, body, outbound links
- **Image Generation**: DALL·E 3 creates hero images (1200×630) and thumbnails (512×512)
- **SEO Optimization**: Auto-generated meta tags, structured data, suggested tags

### Editorial Control
- **Draft Management**: Review, edit, accept, or reject generated content
- **Rich Editor**: TipTap-based editor for content refinement
- **Publishing Workflow**: Manual approval required before going live

### Public Site
- **Blog Pages**: Static-generated post pages with ISR
- **Static Pages**: About/Resume and social links
- **Performance**: Core Web Vitals compliant, minimal latency
- **SEO**: Automated sitemaps, RSS feeds, structured data

## Design Requirements

### Visual Design
- **Theme**: Default dark mode with monochrome palette
- **Layout**: Left-aligned inspired by Zach Holman's "Left" style
  - Fixed sidebar navigation (left)
  - Content area (right)
  - Full-height columns
- **Typography**: Yanone Kaffeesatz for headings, system fonts for body
- **Aesthetic**: Minimal ornamentation, high contrast, fast loading

### Responsive Design
- **Desktop**: Fixed sidebar layout
- **Mobile**: Sidebar collapses to top navigation

## User Stories

### As a Blog Owner
- I can define content niches (engineering leadership, tech trends, poker, cycling)
- I can review AI-generated drafts before publication
- I can edit drafts using a rich text editor
- I can manually trigger content generation
- I can manage my static pages (About/Resume)

### As a Blog Reader
- I can read articles with fast load times
- I can navigate easily on any device
- I can access social links

## Success Metrics
- **Performance**: LCP < 1.4s, CLS < 0.1
- **Content**: 5-10 candidate articles generated daily
- **Efficiency**: Manual blogging time reduced to near-zero
- **Quality**: High editorial acceptance rate of AI drafts

## Non-Functional Requirements
- Single-admin authentication (GitHub/Google OAuth)
- Privacy-first analytics (Vercel Analytics or Plausible)
- Mobile-responsive design
- Strong SEO optimization
- Security: CSP, environment variables, role-based access

## Out of Scope (V1)
- Multi-user/multi-admin support
- Advanced analytics dashboard
- Comment system
- Newsletter integration
- Custom domain management beyond Vercel defaults