# Brand values — raw palette for non-web files (PowerPoint, Word, PDF, Keynote)

Use this when the output is **not a web page** and cannot use CSS. A `.pptx` / `.docx` / slide colours its shapes with **RGB fills** — there is no stylesheet. These are the same brand colours `get_stylesheet` ships, given as plain hex so you can paint them directly.

**A deck can't toggle themes — so the deck carries both modes deliberately.** Data/content slides stay **light** (tables and charts must survive any projector). Statement pages (cover, dividers, verdicts) may be **gold or dark** — mixing dark statement pages between light content pages gives the deck both modes and a rhythm. Palettes for all three page types below.

**Font:** Roboto. If the deck tool doesn't have Roboto, fall back to **Arial** or **Calibri** (do not substitute a serif).

## Core palette (hex — use as fills / text colours)

| Role | Hex | Use it for |
|---|---|---|
| Brand gold | `#f5bf2d` | THE accent (the 10%) on **data slides**: table header, one highlight. Not the majority of a *data* slide. |
| Text on gold | `#111111` | Any text or icon sitting on a gold fill. Never white on gold. |
| Gold (bright) | `#ffce00` | **Full-bleed statement pages — encouraged, not just allowed.** See below. |

## Statement pages — full-bleed gold or dark (encouraged)

The **title/cover slide, section dividers, and any single-message moment** (one big stat, a verdict, a key takeaway) should be a **full-bleed statement page** — either **gold** (`#ffce00`, dark `#111` text) or **dark** (see palette below). This is the brand's hero move — a timid gold *band* floating on white reads as unfinished; commit to the full page.

**Normal pages are NOT statement pages.** Every data/content slide follows **60/30/10** exactly as on the web: ~60% white base, ~30% neutral surfaces (the banded table), ~10% gold (the header row or one highlight). The statement pages are the exception, not the norm — a deck is mostly light content pages punctuated by the odd gold or dark moment.

The gate is **text volume, not gold amount**:
- **One message, minimal text** (a title + subtitle, one number + label) → full-bleed statement page. Encouraged.
- **Actual content** (tables, charts, paragraphs, lists) → light page, gold stays at the header/one highlight.

**Dark statement page palette** (this is how a deck gets "dark mode" without a toggle):
| Role | Hex |
|---|---|
| Background | `#0c0100` |
| Title / big number | `#ffce00` (gold) or `#f2dcac` (cream) |
| Body / subtitle | `#f2dcac` |
| Muted caption | `#d1bb8c` |
| Hairline on dark | `#3c2b00` |
| Good / bad on dark | `#82e0a1` / `#ff7772` |

Suggested rhythm: **gold cover → light content slides → dark section dividers → dark or gold closing verdict.** Rough shape of any statement page: text anchored low-left poster-style, small brand mark top-left, lots of empty background. Never white text on gold, never a data table on a gold OR dark page.
| Page / slide bg | `#ffffff` | Slide background, table body row A. |
| Surface band | `#f2f2f2` | Alternating table row B, panel fills. |
| Surface (deeper) | `#e4e4e4` | A slightly stronger panel / grouping. |
| Text (primary) | `#0c0100` | Headings and body text on white. |
| Text (muted) | `#3c2b00` | Captions, secondary labels, axis labels. |
| Hairline / border | `#bebebe` | Table separators, box outlines. 1px equivalent. |

## Semantic colours (encode meaning — use them, don't default to grey)

| Meaning | Text hex | Fill hex (chip/cell) | Use it for |
|---|---|---|---|
| Good / up / on-track | `#1f8a3b` (text `#052e15`) | `#e0efe4` | Improvement, positive delta, healthy status |
| Bad / down / at-risk | `#9d0000` | `#f1dbdb` | Decline, negative delta, failing status |
| Warning / watch | `#6b3f00` | `#f4eadb` | Caution — a burnt orange, deliberately NOT the brand gold |
| Informational | `#08395f` | `#dbe9f8` | Neutral callout, "for reference" |

Amber is `#b06a00`-family, not the brand gold — keep status and brand visually separate, exactly as in the web system.

## Table recipe (the thing that comes out "too grey")

- **Header row:** fill `#f5bf2d`, text `#111`, bold. Not grey.
- **Body rows:** alternate `#ffffff` / `#f2f2f2`. Identical flat-grey rows are the most common complaint.
- Separators `#bebebe`; numbers right-aligned + tabular; labels left-aligned.
- At most one gold moment per slide (header OR one highlighted figure, not everything).

## Component recipes — what the shapes look like without CSS

Colours alone don't make it look like the system — these shapes do. Follow them exactly; improvised cards/chips are the #1 reason non-web output "looks off".

**Radius scale (never improvise):** cards/panels ≈ **12px** equivalent (PowerPoint: 0.12"). Chips/badges ≈ **8px**. Buttons = pill. Never large blobby 20px+ corners on a card.

**KPI / stat card** (mirror the web `KpiCard` anatomy, top to bottom):
1. Small **muted label** on top (12–13pt, `#3c2b00`) — never under the number.
2. **Big value** (28–36pt bold, `#0c0100`).
3. **Delta line** coloured by direction (▲ `#1f8a3b` / ▼ `#9d0000`) + a muted "vs last quarter" caption.
- Fill **white**, hairline border `#bebebe`. **Gold fill only if it is THE single hero stat of the slide** — and then dark `#111` text.
- 3–4 cards in a row, equal sizes. Never one stat card stranded in a corner of an empty slide.

**Status chip in a table cell** (mirror the web `Badge`): a **small pill inside the cell** — tinted fill + dark text of the same family (e.g. `#e0efe4` + `#052e15`), rounded ≈ 8px, hugging its text with modest padding. **Never flood the entire cell** with colour; the pill is the signal, the cell stays banded.

**Slide type scale:** slide title 28–32pt bold · subtitle 14–16pt muted · table body 11–13pt · table header 11–13pt bold · big stat 30–40pt. Don't go smaller than 11pt anywhere.

**One gold moment per data slide.** The gold table header **or** one gold hero stat — never both. (Statement pages are the exception — see below.)

**Fill the slide.** Content composed deliberately: table + supporting stat side by side or stacked with even margins. A half-empty slide with one element floating in a corner reads as unfinished.

## Comparison recipe (this month vs last, A vs B — the other common miss)

Show the **direction**, not just two numbers in the same colour:
- Better → green (`#1f8a3b` / fill `#e0efe4`), worse → red (`#9d0000` / fill `#f1dbdb`), with a ▲ / ▼ or the delta value.
- **"Good" depends on the metric.** Revenue/profit/conversion: up is good. Losses, cost, complaints, churn, refunds: **down is good** → a decrease is green. Never blindly map "increase = green".
- The earliest / baseline column shows a neutral "—".

## How this fits with the PowerPoint skill

Claude's PowerPoint capability (the `pptx` skill) writes the actual file. **This tool supplies the brand; that skill supplies the file mechanics.** Use both. Detailed rules: `get_design_rules` → **Slides & decks**.
