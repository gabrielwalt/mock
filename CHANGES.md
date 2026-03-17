# ExMod UI Mock — Changes from Current UI

This document lists changes introduced in the UI mock compared to the current Experience Modernization Agent interface. It is structured as a list of issues so developers can execute them one by one. The mock is intended to kick off a conversation about how the interface should evolve.

**Try the mock:** https://gabrielwalt.github.io/mock/

---

## Mock Area Reference

Names for every panel, toolbar, and group in the mock. Use these when referring to locations in the change descriptions below.

| Name | Description |
|------|-------------|
| **Global header** | Top bar: Adobe logo, title, Request support, user avatar |
| **Chat panel** | Left panel: chat toolbar, messages, task list, queue, status bar, input |
| **Chat toolbar** | Top of chat panel: Home, Settings |
| **Chat messages** | Scrollable area with agent and user messages |
| **Task progress panel** | Collapsible panel: task list (pending, in-progress, completed), progress bar |
| **Completed tasks section** | Collapsible subsection within task progress: "2 completed" with expandable list |
| **Queue panel** | Collapsible panel for queued messages (when queue has items) |
| **Chat status bar** | Bottom bar above input: Tasks (2/9), Queue (0), Download, Clear |
| **Chat input** | Text area, disclaimer, and action buttons |
| **Plan/Execute mode switcher** | Two buttons in chat input: Plan mode, Execute mode |
| **Send/Interrupt slot** | Single slot: Send button, or Interrupt button when task is running |
| **Chat resize handle** | Vertical divider between chat panel and preview panel |
| **Preview panel** | Right panel: content toolbar and preview slot |
| **Content toolbar** | Top of preview panel: view switcher, toggle browser, filename, preview-only controls, Add to chat, Sync/Actions |
| **View mode dropdown** | Switches between Preview, Document, Code Files, Changes |
| **Toggle browser button** | Double-chevron button to show/hide the file browser |
| **Page title** | Filename display (plain text) next to toggle browser |
| **Toolbar preview-only** | Group shown only in Preview mode: Refresh, Viewport dropdown |
| **Viewport dropdown** | Desktop, Tablet, Phone options |
| **Add to chat button** | Adds current context to chat |
| **Content actions dropdown** | Sync button with Push content, Pull content, Delete page |
| **Code actions dropdown** | Sync button with Push/Pull code, GitHub info, Switch repo/branch |
| **Preview slot** | Area that holds the active view (content or code); swapped on mode change |
| **Content view** | Preview mode: document tree + page preview |
| **Document tree** | File browser: breadcrumbs, path dropdown, file list |
| **Tree breadcrumbs** | Content > path dropdown > current folder |
| **Breadcrumb path dropdown** | Collapsed folders between root and current path |
| **File list** | Scrollable list of folders and files in current path |
| **Page preview** | Iframe area showing the rendered page (or placeholder) |
| **Code view** | Code mode: code tree + changes + editor |
| **Code tree** | Workspace file tree (blocks, files) |
| **Code changes** | Diff/changes panel (or empty state) |
| **Code editor** | Source code display |

---

## Part A: Bigger Changes (Implemented in Mock)

### A1. Global layout — Single toolbar split into two parts

**Change:** The mock uses a single toolbar concept split into two parts: one above the chat panel (Home, Settings) and one above the content view (Preview switcher, Toggle browser, filename, Refresh, Viewport, Add to chat, Sync/Actions).

**Why:** To reduce toolbar proliferation and improve alignment.

---

### A2. Task list and chat actions moved to bottom status bar

**Change:** The task list, queue toggle, download chat, and clear chat have moved from the top of the chat panel to a **bottom status bar** above the message input. The bar shows:
- **Tasks (2/9)** — toggle to expand/collapse the task list (chevron: up when collapsed, down when expanded)
- **Queue (0)** — toggle to expand/collapse the message queue (when queue has items)
- **Download** and **Clear** buttons

**Why:** Keeps task progress and chat actions close to the input while freeing up space at the top. The task list unfolds above the status bar when expanded.

---

### A3. Toggle browser button separate from filename

**Change:** The current UI already uses only the chevron to toggle the file browser (the filename is display). The mock separates them visually: a dedicated **Toggle browser** button (double-chevron icon) sits after the view switcher, followed by a vertical separator, then the filename as plain text. Keyboard shortcut: **Ctrl+F**.

**Why:** Clear visual separation between the toggle control and the filename improves scannability and makes the filename read-only context.

---

### A4. Interrupt button in send slot

**Change:** When a task is running, the send button is **replaced** by an interrupt button (same circular shape, all black) in the same slot. Tooltips: "Interrupt all tasks" when showing interrupt; "Send" when empty; "Add to queue" when typing. When the user starts typing, the send button reappears (with "Add to queue" tooltip).

**Why:** Interrupt is always in the same place as send, reducing cognitive load and saving space.

---

### A5. Chat toolbar and message styling

**Change:** Above the chat, a simple toolbar with Home and Settings. Agent messages are not wrapped in bubbles; only user messages get a blue bubble.

**Why:** To avoid visual overload and make it easier to spot user messages when scrolling.

---

### A6. Single view switcher — content, document, code, and changes

**Change:** A single dropdown at the left of the content toolbar switches between content preview, document view, code files, and changes. Previously, there were two buttons in a vertical toolbar at the far left and a separate switcher in a horizontal toolbar at the far right.

**Why:** To consolidate view switching into one control, place it next to the panel it affects, and eliminate the split between left and right edges.

---

### A7. Breadcrumb order and root label

**Change:** Root folder renamed from "Workspace" to "Content". The breadcrumb dropdown (when multiple folders are collapsed between root and the current path) shows folders with **deepest at top, shallowest at bottom**—this inverted order is the same in both current UI and mock.

**Why:** To clarify the root label and align dropdown navigation with drill-down mental model.

---

### A8. Preview options and viewport

**Change:** Preview options are merged into the content toolbar. The Picker, Refresh, and Viewport icons only appear when the switcher is on "Preview"; they disappear when switching to "Document View". Viewport options (Desktop, Tablet, Phone) are grouped in a dropdown.

**Why:** To reduce clutter and show only relevant controls for the current mode.

---

### A9. Document actions menu

**Change:** Instead of "Upload Content", a more generic Actions menu. Besides push, an explicit "Sync" option to pull content. The menu also includes Delete.

**Why:** To support bidirectional content flow and to consolidate document operations in one place.

---

### A10. Code view and GitHub actions

**Change:** A GitHub Actions menu when switching to code view. GitHub info (user, repo, branch) is merged into the same menu. The "Add to chat" button is moved into the top menu.

**Why:** To consolidate GitHub-related controls and reduce toolbar sprawl.

---

## Part B: Further Changes (From Screenshot Comparison)

These are grouped by developer task. Implement each group as a single unit.

---

### B1. Left vertical navigation strip and global header

**Current:** Global header has a hamburger menu on the far left. A left vertical strip below/alongside contains: Adobe logo, Home, Document (highlighted when active), Code, and Settings icons. Document/Code switch the main content view.

**Change:** The mock uses a different layout—no separate left nav strip. Home and Settings are in the chat toolbar. Document/Code view switching is in the content toolbar dropdown. Decide whether to remove the left nav and hamburger entirely or adapt them to match the mock’s consolidated toolbar structure.

---

### B2. Content preview header layout

**Current:** Content toolbar has: breadcrumb (Workspace > destinations > bulgaria, with dropdown when multiple folders are collapsed), then chevron (toggle) + filename. Only the chevron toggles the file browser. Right side: Copy, Duplicate, Delete icons and "Upload content" button.

**Change:** Implement the mock layout: view switcher (Preview dropdown) at left, then Toggle browser button (chevron only, visually separate), vertical separator, filename as plain text. Move Copy, Duplicate, Delete into the Actions menu or another appropriate location. Replace "Upload content" with the Sync/Actions menu as in A9. Note: Current UI uses a dropdown picker when file browser is open; mock uses a persistent sidebar tree—decide which pattern to adopt.

---

### B3. Viewport toolbar position

**Current:** Old UI has a vertical toolbar on the right edge of the preview (desktop, tablet, phone, edit, refresh icons stacked vertically).

**Change:** Move viewport options into the main content toolbar as a dropdown (as in A8). Remove or relocate the standalone vertical toolbar. Consider whether Edit and Refresh stay in the toolbar or move elsewhere.

---

### B4. Chat input icons and layout

**Current:** Old UI has: paperclip, lightbulb, emoji, image, microphone, and red record/stop button next to the input.

**Change:** Align with mock: attachment, Plan/Execute mode switcher, send/interrupt slot. Remove or relocate emoji, image, and record button if they are not part of the new design. Ensure the Plan/Execute mode switcher is present.

---

### B5. Task progress section labeling and structure

**Current:** Task Progress at top of chat panel with "4/4 completed" and chevron; a nested "✓ 4 completed" subsection with its own chevron expands to show individual tasks. Green progress bar. Card-style layout. Chevron directions are inconsistent (main section vs subsection).

**Change:** Move to bottom status bar with "Tasks (2/9)" style labeling. Ensure chevron directions: Tasks/Queue buttons — up when collapsed, down when expanded; completed section — down when collapsed, up when expanded. Add animated collapse/expand for the task list and completed section.

---

### B6. Tooltips and keyboard shortcuts

**Current:** Tooltips may use plain text like "Ctrl+R".

**Change:** Use modifier key symbols (⌃ Ctrl, ⌘ Cmd, ⇧ Shift) in tooltips. Show shortcuts in a slightly lighter box within the tooltip. Add keyboard shortcuts for: Refresh (Ctrl+R), Add to chat (Ctrl+L), Toggle browser (Ctrl+F), Toggle task list (Ctrl+T), Toggle queue (Ctrl+M), Plan mode (Ctrl+P), Execute mode (Ctrl+E). Apply the same shortcut styling to all tooltips that show shortcuts.

---

### B7. Chevron direction and rotation

**Current:** Old UI has inconsistent chevron directions (e.g. Task Progress chevron points down when expanded).

**Change:** Standardize:
- **Tasks/Queue buttons:** Chevron points up when collapsed, down when expanded.
- **Completed tasks section:** Chevron points down when collapsed, up when expanded.
- **Toggle browser:** Chevron points right when panel is closed, left when open. Animate the rotation (0.2s ease).

---

### B8. Animations and transitions

**Change:** Add smooth animations for:
- Collapsing/expanding of task list, queue panel, and completed tasks section (max-height transition, 0.25s ease-out).
- Rotation of chevrons on Tasks, Queue, and Toggle browser buttons (0.2s ease).
- Any other collapsible panels (e.g. code tree, document tree).

---

### B9. UI polish and consistency

**Change:** Apply these in one pass:
- Add vertical separator between Toggle browser and filename (same style as separator between Home and Settings).
- Use consistent modifier symbols (⌃⇧1, ⌃⇧2, ⌃⇧3) in viewport dropdown shortcuts.
- Ensure tooltip shortcut styling (lighter background for shortcut box) is applied everywhere.
- Use the same stop icon (rounded rect) for the interrupt button.
- Ensure completed tasks section animates on expand/collapse.

---

### B10. Breadcrumb placement

**Current:** Breadcrumb (Workspace > destinations > bulgaria) appears in the content toolbar, to the left of the toggle+filename button.

**Change:** In the mock, the breadcrumb lives in the tree area above the file list, with "Content" as root (see A7). Decide whether to keep breadcrumb in the main toolbar or move it into the tree panel as in the mock.

---

## Part C: Summary Checklist

| # | Change | Status |
|---|--------|--------|
| A1 | Global layout — single toolbar split | In mock |
| A2 | Task list and chat actions at bottom | In mock |
| A3 | Toggle browser button | In mock |
| A4 | Interrupt in send slot | In mock |
| A5 | Chat toolbar and message styling | In mock |
| A6 | Single view switcher | In mock |
| A7 | Breadcrumb order and root label | In mock |
| A8 | Preview options and viewport | In mock |
| A9 | Document actions menu | In mock |
| A10 | Code view and GitHub actions | In mock |
| B1 | Left vertical nav strip | To implement |
| B2 | Content preview header layout | To implement |
| B3 | Viewport toolbar position | To implement |
| B4 | Chat input icons and layout | To implement |
| B5 | Task progress labeling and structure | To implement |
| B6 | Tooltips and keyboard shortcuts | To implement |
| B7 | Chevron direction and rotation | To implement |
| B8 | Animations and transitions | To implement |
| B9 | UI polish and consistency | To implement |
| B10 | Breadcrumb placement | To implement |
