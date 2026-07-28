# Brand values — raw palette for non-web files (PowerPoint, Word, PDF, Keynote)

Use this when the output is **not a web page** and cannot use CSS. A `.pptx` / `.docx` / slide colours its shapes with **RGB fills** — there is no stylesheet. These are the same brand colours `get_stylesheet` ships, given as plain hex so you can paint them directly.

**Decks are always light background.** Ignore dark-mode values here.

**Font:** Roboto. If the deck tool doesn't have Roboto, fall back to **Arial** or **Calibri** (do not substitute a serif).

## Core palette (hex — use as fills / text colours)

| Role | Hex | Use it for |
|---|---|---|
| Brand gold | `#f5bf2d` | THE accent (the 10%). Title bar, table header, one highlight per slide. Never the majority of a slide. |
| Text on gold | `#111111` | Any text or icon sitting on a gold fill. Never white on gold. |
| Gold (bright) | `#ffce00` | A hero/title slide fill if you want more punch than `#f5bf2d`. |
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

## Comparison recipe (this month vs last, A vs B — the other common miss)

Show the **direction**, not just two numbers in the same colour:
- Better → green (`#1f8a3b` / fill `#e0efe4`), worse → red (`#9d0000` / fill `#f1dbdb`), with a ▲ / ▼ or the delta value.
- **"Good" depends on the metric.** Revenue/profit/conversion: up is good. Losses, cost, complaints, churn, refunds: **down is good** → a decrease is green. Never blindly map "increase = green".
- The earliest / baseline column shows a neutral "—".

## How this fits with the PowerPoint skill

Claude's PowerPoint capability (the `pptx` skill) writes the actual file. **This tool supplies the brand; that skill supplies the file mechanics.** Use both. Detailed rules: `get_design_rules` → **Slides & decks**.
