# HTML Scaffolding Experiment

An experiment in scaffolding an HTML page to match reference screenshots. This is a **UI prototyping and visual-alignment task**, not a website migration.

## Claude Code Instructions

See **[CLAUDE.md](./CLAUDE.md)** for essential instructions. Full protocol: [AGENT_PROTOCOL.md](./AGENT_PROTOCOL.md).

## Reference

**Screenshots** (`screenshots/`):

- **content-view.png** – Article content in a focused view
- **page-view.png** – Full page including header, breadcrumbs, and article

Both depict a UPS press release article: *"UPS Accelerates Intra-Asia Trade With Capacity and Speed Enhancements to Its Air Network"*.

**HTML export** (`html/`): The content in this folder was **exported from the actual Experience Modernization UI** using Chrome’s “Save page as.” That export is the UI we want to restyle to match the screenshots. It may be incomplete because Chrome export does not reliably capture iframes or runtime state.

## Output

- **index.html** – Standalone prototype that replicates the layout and styling from the screenshots

## Usage

Open `html/index.html` in a browser to view the scaffolded page. The page is self-contained with embedded styles for easy experimentation.

## Provenance (for agent updates)

After implementing or refining the prototype, update this section:

| Aspect | Source | Notes |
|--------|--------|-------|
| **Derived from HTML** | Exported CSS (`styles.css`, `header.css`, `article-header.css`, `breadcrumb.css`, `social-share.css`, `footer.css`, `lazy-styles.css`) and article HTML (`ups-accelerates-...html`) | CSS custom properties, design tokens, spacing scale, color palette, font sizes, heading weights, breadcrumb separator technique (slanted border), article body 2-column grid layout, social share icon SVG data URIs, footer 4-column structure with dark theme, legal section markup, full article body text and section headings |
| **Inferred from screenshots** | `content-view.png`, `page-view.png` | Header height and alignment, nav gold-bar hover indicator on "Newsroom", eyebrow gold dash sizing, article title at 56px/72px line-height, byline uppercase styling, subtitle italic muted, hero image full-width, bullet items italic, 2/3–1/3 body/social-share split, footer visual hierarchy |
| **Approximate** | Header logo, nav interactions, icon font glyphs | UPS shield logo uses remote SVG with text fallback (may not load). Search icon uses inline SVG instead of `upspricons` font. Footer social icons use Feather-style SVGs instead of `upspricons` font glyphs. Nav dropdown/mega-menu interactions not implemented (static prototype). |
| **Replace with real app code** | Logo asset, icon font, JS interactivity | Replace fallback logo with local SVG asset. Replace SVG icon approximations with actual `upspricons` web font. Add JavaScript for nav dropdown/accordion, search overlay, language selector. Wire up social share links with real share URLs. Connect footer subscribe form to backend. |
