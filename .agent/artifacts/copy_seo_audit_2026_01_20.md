# Overgrowth Copy & SEO Audit

**Date:** 2026-01-20  
**Auditor:** AI Marketing Agent (Copywriting + SEO-Audit Skills)

---

## Executive Summary

### Overall Assessment: **Strong Foundation, Refinement Opportunities**

The Overgrowth storefront has a **compelling brand voice** ("Recovered Archive" / "Institutional Scarcity") with excellent aesthetic execution. However, several SEO and copy optimizations will increase organic visibility and conversion.

### Top 5 Priority Issues

1. **SEO: Generic/boilerplate descriptions** in seo.server.ts (policies, collections)
2. **SEO: Missing meta descriptions** on Shipping, Size Guide pages
3. **Legal: Missing DBA disclosure** (Overgrowth is a DBA of Pixel Boba LLC)
4. **Copy: FAQ missing a question** in Returns section (item at index 1)
5. **Copy: Some headlines could be more benefit-driven**

### Quick Wins Identified

- Fix meta descriptions (immediate SEO impact)
- Add Pixel Boba LLC legal disclosure to policy display
- Strengthen CTAs on key pages
- Add FAQ schema markup for rich snippets

---

## Page-by-Page Audit

### 1. Homepage (`($locale)._index.tsx`)

**Copy Assessment: ★★★★☆ (Strong)**

**Strengths:**

- "In a world of infinite replicas, we choose scarcity" — excellent positioning
- Clear value props in StatsCards (50 Pieces Per Drop, 0 Restocks Ever, 100% Premium Cotton)
- Newsletter section is compelling

**Issues Found:**
| Issue | Severity | Fix |
|-------|----------|-----|
| "What We Stand For" headline is generic | Medium | Change to "Why We're Different" or "The Overgrowth Promise" |
| "Join The Archive" could be more action-oriented | Low | Consider "Get Early Access" |

**SEO Assessment:**

- ✅ Title/description set properly
- ✅ JSON-LD Organization schema present
- ⚠️ Consider adding FAQ schema for the brand pillars section

---

### 2. Our Story (`pages.our-story.tsx`)

**Copy Assessment: ★★★★★ (Excellent)**

**Strengths:**

- Strong emotional opening: "Born from a simple frustration"
- Excellent use of pull quote structure
- Clear chapter-based storytelling

**No major copy changes needed.** This page exemplifies the brand voice.

**SEO Assessment:**

- ✅ Title properly configured
- ⚠️ Consider adding Article schema

---

### 3. FAQ (`pages.faq.tsx`)

**Copy Assessment: ★★★★☆ (Strong with Minor Issues)**

**Critical Issue Found:**

```javascript
// Line 34, returnsInfo array - item at index 1 is MISSING the 'question' property!
{
  answer: 'If you receive a damaged or defective item...';
  // Missing: question: 'What if my item arrives damaged?'
}
```

**Recommended Improvements:**
| Current | Improved |
|---------|----------|
| "What is your return policy?" | "Do you accept returns?" (more conversational) |
| "How long does shipping take?" | "When will my order arrive?" (customer-focused) |

**SEO Assessment:**

- ⚠️ **Missing FAQ Schema** — High-impact opportunity for rich snippets

---

### 4. Contact (`pages.contact.tsx`)

**Copy Assessment: ★★★★☆ (Strong)**

**Strengths:**

- "Recovery Station" framing is on-brand
- Clear response time (24-48 hours)
- Social links present

**Minor Improvements:**
| Current | Improved |
|---------|----------|
| "Questions about artifacts, orders, or the archive?" | "Questions about your order? Need help with sizing?" (more specific) |
| Placeholder "Your message..." | "Tell us how we can help..." (warmer) |

**SEO Assessment:**

- ✅ Properly configured

---

### 5. Shipping & Returns (`pages.shipping.tsx`)

**Copy Assessment: ★★★★☆ (Strong)**

**Issues Found:**

- Same missing question issue as FAQ (returnsInfo[1] has no question field)

**SEO Assessment:**

- ⚠️ **Missing meta description** in the meta export
- Currently only has title, no description

---

### 6. Size Guide (`pages.size-guide.tsx`)

**Copy Assessment: ★★★★★ (Excellent)**

**Strengths:**

- Clear measurement instructions
- Model reference adds credibility
- Good fit notes at bottom

**SEO Assessment:**

- ⚠️ **Missing meta description** — only title set

---

### 7. Lookbook (`pages.lookbook.tsx`)

**Copy Assessment: ★★★★☆ (Strong)**

**Strengths:**

- "Season One" framing adds collectibility
- Good product-to-lookbook connection

**SEO Assessment:**

- ✅ Meta set via seoPayload.page

---

### 8. Policy Pages (`policies.$policyHandle.tsx` + `policies._index.tsx`)

**Critical Legal Issue:**
The policy display page does NOT include the required DBA disclosure:

> **Overgrowth is a DBA (Doing Business As) of Pixel Boba LLC**

**SEO Assessment:**

- ⚠️ seo.server.ts line 441: "Hydroge store policies" typo (should be "Overgrowth")
- ⚠️ seo.server.ts line 451: "Hydrogen store policies" (should be "Overgrowth")

---

## SEO Technical Findings

### seo.server.ts Issues

| Line | Issue                                                     | Fix                                                                                         |
| ---- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------ |
| 34   | titleTemplate '%s                                         | Overgrowth' is good                                                                         | ✅ No change |
| 64   | Home description could be more specific                   | Change to "Limited edition streetwear. Heavyweight cotton. Small batches. Never restocked." |
| 314  | listCollections description is "All hydrogen collections" | Change to "Browse Overgrowth's limited edition collections"                                 |
| 441  | "Hydroge store policies" typo                             | "Overgrowth store policies"                                                                 |
| 451  | "Hydrogen store policies"                                 | "Overgrowth store policies"                                                                 |

### Missing Meta Descriptions

| Page       | Current | Recommended                                                                                         |
| ---------- | ------- | --------------------------------------------------------------------------------------------------- |
| Shipping   | ❌ None | "Free shipping on orders $150+. Made to order, delivered in 3-4 weeks. All sales final."            |
| Size Guide | ❌ None | "Find your perfect fit. Relaxed, slightly oversized silhouettes. Size charts and model references." |

---

## Implementation Checklist

### Immediate Fixes (COMPLETED ✅)

- [x] Fix seo.server.ts typos and descriptions
  - Changed "Hydroge store policies" → "Overgrowth store policies"
  - Changed "Hydrogen store policies" → "Overgrowth store policies"
  - Improved home description
  - Fixed collections description from "All hydrogen collections"
- [x] Add meta descriptions to Shipping and Size Guide pages
- [x] Fix FAQ returnsInfo missing question property
- [x] Add Pixel Boba LLC disclosure to policy pages
  - Added "Overgrowth is a DBA of Pixel Boba LLC" footer text

### Copy Improvements (COMPLETED ✅)

- [x] Improved homepage headline: "What We Stand For" → "Why Collectors Choose Us"
- [x] Improved stats card descriptions to focus on customer outcomes
- [x] Improved newsletter section: "Join The Archive" → "Get First Access", "Never Miss A Drop" → "Drops Sell Out Fast"
- [x] Rewrote FAQ questions to be more conversational (e.g., "When will my order arrive?" instead of "How long does shipping take?")
- [x] Improved FAQ answers to address emotional concerns
- [x] Improved Contact page hero copy to be more helpful
- [x] Synced Shipping page copy with FAQ improvements

### Legal (Requires Shopify Admin)

- [ ] Update Privacy Policy in Shopify to include: "Overgrowth is a DBA of Pixel Boba LLC"
- [ ] Update Terms of Service in Shopify to include the same disclosure

---

## Brand Voice Reference

**The "Overgrowth" Voice:**

- Confident stillness (not hype)
- Archival / museum-like (not retail)
- Scarcity-driven (not urgency-driven)
- Quality-focused (not feature-focused)

**Words to Use:**

- Artifact, recover, archive, edition, limited, heavyweight, intentional

**Words to Avoid:**

- Sale, discount, limited time, hurry, exclusive (overused)
