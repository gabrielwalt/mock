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

## Functional Behaviors (How Things Work)

Brief summary of toggle behaviors, button logic, and interactions in the mock. Use this when implementing the changes.

### Toggle browser button
- **Behavior:** Click toggles the document tree (content view) or code tree (code view) visibility. Chevron rotates: points left when tree is visible, right when collapsed. **Ctrl+F** triggers the same toggle.
- **State:** `aria-expanded="true"` when tree visible, `"false"` when collapsed.
- **Content vs Code:** In content view, toggles `preview-content.tree-collapsed`. In code view, toggles `preview-code.code-tree-collapsed`.

### View mode dropdown
- **Behavior:** Click opens dropdown; select Preview, Document, Code Files, or Changes. **Ctrl+Cmd+1** through **Ctrl+Cmd+4** switch modes directly.
- **Panel swap:** Preview/Document use the content panel (document tree + page preview); Code Files/Changes use the code panel (code tree + changes + editor). Panels are swapped in/out of the preview slot.
- **Toolbar visibility:** Refresh and Viewport dropdown appear only when mode is Preview; they hide for Document, Code Files, Changes. Content actions vs Code actions dropdown shown based on mode.

### Task progress panel (Tasks button)
- **Behavior:** Click "Tasks (2/9)" to expand/collapse the task list. Chevron: up when collapsed, down when expanded. **Ctrl+T** triggers toggle.
- **Mutual exclusion:** When expanding Tasks, if Queue is open, Queue collapses first (250ms delay), then Tasks expands.
- **When no task running:** Tasks button can be hidden; task list is empty.

### Queue panel (Queue button)
- **Behavior:** Click "Queue (0)" to expand/collapse. Shown only when queue has items. Chevron: up when collapsed, down when expanded. **Ctrl+M** triggers toggle.
- **Queue items:** Each item has expand/collapse, copy, send now, remove. Enter in empty input does nothing; with text, Enter adds to queue. Shift+Enter = new line.

### Completed tasks section
- **Behavior:** Click "2 completed" to expand/collapse the list of completed tasks. Chevron: down when collapsed, up when expanded. Animated max-height transition.

### Send / Interrupt slot
- **Behavior:** Single slot. When a task is running and input is empty: show **Interrupt** (black stop icon). When task stopped or user has typed text: show **Send**. Tooltip: "Send" when empty, "Add to queue" when typing.
- **Interrupt:** Stops task, clears task progress, re-enables Clear, shows Send again.

### Plan / Execute mode switcher
- **Behavior:** Two buttons; one active. Plan mode vs Execute mode affects how the agent processes prompts (mock does not implement backend logic).

### Breadcrumb path dropdown
- **Behavior:** When path has multiple folders between root and current, they collapse into a dropdown. Click trigger to open; select folder to navigate. Dropdown options ordered: deepest at top, shallowest at bottom.

### File list (document tree)
- **Behavior:** Click folder or file to select; selection updates Page title. Folders sorted before files; both sorted by name. Only files (not folders) drive the page preview when selected.

### Content actions dropdown / Code actions dropdown
- **Behavior:** Click Sync button to open. Options: Push content, Pull content, Delete page (content); Push code, Pull code, GitHub info, Switch repo/branch (code). Click outside to close.
- **Code actions:** Shows connection state (User, Repository, Branch). Logout disconnects; Reconnect restores.

### Chat resize handle
- **Behavior:** Drag to resize chat panel width. Affects the split between chat and preview panels.

### Chat scroll on task/queue expand
- **Behavior:** When task list or queue expands (reducing chat messages height), scroll position adjusts so visible content stays stable (bottom fixed when opening, top fixed when closing).

### Copy on chat messages
- **Behavior:** Each message has a copy button (visible on hover). Click copies message body to clipboard.

### Queue items (when queue has messages)
- **Behavior:** Each queued message: expand/collapse (for multi-line), copy, send now, remove. Send now moves message to chat and removes from queue.

---

## Part A: Bigger Changes (Implemented in Mock)

### A1. Global layout — Single toolbar split into two parts

**Change:** The mock uses a single toolbar concept split into two parts: one above the chat panel (Home, Settings) and one above the content view (Preview switcher, Toggle browser, filename, Refresh, Viewport, Add to chat, Sync/Actions).

**Why:** To reduce toolbar proliferation and improve alignment.

---

### A2. Task list and chat actions moved to bottom status bar

**Change:** The task list, queue toggle, download chat, and clear chat have moved from the top of the chat panel to a **bottom status bar** above the message input. The bar shows:
- **Tasks (2/9)** — toggle to expand/collapse the task list (chevron: up when collapsed, down when expanded). **Ctrl+T**. If Queue is open when expanding Tasks, Queue collapses first.
- **Queue (0)** — toggle to expand/collapse the message queue; shown only when queue has items. **Ctrl+M**.
- **Download** and **Clear** buttons — Download disabled when no messages; Clear disabled when chat empty.

**Why:** Keeps task progress and chat actions close to the input while freeing up space at the top. The task list unfolds above the status bar when expanded.

---

### A3. Toggle browser button separate from filename

**Change:** The current UI already uses only the chevron to toggle the file browser (the filename is display). The mock separates them visually: a dedicated **Toggle browser** button (double-chevron icon) sits after the view switcher, followed by a vertical separator, then the filename as plain text. **Behavior:** Click toggles document tree (content view) or code tree (code view). Chevron rotates: left when tree visible, right when collapsed. **Ctrl+F** triggers toggle.

**Why:** Clear visual separation between the toggle control and the filename improves scannability and makes the filename read-only context.

---

### A4. Interrupt button in send slot

**Change:** When a task is running, the send button is **replaced** by an interrupt button (same circular shape, all black) in the same slot. **Behavior:** Show Interrupt when task running and input empty; show Send when task stopped or user has typed. Tooltips: "Interrupt all tasks" / "Send" / "Add to queue" (when typing). Interrupt stops the task, clears task progress, re-enables Clear, and shows Send again.

**Why:** Interrupt is always in the same place as send, reducing cognitive load and saving space.

---

### A5. Chat toolbar and message styling

**Change:** Above the chat, a simple toolbar with Home and Settings. Agent messages are not wrapped in bubbles; only user messages get a blue bubble.

**Why:** To avoid visual overload and make it easier to spot user messages when scrolling.

---

### A6. Single view switcher — content, document, code, and changes

**Change:** A single dropdown at the left of the content toolbar switches between content preview, document view, code files, and changes. **Behavior:** Preview and Document use the content panel (document tree + page preview); Code Files and Changes use the code panel (code tree + changes + editor). Panels are swapped in/out of the preview slot. **Ctrl+Cmd+1** through **Ctrl+Cmd+4** switch modes directly.

**Why:** To consolidate view switching into one control, place it next to the panel it affects, and eliminate the split between left and right edges.

---

### A7. Breadcrumb order and root label

**Change:** Root folder renamed from "Workspace" to "Content". The breadcrumb dropdown (when multiple folders are collapsed between root and the current path) shows folders with **deepest at top, shallowest at bottom**—this inverted order is the same in both current UI and mock.

**Why:** To clarify the root label and align dropdown navigation with drill-down mental model.

---

### A8. Preview options and viewport

**Change:** Preview options are merged into the content toolbar. **Behavior:** Refresh and Viewport dropdown appear only when view mode is Preview; they hide for Document, Code Files, Changes. Viewport options (Desktop, Tablet, Phone) are in a dropdown. **Ctrl+R** for Refresh. Viewport shortcuts: **Ctrl+Shift+1/2/3** for Desktop/Tablet/Phone.

**Why:** To reduce clutter and show only relevant controls for the current mode.

---

### A9. Document actions menu

**Change:** Instead of "Upload Content", a more generic Actions menu (Sync button with dropdown). **Behavior:** Click Sync to open; options: Push content, Pull content, Delete page. Click outside to close. Content actions shown in Preview/Document mode; Code actions (with GitHub info) shown in Code Files/Changes mode.

**Why:** To support bidirectional content flow and to consolidate document operations in one place.

---

### A10. Code view and GitHub actions

**Change:** A GitHub Actions menu when switching to code view. **Behavior:** Code actions dropdown shows Push code, Pull code, User/Repo/Branch labels, Switch repository, Switch branch, Logout, Reconnect. Connection state toggles: Logout shows "not connected"; Reconnect restores. Add to chat button stays in the content toolbar; adds current context (file/page) to chat. **Ctrl+L** for Add to chat.

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

**Change:** Implement the mock layout: view switcher (Preview dropdown) at left, then Toggle browser button (chevron only, visually separate), vertical separator, filename as plain text. Move Copy, Duplicate, Delete into the Actions menu or another appropriate location. Replace "Upload content" with the Sync/Actions menu as in A9. **Behavior:** Page title updates when selected file changes in document tree or code tree. Note: Current UI uses a dropdown picker when file browser is open; mock uses a persistent sidebar tree—decide which pattern to adopt.

---

### B3. Viewport toolbar position

**Current:** Old UI has a vertical toolbar on the right edge of the preview (desktop, tablet, phone, edit, refresh icons stacked vertically).

**Change:** Move viewport options into the main content toolbar as a dropdown (as in A8). Remove or relocate the standalone vertical toolbar. Consider whether Edit and Refresh stay in the toolbar or move elsewhere.

---

### B4. Chat input icons and layout

**Current:** Old UI has: paperclip, lightbulb, emoji, image, microphone, and red record/stop button next to the input.

**Change:** Align with mock: attachment, Plan/Execute mode switcher, send/interrupt slot. Remove or relocate emoji, image, and record button if they are not part of the new design. Ensure the Plan/Execute mode switcher is present. **Behavior:** Plan/Execute are two mutually exclusive buttons. Send/Interrupt share one slot: Interrupt when task running and input empty; Send otherwise. Enter with text adds to queue (or sends; mock uses queue); Shift+Enter = new line. Textarea auto-grows 1–12 lines, then scrolls.

---

### B5. Task progress section labeling and structure

**Current:** Task Progress at top of chat panel with "4/4 completed" and chevron; a nested "✓ 4 completed" subsection with its own chevron expands to show individual tasks. Green progress bar. Card-style layout. Chevron directions are inconsistent (main section vs subsection).

**Change:** Move to bottom status bar with "Tasks (2/9)" style labeling. Ensure chevron directions: Tasks/Queue buttons — up when collapsed, down when expanded; completed section — down when collapsed, up when expanded. Add animated collapse/expand (max-height transition 0.25s). **Behavior:** When expanding Tasks, if Queue is open, collapse Queue first (250ms), then expand Tasks. Chat scroll stays stable when panels expand/collapse.

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
