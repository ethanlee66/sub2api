# Design System - Sub2API White-Label Gateway

## Product Context

- **What this is:** A white-label AI API gateway for distributing, metering, and operating Claude, Codex, Gemini, OpenAI, and other model access through user-facing API keys.
- **Who it's for:** Developers, AI tool power users, small teams, and operators who need stable model access, transparent usage accounting, recharge/subscription flows, and enough evidence to trust the service before paying.
- **Space/industry:** AI API relay, developer infrastructure, usage-based billing, model gateway operations.
- **Project type:** Hybrid web app: trust-focused marketing landing page plus data-dense user/admin dashboards.

## Brand Position

- **Core promise:** Every key, request, token, cost, and channel state should feel traceable.
- **Positioning sentence:** A verifiable AI API relay ledger, not just another model proxy.
- **Working direction name:** Transparent Ledger.
- **Optional campaign name:** RouteLedger.
- **Current branded landing instance:** SwatowAPI. Use `SwatowAPI` in user-facing landing copy and `swatowapi` only for lowercase/code/domain contexts.
- **Default product name handling:** UI must respect the configured public `site_name`; avoid hardcoding `Sub2API` in customer-facing white-label surfaces unless the page is explicitly about the upstream project.

The brand should not compete on vague claims like "fast", "cheap", or "global". It should win trust through proof: real product screenshots, usage records, channel health, billing rules, contact paths, and failure-handling clarity.

## Aesthetic Direction

- **Direction:** Financial-grade developer console.
- **Decoration level:** Intentional but restrained.
- **Mood:** Calm, accountable, operational, and precise. The user should feel they are looking at infrastructure that can be audited.
- **Reference blend:** Coinbase for trust and blue-white institutional clarity; Replicate for code-forward API product language; Mintlify for clean documentation and FAQ readability; HashiCorp/IBM only for disciplined enterprise structure.

Avoid generic AI landing-page aesthetics:

- No purple/violet gradient hero as the main identity.
- No abstract 3D globe as the central trust signal.
- No floating orbs, bokeh blobs, mascot characters, or stock-photo people.
- No oversized generic feature cards when a real table, metric, or workflow would prove more.
- No inflated availability claims unless backed by live status data.

## Landing Page Strategy

### First View

The hero must make the brand/product/place/object visible in the first viewport. The page should show the configured site name, the trust promise, and a realistic product surface.

Recommended hero copy:

```text
可核验的 AI API 中转账本
一条 Key 接入 Claude、Codex、DeepSeek、Gemini 与生图接口；每次调用、Token、费用和渠道状态都可追溯。
```

Primary CTAs:

- `开始接入`
- `查看文档`

Trust chips:

- `透明计费`
- `实时状态`
- `Token 隔离`
- `异常可追溯`

The right side of the hero should use the approved SwatowAPI digital harbor illustration style, not a real console screenshot. Keep meaningful text, CTAs, trust chips, numbers, and responsive layout in HTML/CSS; generated images are used as visual assets only.

### Illustration Assets

Use standalone raster illustrations with full light backgrounds, not transparent-background cutouts. The background should be blue-white with soft edge fade so frontend sections can transition naturally without local matte cleanup.

Approved assets:

- `frontend/src/assets/landing/swatowapi-hero-harbor.png` - hero digital API harbor/control tower.
- `frontend/src/assets/landing/swatowapi-ledger-harbor.png` - transparent ledger/audit trail section visual.
- `frontend/src/assets/landing/swatowapi-security-boundary.png` - channel status and security boundary visual.

Rules:

- Do not rely on generated Chinese text inside these images; all meaningful copy must be real HTML.
- Avoid adding more illustrations unless a section has a distinct trust job. Too many illustrations makes the page feel scattered.
- Preserve the shared motif: digital port, control tower, routing lanes, token containers, ledger panels, security gate, and status lights.
- Keep providers as text labels in HTML or small abstract marks. Do not create fake provider logos inside raster assets.

### Landing Page Sections

1. **Hero / SwatowAPI Digital Harbor:** value proposition, CTAs, trust chips, and the approved harbor/control tower illustration.
2. **Transparent Ledger:** every API call can be checked by model, token, cost, latency, status, and channel. Use a ledger/table as the proof surface.
3. **Supported Models and Tools:** help users confirm their workflow can connect. Include Claude Code, Codex, DeepSeek, Gemini, OpenAI SDK, Anthropic-compatible, curl/API examples, image-2, and Gemini Flash image generation. Use grouped tags or a compact matrix, not only logos.
4. **Pricing and Billing Rules:** explain what is charged before recharge: token usage, image generation, failed requests, balance deduction, and reconciliation. Avoid unverifiable exact price claims unless they are wired to live pricing.
5. **3-Minute Integration:** tabs for Claude Code, Codex, DeepSeek, Gemini, OpenAI SDK, and image generation API. Keep examples short and copyable.
6. **Channel Status and Security Boundary:** combine operational health and honest boundaries: model/channel status, latency, key isolation, request audit, data retention note, and relay boundary statement.
7. **FAQ and Support Entry:** recharge not arriving, balance anomalies, failed-call billing, supported tools/models, enterprise cooperation, refund/compensation, and direct support path.

## Typography

- **Display/Hero:** Satoshi or General Sans. Use for hero headlines and high-level marketing statements. If external fonts are undesirable, self-host them or use an approved local asset.
- **Body:** Source Sans 3 or DM Sans. Use for longer explanations, FAQ, settings help text, and landing page paragraphs.
- **UI/Labels:** Same as body. Keep labels compact and scannable.
- **Data/Tables:** Geist or IBM Plex Sans with `font-variant-numeric: tabular-nums`. Usage records, balances, token counts, latency, and prices must align visually.
- **Code:** JetBrains Mono or Geist Mono. Use for API endpoints, keys, curl commands, and SDK snippets.
- **Loading strategy:** Prefer self-hosted fonts for production reliability. External font loading is acceptable only if build and deploy environments can access it reliably.

Type scale:

| Token | Size | Use |
| --- | ---: | --- |
| `text-xs` | 12px | chips, meta labels, status captions |
| `text-sm` | 14px | nav, buttons, form labels, compact table text |
| `text-base` | 16px | body copy, docs text |
| `text-lg` | 18px | section lead, dashboard panel title |
| `text-xl` | 20px | compact page headings |
| `text-2xl` | 24px | dashboard page title |
| `text-3xl` | 32px | landing section title |
| `text-hero` | 44-56px | desktop hero only |

Do not scale font size directly with viewport width. Use clamp only for true hero headings and keep text fitting inside buttons, cards, rows, and filters.

## Color

- **Approach:** Balanced. One strong blue primary, one trust/health accent, one cost accent, and cool neutrals.
- **Primary:** `#3E55E9` - brand actions, selected nav, primary CTA, active states.
- **Primary hover:** `#2F43C9`.
- **Primary strong:** `#2438B8`.
- **Primary soft:** `#F3F5FF`.
- **Primary border:** `#C8D1FF`.
- **Trust accent:** `#0EA5A4` - healthy channel states, verified/safe indicators, successful reconciliation.
- **Success:** `#10B981`.
- **Warning/cost:** `#F59E0B`.
- **Danger:** `#EF4444`.
- **Info/cyan:** `#38BDF8`.

Neutrals:

| Token | Hex | Use |
| --- | --- | --- |
| `ink-900` | `#111827` | primary text |
| `ink-700` | `#374151` | secondary headings |
| `ink-500` | `#6B7280` | body/supporting text |
| `ink-400` | `#9CA3AF` | muted metadata |
| `line` | `#DDE4FF` | primary dividers |
| `line-soft` | `#E6EAF8` | table/grid separators |
| `surface` | `#FFFFFF` | panels and inputs |
| `page` | `#F5F7FF` | landing and app background |
| `page-alt` | `#F8FAFC` | alternating bands |

Dark mode should be designed, not inverted:

- Use `#020617` / `#0F172A` as base surfaces.
- Keep brand blue slightly lighter for contrast: `#8EA0FF`.
- Reduce saturation in large backgrounds.
- Reserve dark mode for console usage, not as the only landing-page identity.

## Spacing

- **Base unit:** 4px.
- **Density:** Compact-comfortable. Dashboards should be efficient; marketing sections should breathe without becoming decorative.
- **Scale:** `2xs(2)`, `xs(4)`, `sm(8)`, `md(16)`, `lg(24)`, `xl(32)`, `2xl(48)`, `3xl(64)`, `4xl(96)`.

Rules:

- Tables, filters, and dashboard panels should favor 12-24px internal spacing.
- Landing page bands should use 64-96px vertical rhythm on desktop and 40-56px on mobile.
- Use borders and alignment before shadows.
- Avoid nested cards. Sections are full-width bands or unframed layouts; cards are for repeated items, modal surfaces, and genuinely framed tools.

## Layout

- **Approach:** Hybrid. Marketing uses a strong editorial grid; product pages use strict operational layouts.
- **Landing max width:** 1200-1280px for content-heavy sections; up to 1600px only for hero/product-dashboard compositions.
- **Dashboard max width:** Fill available app shell width while maintaining stable table/filter geometry.
- **Hero desktop grid:** 40/60 copy-to-product split.
- **Hero mobile grid:** product proof remains visible under copy; do not hide all product evidence behind tabs or carousels.
- **Border radius:** `sm 4px`, `md 6px`, `lg 8px`, `xl 12px`, `full 9999px`. Most controls and panels should stay at 6-8px.
- **Shadows:** Use subtle elevation only for primary hero product mockups and active floating overlays. Avoid heavy card shadows in core app pages.

## Component Guidance

### Buttons

- Primary button: blue fill, white text, 6px radius, compact height.
- Secondary button: white or transparent surface, blue border/text.
- Icon buttons should use existing icon components; do not replace familiar icons with text-only rounded rectangles.
- Avoid gradient CTAs.

### Data Panels

- Metrics should show label, value, unit, and confidence/source when applicable.
- Use tabular numbers for balances, tokens, costs, RPM/TPM, and latency.
- If showing availability or `99.99%`, link it to a status panel or remove the claim.

### Tables and Ledgers

- Usage records are a brand asset. Make them feel exportable, filterable, and auditable.
- Rows should show request time, model, API key, channel/provider, tokens, cost, latency, status, and trace/request id when available.
- Empty states should be calm and specific, not playful.

### Code Blocks

- Use code blocks in landing page integration sections.
- Provide copy buttons with recognizable icons.
- Keep endpoint and environment variable examples short and real.

### Legal and Trust Surfaces

- Legal documents, FAQ, recharge help, and support contact should inherit the same typography and calm surface model.
- Avoid burying refund/failure handling in generic help text.

## Motion

- **Approach:** Minimal-functional.
- **Duration:** micro 80-120ms, short 160-220ms, medium 240-320ms.
- **Easing:** `cubic-bezier(0.2, 0, 0, 1)` for enters/moves; simple ease-out for hover.
- **Allowed:** button hover, selected nav indicator, status refresh, accordion expand, chart loading shimmer.
- **Avoid:** scroll choreography, parallax, animated orbs, always-moving background scenes, bouncing icons, or motion that distracts from trust evidence.

Respect `prefers-reduced-motion`.

## Page-Specific Direction

### Home / Landing

Move from "global route sci-fi" toward "transparent digital harbor." The SwatowAPI landing page should use the approved illustration assets for atmosphere and trust, while real HTML tables, matrices, code tabs, status rows, and FAQ content carry the evidence.

Keep each section focused:

- Hero sells the core promise.
- Transparent Ledger proves traceability.
- Supported Models and Tools proves compatibility.
- Pricing explains billing rules.
- Integration helps users start.
- Status and Security proves operational boundaries.
- FAQ resolves purchase objections.

### User Console

Keep the existing flat, restrained direction:

- No legacy card shell around table pages.
- No large gradient cards.
- No rounded-2xl/3xl dashboard blobs.
- Prefer separators, rows, and panels over decorative elevation.

### Admin Console

Admin surfaces can be denser than user surfaces. Prioritize bulk actions, filters, health/status signals, and error recovery paths. Visual polish should reduce operational confusion, not add marketing decoration.

### Auth / Onboarding

Auth screens should match the trust brand: crisp blue, clear support path, obvious provider identity, and no excessive illustration. Registration, login, and password recovery should reinforce the same "accountable infrastructure" voice.

## Content Voice

- Be precise and evidence-backed.
- Prefer "可追溯", "可核验", "透明计费", "实时状态", "Token 隔离", "异常记录" over vague words like "极速", "超稳", "无限", "官方".
- When discussing upstream providers, be clear that this is a relay/gateway unless a specific official integration is being described.
- Do not imply guarantees that the system cannot measure or enforce.

Example claims:

- Good: `每次调用都记录模型、Token、费用、渠道状态和耗时。`
- Good: `失败请求可按时间、Key、模型和状态码排查。`
- Avoid: `永不失败的全球 AI 网络。`
- Avoid: `官方极速无限中转。`

## Implementation Notes

- Use CSS custom properties for landing-page tokens so white-label overrides stay clean.
- Keep product screenshots and hero data realistic. Fake rows are acceptable for demos, but should resemble actual fields the app can expose.
- Do not use generated images for important Chinese text in production. Use generated images only as composition references or decorative assets; all meaningful copy must be HTML.
- When changing visual code, check the existing user visual style tests and add/update tests for no-regression rules where practical.

## Decisions Log

| Date | Decision | Rationale |
| --- | --- | --- |
| 2026-05-15 | Initial design system created | Based on the Sub2API white-label gateway context, current flat user-console styling, and the chosen "transparent ledger" trust direction. |
| 2026-05-15 | Primary brand color remains `#3E55E9` | This already exists across the landing page, auth layout, and user dashboard styling, so keeping it preserves continuity. |
| 2026-05-15 | Landing page should prioritize verifiable product evidence over abstract globe visuals | Trust for an API relay comes from transparent usage, billing, status, and support evidence rather than generic sci-fi infrastructure imagery. |
| 2026-05-15 | SwatowAPI landing visuals use standalone digital harbor illustrations | The user chose illustration over real console screenshots; approved assets use full light backgrounds for easy frontend integration without transparent-background cleanup. |
