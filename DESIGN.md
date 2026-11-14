# DESIGN.md — DeptEase (Student Department Management System)

## v2 — ROVA light system (current; supersedes v1 palette/type/shape)

**Reference (user-provided):** Dribbble shot "ROVA HR – Team & Department Management" by
Shahriar Sultan — saved at `/tmp/rova-shot.png` (read it). Light, clean, card-based product UI:
light-gray ground, white cards with soft shadows, near-black active pills, orange status chips,
big stat numbers in a divided summary card, pill filter rows, employee card grid.

### Palette (named roles — v2)

| Role | Hex | Use |
|---|---|---|
| ground | `#EFF0F2` | page background |
| plate | `#FFFFFF` | cards, panels, modals |
| ink | `#16181D` | primary text |
| muted | `#6E7178` | secondary text (AA on white and on ground) |
| line | `#E4E6EA` | borders; `#EEF0F3` row dividers |
| active | `#1A1D21` | active pills, icon buttons, primary CTAs — white text on it |
| accent | `#FFB020` | status chips, route line/marker, small highlights; as TEXT on white use `#B45309` (AA) |
| status-tint | `#FFF4E5` | chip backgrounds |

- Shadows: cards `border border-[#E4E6EA] shadow-[0_1px_3px_rgba(16,24,40,0.06)]`, hover
  `hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(16,24,40,0.10)]`.
- Modal scrims: `bg-black/40` + white `rounded-2xl` card.

### Inversion rules (v2, from the dark v1 pass)

- Dark grounds/surfaces (`#09090B`, `#0A0C0E`, `#111114`, `#14171A`) → ground/plate above.
- Amber that was an ACTIVE marker / primary CTA → **near-black pill `#1A1D21` + white text**
  (reference: dark "Team" pill, dark "All 8", dark "+" button).
- Amber that was STATUS/score/attention (ViewMarks high scores, badges) → orange system:
  tint bg `#FFF4E5`, text `#B45309`, outline `#E8833A`.
- Amber as route line / focus ring / accent rule / status dot → stays `#FFB020`.
- `text-white` on dark → `text-[#16181D]`; `text-zinc-400` → `text-[#6E7178]`;
  `border-white/*` → `border-[#E4E6EA]`; `bg-white/[0.04]` → white.
- `.text-gradient` → solid `#16181D`.
- First-visit curtain → ground `#EFF0F2`, ink type, amber route line (motion unchanged).

### Type (v2)

- Single family: **Plus Jakarta Sans** (Google Fonts `400;500;600;700;800`), replacing
  Overpass + Inter. Display headings `font-semibold/-bold`, tracking −0.02em; big stat numbers
  `text-4xl/5xl font-bold tracking-tight tabular-nums`; body 15px / 1.5; labels 12–13px `#6E7178`.

### Shape (v2)

- Cards/panels/inputs/modals: `rounded-2xl`. Buttons/tabs/filter chips/icon buttons/avatars:
  `rounded-full`. No other radii.

### Layout patterns from the reference (v2)

- **Department summary:** ONE white card split into 4 cells with vertical `#E4E6EA` dividers —
  small muted label, oversized ink number, muted unit word.
- **Filter row:** outlined pill filters (`rounded-full border border-[#E4E6EA]`), active pill
  is near-black; search input pill on the right.
- **Employee/student lists:** responsive card grid — white card, photo/monogram header or
  overlapping avatar, name (semibold) + role (muted), enrollment/ID chip, status chip, round
  outline action buttons — matching the reference's employee cards.
- Tables that stay tables (subjects, marks entry): white plate, muted uppercase 12px header,
  `#EEF0F3` row dividers, no zebra.

### Motion (carried over from v1, recolored)

- Expo-out `cubic-bezier(0.16,1,0.3,1)`; snaps 160ms; reveals 400–600ms; stagger 40–60ms.
- Route line (amber, draws on mount), traveling active-tab marker + idle pulse, Reveal
  plate-settle, CountUp stats, first-visit curtain ≤1.2s — all unchanged in behavior, gated on
  `prefers-reduced-motion`.

### QA bar

Zero audit FAILs, zero console errors, no overflow, no hidden text under reduced motion, zero
serious axe violations (contrast passes on light), visible focus everywhere, skip link first,
idle motion true, mobile LCP < 2.5s / CLS < 0.05, fresh critic ≥ 8/10 every category.

---

## v1 archive (superseded — kept for history)

Dark wayfinding concept: campus directory/signage; ground `#0A0C0E`, plate `#14171A`,
ink `#F2F4F5`, muted `#99A1A8`, accent amber `#FFB020`; Overpass display + Inter body; 10px
radius; "route and lock" motion verb. Three concepts scored (wayfinding 16 / roll book 16 /
branch 13); wayfinding won for usability synergy (wayfinding = know where you are in 3s = 30%
of the Awwwards score). The route-line signature, curtain and reveals survive into v2; only
skin, type and shape changed to match the user's ROVA reference.
