Phase 1 (MVP multipurpose core)
- Add batteries/features:
  - alignment (left/center/right/justify)
  - table
  - image (insert by URL first, upload next phase)
  - taskList (checklist support)
  - horizontalRule
- Extend TextEditorFeatures and presets:
  - Add flags in extensions.ts
  - Update minimal | standard | full mappings
- Add toolbar groups/components:
  - AlignmentTools.tsx
  - TableTools.tsx
  - InsertTools.tsx (image/hr/task)
- Update Storybook:
  - dedicated stories per feature + “full multipurpose” story
Phase 2 (authoring ergonomics + workflow)
- Upgrade slash command:
  - searchable command list
  - keyboard navigation (up/down/enter/esc)
  - grouped commands (formatting, insert, structure)
- Improve bubble mode:
  - reusable BubbleToolbar component
  - hide link popover inside bubble when selection collapses
- Add counters:
  - optional word/char count footer battery
Phase 3 (production safety and consistency)
- Add strict content safety layer:
  - sanitize outgoing HTML (configurable allowlist)
  - enforce safe links (rel defaults)
- Add mode-aware schemas:
  - e.g. mode="notice" | "article" | "comment" maps to allowed features
- Add robust paste handling:
  - normalize pasted HTML
  - preserve/strip formatting option
Phase 4 (advanced multipurpose capabilities)
- Image upload pipeline:
  - async upload hook prop
  - loading/failed states
  - alt text + caption + alignment
- Better code blocks:
  - language selector
  - copy button
- Optional collaborative hooks:
  - comments, mentions (if needed later)
Implementation structure (so it stays maintainable)
- Keep current split and add:
  - features/ folder per battery
  - commands/ helpers for slash + toolbar actions
  - schema/ for mode/preset definitions
- Keep TextEditor.tsx as orchestration-only (no heavy UI logic)
Acceptance criteria
- Every feature can be toggled independently.
- Presets are deterministic and documented.
- Bubble toolbar and sticky toolbar work without overlap bugs.
- Storybook demonstrates each preset + each major feature battery.
- Build/typecheck passes; no dead props/placeholders.
