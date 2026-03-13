# AEM Experience Modernization Console – Mock

This project is a **standalone HTML mock** of the Adobe Experience Manager (AEM) **Experience Modernization (ExMod) Console** UI.

## What it is

A single-file, fully self-contained prototype that mimics the ExMod console shell:

- **Global header** – Adobe branding, Request support, user avatar
- **Left nav sidebar** – Home, Tasks, Documents, Settings
- **Task Progress panel** – Collapsible task list with progress bar
- **Chat panel** – Messages, input, mode switcher (Plan/Execute)
- **Preview panel** – Toolbar, document tree, view modes, iframe placeholder

The mock uses Adobe Spectrum design tokens (light theme) and is intended for UI prototyping, demos, and design alignment.

## Usage

Open `index.html` in a browser. No build step or server required.

---

## Development Guidelines for index.html

Follow these rules to keep edits consistent.

### Self-containment

- **No external assets.** All CSS, SVGs, and scripts live inside `index.html`.
- **Inline SVGs only.** Use `<svg>...</svg>` for icons; never `<img src="...">`.
- **No external stylesheets or scripts.**

### CSS – Use Spectrum Tokens

- **Prefer tokens over raw values.** Use `var(--spectrum-*)` instead of hardcoded colors, sizes, or spacing.
- **Colors:** `var(--spectrum-gray-*)`, `var(--spectrum-blue-*)`, `var(--spectrum-green-600)`, etc. Never use `#fff`, `white`, `rgb(...)`.
- **Spacing:** `var(--spectrum-spacing-75)` through `var(--spectrum-spacing-500)`.
- **Sizes:** `var(--spectrum-component-height-100)`, `var(--spectrum-icon-size-100)`, `var(--spectrum-static-size-200)`, etc.
- **Typography:** `var(--spectrum-font-size-*)`, `var(--spectrum-medium-font-weight)`, `var(--spectrum-bold-font-weight)`.
- **Borders:** `var(--spectrum-border-width-100)`, `var(--spectrum-corner-radius-100)`.
- **Focus:** `var(--spectrum-focus-indicator-color)`, `var(--spectrum-focus-indicator-thickness)`, `var(--spectrum-focus-indicator-gap)`.
- **Add new tokens in `:root`** if a value is reused; avoid one-off magic numbers.

### CSS – Structure and Naming

- **No duplicate properties** in the same rule block.
- **Class names:** Use BEM-like patterns (e.g. `.chat-toolbar`, `.chat-toolbar-btn`, `.task-item-completed`).
- **Group related rules** with section comments (e.g. `/* === PREVIEW PANEL === */`).
- **Transitions:** Use `0.13s ease-out` for Spectrum-style interactions.

### HTML – Structure

- **Preserve the ExMod layout:** header, nav, Task Progress, chat, preview. Do not remove or reorder major sections.
- **Preview iframe:** Keep it empty or a minimal placeholder. No real page content inside.
- **Accessibility:** Use `aria-label`, `aria-expanded`, `role` where appropriate. Add `focusable="false"` and `aria-hidden="true"` to decorative SVGs.

### Icons

- **Inline SVG format:** `<svg viewBox="0 0 20 20" focusable="false" aria-hidden="true" role="img"><path fill="currentColor" d="..."/></svg>`
- **Outline icons:** Add `class="spectrum-icon-outline"` and use `stroke` instead of `fill` where the design uses outlines.
- **Sizing:** Icons inherit from parent; parent uses `var(--spectrum-icon-size-100)` or `var(--spectrum-static-size-200)`.

### JavaScript

- **Vanilla JS only.** No frameworks or external libraries.
- **Event handlers:** Prefer `addEventListener`; use `id` or `data-*` for targeting when needed.
- **Cleanup:** Remove listeners on teardown (e.g. `mouseup` after drag) to avoid leaks.

### Do Not

- Add external CSS, images, or script files.
- Use hardcoded colors, pixel values, or font sizes when a token exists.
- Introduce duplicate CSS properties in the same rule.
- Add content inside the preview iframe beyond a placeholder.
- Remove or rename major layout sections (header, nav, Task Progress, chat, preview).
