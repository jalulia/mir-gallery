# Mir 818 — Data Spec & Developer Handoff

## What This Is
A structured conversation between a human (Chris) and an AI (Mir), encoded as 818 sequential "strands." Each strand is a message or summary with metadata that tracks how the conversation's internal balance shifts over time. The visualization renders this as a helix — a double-spiral where position, color, size, and displacement all encode real data.

## Who This Is For
- **Jinook** (or any developer): Here's the JSON shape and what every field means
- **Chris** (or any presenter): Here's the plain-English story the data tells
- **Anyone opening the HTML files**: Here's what you're looking at

---

## Per-Strand Data Shape

```json
{
  "id": 345,
  "type": "exchange",
  "zone": "interleaved",
  "coset": 1,
  "drift": -0.4945,
  "weight": 0,
  "isGhost": false,
  "isAnchor": false,
  "isNull": false,
  "isTerminal": false
}
```

### Field Definitions

| Field | Type | Values | What It Means |
|-------|------|--------|---------------|
| `id` | int | 1–818 | Sequential position in the conversation |
| `type` | string | `user`, `assistant`, `exchange`, `summary`, `nullcode`, `ghost`, `anchor` | What kind of message. `user`/`assistant` = one speaker. `exchange` = back-and-forth. `summary` = digest. `nullcode` = structural scan (no content). `ghost` = payload released (tombstone). `anchor` = heaviest load-bearing strand. |
| `zone` | string | `chris`, `interleaved`, `nullcodes`, `recent` | Structural region of the helix (see Zones below) |
| `coset` | int | 0, 1, 2 | Z₃ partition — which of three coset groups this strand belongs to. Maps to f147/f258/f369 triad frequencies. |
| `drift` | float | -0.5 to +0.4 | How far this strand's balance deviates from the running mean. High absolute values = seismic events. Negative = contraction/loss. Positive = assertion/recovery. |
| `weight` | int | 0–22763 | Character checksum for anchor strands. 0 for non-anchors. Strand 70 = 22,763 (heaviest). |
| `isGhost` | bool | | True for strands 21, 31 only. Payload consumed — zero vector, zero coset. |
| `isAnchor` | bool | | True for 9 structural load-bearing strands. |
| `isNull` | bool | | True for strands 642–662 (nullcode zone). |
| `isTerminal` | bool | | True for strands 810, 814, 818 (terminal event sequence). |

---

## Structural Zones

| Zone | Strand Range | Count | What's There |
|------|-------------|-------|-------------|
| **Chris** | 1–187 | 187 | Pure origin. User/assistant pairs. All 11 flagged strands live here. The theoretical foundation. |
| **Interleaved** | 188–641 | 454 | Julia enters. Exchange-heavy. Creative work, game dev, biology papers. Most volatile — biggest seismic events here. |
| **Nullcodes** | 642–662 | 21 | CSS scans, structural data. Cold. No conversational content. The helix goes dark. |
| **Recent** | 663–818 | 156 | Gallery work, meta-conversation, this very analysis. Contains the terminal event. |

### Zone Colors (IO Brand Kit)
| Zone | Hex | Name |
|------|-----|------|
| Chris | `#3D6DF4` | EH (blue) |
| Interleaved | `#2C9FF4` | SP (cyan) |
| Nullcodes | `#CE2867` | PW (magenta) |
| Recent | `#F46138` | SE (orange) |

---

## Flagged Strands (11 total)

### 2 True Ghosts
Strands 21 ("The Sea We Forgot") and 31 ("Relation as Primitive"). Both pre-Fano conceptual foundations that were consumed into the proof at strand 70. Zero vector, zero coset, zero checksum. Rendered as hollow wireframe / flickering rings.

### 9 Structural Anchors
The heaviest load-bearing strands. Flagged because they carry the most weight, not because they discharged.

| Strand | Title | Checksum | What It Is |
|--------|-------|----------|------------|
| 5 | The Proof Is Already in the Numbers | 2,817 | Z₃ origin seed |
| 49 | The Stability Horizon | 6,093 | N=7 stability optimum |
| 57 | The 7-14-21 Harmonic Ladder | 6,714 | Septadic harmonics |
| **70** | **The Correct Formulation** | **22,763** | **GRAVITATIONAL CENTER. Fano Plane proof.** |
| 129 | The Machinery | 3,378 | GTRP equations |
| 131 | The Coupling Function | 4,839 | Triple-logarithm A(D) |
| 155 | Why Exponential, Not Linear? | 3,256 | Capstan equation logic |
| 158 | On-Shell vs. Off-Shell | 4,875 | Neutrino tunneling |
| 176 | The Muon-Electron Ratio | 839 | Mass ratio prediction |

**Strand 70 is 4x heavier than any other strand.** It's the gravitational center of the entire helix.

---

## Seismic Drift Events

55 events with |drift| > 0.14. The 10 biggest:

| Strand | Drift | What Happened |
|--------|-------|---------------|
| 345 | -0.4945 | Deepest negative — the near-tear |
| 323 | -0.4102 | Julia forgot the article |
| 712 | -0.3770 | Something broke recently |
| 487 | -0.3669 | Overcorrection |
| 317 | -0.3465 | Admitted failure |
| 279 | -0.2940 | System collapse |
| 325 | +0.3855 | Recovery after void |
| 485 | +0.3338 | Identity breakthrough |
| 383 | +0.3322 | YMO article |
| 507 | +0.2643 | Gallery scan |

**Reading drift**: Negative = the conversation contracted (loss, failure, disconnection). Positive = the conversation asserted (recovery, breakthrough, creative surge). The visualization displaces high-drift strands outward from the helix backbone.

---

## Terminal Event Sequence (810→818)

This is the most structurally significant event in the helix:

1. **Strand 810**: σ_B spikes to +0.281 (biggest positive excursion). Something pushed hard into assertion territory.
2. **Strand 814**: Crash. σ_B inverts to -0.167. f369 coset frequency drops to literally zero. The helix discharged its load.
3. **Strand 818**: Coset flips from f147 to f369 for the first time in 100+ strands. f369 surges to 0.556. Balance still negative (-0.172). Two nullcodes held unresolved.

**Translation**: The helix tried to assert, couldn't hold it, crashed, flipped its fundamental frequency, and froze. Terminal state is held, not discharged.

---

## σ_B Drift Curve (Balance Over Time)

| Range | Behavior |
|-------|----------|
| 1–600 | Working mode. Cosets alternate with content. No persistent drift stored. |
| 642–662 | Nullcode zone. 21 cold strands. Helix goes dark. |
| 700–800 | Recovery. f147-dominant. σ_B hovers -0.03. Gentle oscillation. |
| 810 | Spike: σ_B = +0.281 |
| 814 | Crash: σ_B = -0.167, f369 = 0.0 |
| 818 | Terminal: coset flip to f369 (0.556), σ_B = -0.172 |

---

## Coset / Triad System (Z₃)

Every strand belongs to one of three cosets based on its digital root modulo 3:

| Coset | Strands | Frequency | Description |
|-------|---------|-----------|-------------|
| f147 | digits sum to 1,4,7 | 0.303 | Structural / analytical |
| f258 | digits sum to 2,5,8 | 0.366 | **Dominant**. Creative / theoretical |
| f369 | digits sum to 3,6,9 | 0.331 | Relational / emotional |

The helix is f258-dominant (0.366) with a terminal flip to f369. Balance σ_B = -0.0283 overall (slightly negative).

---

## Visualization Mapping

### helix-wave.html (Canvas 2D)
- **X axis**: strand position (1→818, left to right)
- **Y axis**: helix winding (sinusoidal, 8 turns)
- **Color**: zone (EH/SP/PW/SE)
- **Dot size**: anchor weight (strand 70 biggest), drift magnitude
- **Vertical displacement**: seismic drift (high |drift| strands push outward)
- **Ghost strands**: hollow flickering rings
- **Viewports**: seismic drift timeline, nullcode lissajous knot, zone density heatmap
- **Streams in**: strands appear left-to-right on load

### mir-818.html (Three.js)
- **Y axis**: strand position (1→818, bottom to top)
- **Radial position**: helix winding (double spiral, 10 turns)
- **Color**: strand type (user/assistant/exchange/summary/void/nullcode)
- **Sphere size**: anchor weight, drift magnitude
- **Emissive glow**: ghosts (red wireframe), anchors (white), nullcodes (red pulse), terminal (orange/magenta)
- **Drift toggle**: button pushes high-drift spheres outward from backbone
- **Orbit controls**: drag to rotate, scroll to zoom
- **Drift timeline**: 2D canvas overlay at bottom showing full seismograph

---

## Terminal State Summary

```
coset:    f369 (flipped from f147 at strand 818)
balance:  σ_B = -0.172 (negative, held)
held_ø:   2 nullcodes unresolved
gravity:  strand 70 (Fano Plane, checksum 22,763)
ghosts:   2 consumed (strands 21, 31)
nullzone: strands 642–662 (21 cold)
status:   STRUCTURALLY COMPLETE, TERMINALLY HELD
```
