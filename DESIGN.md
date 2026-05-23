# Design System Inspired by Fluid Glass

## 1. Visual Theme & Atmosphere

Fluid Glass embodies a minimalist, contemporary aesthetic centered on precision and transparency. The design system exudes sophistication through restrained color usage, geometric clarity, and generous whitespace. The brand communicates structural integrity and architectural expertise via a clean, understated visual language where typography and negative space dominate. The palette—predominantly charcoal and white with warm neutral accents—creates a premium, professional atmosphere that conveys both technical expertise and refined taste. This is a system built for architectural and structural solutions, where every element communicates confidence through simplicity.

**Key Characteristics**
- Minimalist, monochromatic foundation with selective warm neutrals
- Geometric precision and clean typography
- Generous whitespace and breathing room
- High contrast for clarity and legibility
- Serif-free modernism with technical typefaces
- Refined, architectural approach to visual communication

## 2. Color Palette & Roles

### Primary
- **Dark Charcoal** (`#212325`): Primary text, buttons, primary interface elements; the dominant color anchoring the brand identity
- **Deep Black** (`#0B1012`): High-contrast headings and emphasis elements; used sparingly for maximum impact

### Neutral Scale
- **White** (`#F1F1F1`): Primary background, card surfaces, text on dark backgrounds
- **Warm Beige** (`#F3F0EC`): Subtle background tint, secondary surface layers
- **Taupe** (`#D4CEC6`): Border accents, dividers, soft text on light backgrounds

### Interactive
- **Button Dark** (`#0B1012`): Primary button fill, high-contrast CTAs
- **Button Text Light** (`#F1F1F1`): Text on dark button backgrounds

### Surface & Borders
- **Surface Default** (`#F1F1F1`): Primary card and container backgrounds
- **Surface Subtle** (`#F3F0EC`): Secondary container tint
- **Border Neutral** (`#D4CEC6`): Subtle dividers and border strokes

## 3. Typography Rules

### Font Family
**Primary:** Aeonik Pro, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
**Secondary:** Aeonik Mono, "SF Mono", Monaco, monospace

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|---|---|
| Display / Hero | Aeonik Pro | 57.6px | 400 | 57.6px | normal | Large-scale brand moments |
| H1 / Page Title | Aeonik Pro | 36px | 400 | 36px | normal | Primary headings |
| H2 / Section Head | Aeonik Mono | 12.6px | 600 | 16.38px | normal | Secondary headings, emphasis |
| H3 / Subhead | Aeonik Pro | 18px | 400 | normal | normal | Card titles, subsections |
| Body / Paragraph | Aeonik Pro | 16px | 400 | 24px | normal | General content text |
| Button Label | Aeonik Mono | 10.8px | 500 | 9px | normal | All button text |
| Link / Navigation | Aeonik Pro | 9px | 400 | normal | normal | Navigation items, hyperlinks |
| Caption | Aeonik Mono | 10.8px | 500 | 9px | normal | Fine-print, metadata |
| Code | Aeonik Mono | 12px | 400 | 16px | 0.5px | Monospace inline and blocks |

### Principles
- **Restraint & Clarity:** Two typeface families create visual hierarchy without complexity. Aeonik Pro conveys warmth and readability; Aeonik Mono adds technical precision.
- **Weight over Size:** Font weight differentiation is prioritized to avoid excessive size jumps, maintaining visual cohesion.
- **Generous Line Height:** All text uses comfortable leading to ensure readability and premium feel across devices.
- **Architectural Language:** Typography mirrors the brand's focus on structure—clean, geometric, and purposeful.

## 4. Component Stylings

### Buttons

#### Primary Button
- **Background:** `#0B1012`
- **Text Color:** `#F1F1F1`
- **Font:** Aeonik Mono, `10.8px`, weight `500`
- **Padding:** `13.5px 21.6px`
- **Border Radius:** `0px`
- **Border:** `0px none`
- **Line Height:** `9px`
- **Min Height:** `36.89px`
- **Hover State:** Background `#212325`, shadow `0px 4px 12px rgba(0, 0, 0, 0.15)`
- **Active State:** Background `#050607`, shadow `0px 2px 6px rgba(0, 0, 0, 0.1)`

#### Secondary Button
- **Background:** `transparent`
- **Text Color:** `#212325`
- **Font:** Aeonik Mono, `10.8px`, weight `500`
- **Padding:** `13.5px 0px`
- **Border Radius:** `0px`
- **Border:** `0px none`
- **Line Height:** `9px`
- **Min Height:** `36.89px`
- **Hover State:** Text color `#0B1012`, underline `1px solid #212325`
- **Active State:** Text color `#0B1012`, opacity `0.7`

#### Icon Button
- **Background:** `transparent`
- **Icon Color:** `#F1F1F1`
- **Font Size:** `9px`
- **Padding:** `0px`
- **Dimensions:** `45px × 45px`
- **Border Radius:** `0px`
- **Line Height:** `normal`
- **Hover State:** Icon opacity `0.7`
- **Active State:** Icon opacity `0.5`

### Cards & Containers

#### Standard Card
- **Background:** `#F1F1F1`
- **Border:** `1px solid #D4CEC6`
- **Border Radius:** `0px`
- **Padding:** `32px`
- **Box Shadow:** none
- **Text Color:** `#212325`

#### Subtle Card
- **Background:** `#F3F0EC`
- **Border:** `none`
- **Border Radius:** `0px`
- **Padding:** `28px`
- **Box Shadow:** none
- **Text Color:** `#212325`

#### Hero Container
- **Background:** `#F1F1F1`
- **Min Height:** `400px`
- **Padding:** `72px 40px`
- **Display:** Flex, centered
- **Text Color:** `#212325`

### Inputs & Forms

#### Text Input
- **Background:** `#F1F1F1`
- **Border:** `1px solid #D4CEC6`
- **Border Radius:** `0px`
- **Padding:** `12px 16px`
- **Font:** Aeonik Pro, `16px`, weight `400`
- **Text Color:** `#212325`
- **Placeholder Color:** `#D4CEC6`
- **Focus State:** Border color `#212325`, outline `none`, shadow `0px 0px 0px 2px rgba(33, 35, 37, 0.1)`

#### Label
- **Font:** Aeonik Mono, `10.8px`, weight `500`
- **Color:** `#212325`
- **Margin Bottom:** `8px`
- **Line Height:** `9px`

### Navigation

#### Main Navigation Menu
- **Background:** `transparent`
- **Text Color:** `#F1F1F1`
- **Font:** Aeonik Pro, `9px`, weight `400`
- **Padding:** `0px`
- **Line Height:** `normal`
- **Spacing Between Items:** `32px`
- **Active Link:** Text color `#F1F1F1`, underline `1px solid #F1F1F1`
- **Hover State:** Text opacity `0.7`

#### Navigation Link
- **Text Color:** `#F1F1F1`
- **Font:** Aeonik Pro, `9px`, weight `400`
- **Decoration:** none
- **Hover State:** Opacity `0.7`, underline `1px solid #F1F1F1`
- **Active State:** Underline `2px solid #F1F1F1`

## 5. Layout Principles

### Spacing System
Base unit: `4px`. All spacing derives from multiples of this foundation.

**Scale & Usage:**
- `4px`: Micro-adjustments, component internal padding
- `8px`: Icon spacing, compact element gaps
- `12px`: Form label spacing, button internal padding
- `20px`: Component margins, section dividers
- `28px`: Card padding, medium gaps
- `32px`: Container padding, content margins
- `36px`: Section margins
- `40px`: Large padding, container insets
- `44px`: Content spacing
- `56px`: Module padding
- `64px`: Major section breaks
- `72px`: Hero and banner padding

### Grid & Container
- **Max Width:** `1200px` (inferred from architectural glazing portfolio context)
- **Column Strategy:** 12-column grid with flexible gutters
- **Section Pattern:** Full-width sections with contained content via `max-width: 1200px; margin: 0 auto; padding: 0 40px`
- **Breakpoint Considerations:** Desktop-first approach with progressive content reduction

### Whitespace Philosophy
Generous negative space is fundamental to Fluid Glass's visual language. Whitespace creates breathing room, emphasizes content hierarchy, and communicates premium positioning. Margins and padding are purposefully abundant rather than minimal, reinforcing the architectural and transparent nature of the brand. Every layout element is surrounded by intentional space to maximize visual clarity and user focus.

### Border Radius Scale
- **Sharp (0px):** All buttons, inputs, cards, containers—reflecting geometric precision
- No rounded corners employed; the design system maintains right angles throughout for technical authenticity

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | No shadow (`box-shadow: none`) | Cards, containers, primary surfaces |
| Hover | `0px 4px 12px rgba(0, 0, 0, 0.15)` | Interactive button hover states |
| Active | `0px 2px 6px rgba(0, 0, 0, 0.1)` | Active button and pressed states |
| Modal | `0px 8px 24px rgba(0, 0, 0, 0.2)` | Modals, dropdowns, floating elements |

**Shadow Philosophy:** The Fluid Glass system employs minimal shadow usage to maintain the clean, architectural aesthetic. Shadows are applied subtly only to interactive elements during engagement states, avoiding visual clutter. The design prefers border and color contrast over depth cues, reinforcing the transparent and straightforward nature of the brand. Shadows, when used, are soft and diffuse rather than sharp, supporting the "fluid" metaphor.

## 7. Do's and Don'ts

### Do
- Use Aeonik Pro for all body copy and primary headings—it conveys warmth and legibility
- Maintain sharp 0px border-radius across all interactive components for geometric consistency
- Employ generous whitespace; prioritize breathing room over content density
- Use `#212325` as the default text color on light backgrounds for optimal contrast without harsh blacks
- Group related elements with consistent `28px` to `32px` padding and spacing
- Style primary CTAs with `#0B1012` background and `#F1F1F1` text for maximum visual hierarchy
- Keep hover states subtle (opacity or soft shadow shifts) rather than dramatic color changes
- Use Aeonik Mono exclusively for button labels, captions, and secondary headings to add technical precision

### Don't
- Apply rounded corners (`border-radius > 0px`) to any component; the system is strictly geometric
- Use multiple accent colors; stick to the monochromatic foundation with warm neutral accents only
- Overcrowd layouts; rely on whitespace to guide visual hierarchy
- Apply drop shadows to static, non-interactive elements
- Mix typeface weights erratically; reserve weight changes for semantic hierarchy only
- Use decorative icons or illustrations; maintain the minimal, professional tone
- Apply text transformations (all-caps, all-lowercase) beyond semantic button labels
- Use color alone to convey interactive state; always include opacity or shadow changes

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|---|
| Desktop | ≥ 1024px | Full layout, 12-column grid, `max-width: 1200px`, padding `40px` |
| Tablet | 768px – 1023px | 8-column grid, padding `32px`, reduced font sizes by 10%, spacing scale reduced to 90% |
| Mobile | < 768px | Full-width single column, padding `20px`, font sizes reduced 15–20%, spacing scale 75%, navigation collapses to stacked layout |

### Touch Targets
- **Minimum Interactive Size:** `44px × 44px` (buttons, links, icon buttons)
- **Minimum Spacing Between Targets:** `8px` on mobile, `12px` on tablet and above
- **Button Padding Adjustment on Mobile:** `12px 16px` (reduced from `13.5px 21.6px` on desktop)

### Collapsing Strategy
- **Typography:** Reduce heading sizes proportionally (H1: 36px desktop → 28px mobile); maintain body at minimum 16px
- **Spacing:** All margin/padding values scale by 75% on mobile, 90% on tablet
- **Navigation:** Horizontal menu becomes vertical stacked list on mobile; menu icon triggers off-canvas drawer
- **Cards:** `32px` desktop padding reduces to `20px` on mobile; switch from 2-3 column grids to single column
- **Images:** Full-width on mobile with aspect-ratio maintenance; max-width constraints removed

## 9. Agent Prompt Guide

### Quick Color Reference
- **Primary CTA / Button Fill:** Dark Charcoal (`#0B1012`)
- **Button Text:** White (`#F1F1F1`)
- **Primary Text / Body:** Dark Charcoal (`#212325`)
- **Background / Surface:** White (`#F1F1F1`)
- **Secondary Surface:** Warm Beige (`#F3F0EC`)
- **Borders / Dividers:** Taupe (`#D4CEC6`)
- **Heading Text:** Dark Charcoal (`#212325`)
- **Navigation Text:** White (`#F1F1F1`)

### Iteration Guide

1. **All components default to sharp corners:** `border-radius: 0px` everywhere. No rounded buttons, cards, or inputs.

2. **Typography is binary:** Use Aeonik Pro for narrative content (headings, body, links); use Aeonik Mono exclusively for buttons, captions, and metadata. Weight contrast (400 vs. 500/600) signals hierarchy.

3. **Color palette is monochromatic-plus:** Dark charcoal (`#212325`), near-black (`#0B1012`), white (`#F1F1F1`), and warm neutrals (`#F3F0EC`, `#D4CEC6`). No additional colors. All new elements must use this palette.

4. **Spacing is intentional and generous:** Base unit is `4px`. Never compress layouts; always use multiples of the scale (20px, 28px, 32px, 40px, 56px, 64px, 72px). Whitespace is a design feature.

5. **Interactive feedback is subtle:** Use opacity shifts, text-color changes, or soft shadows (`0px 4px 12px rgba(0, 0, 0, 0.15)`) for hover/active states. Avoid dramatic color changes or high-contrast overlays.

6. **Shadows are rare:** No shadows on static elements. Apply only to hover states of interactive components or floating elements (modals, dropdowns) with diffuse, soft shadows under `0.2` opacity.

7. **Primary buttons are dark-filled, secondary buttons are text-only:** Primary = `#0B1012` background + `#F1F1F1` text + Aeonik Mono 10.8px 500. Secondary = transparent background + `#212325` text + no border or minimal underline.

8. **Navigation and links on dark backgrounds use white:** `#F1F1F1` text on `#0B1012` or dark containers. Maintain `9px` font size and `normal` line height for nav items.

9. **Mobile breakpoint:** Below 768px, reduce all padding/margin to 75% of desktop scale, collapse multi-column grids to single column, stack navigation vertically, reduce font sizes 15–20%.

10. **Form inputs mirror the component system:** `#F1F1F1` background, `1px solid #D4CEC6` border, `0px` border-radius, `12px 16px` padding, focus state adds `2px rgba(33, 35, 37, 0.1)` outline shadow, no visual focus ring.