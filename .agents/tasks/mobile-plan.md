# Mobile Responsiveness Implementation Plan

> **Build command:** `npm run build` (in `client/`)  
> **Dev/verify command:** `npm start` (in `client/`) — visual inspection in DevTools mobile viewport  
> **CI=false** is already set in the build script so warnings don't abort.

---

## Summary of Issues Found

After reading every component, the following categories of problems exist across the codebase:

| Category | Files affected |
|---|---|
| Fixed-width modals (not full-screen on mobile) | `ProfileDetail.jsx`, `AlumniMenu.jsx` |
| Overflow table / no horizontal scroll | `SortedTable.jsx` (already has `overflow-x-auto`), `AlumniMenu.jsx` form |
| Flex-row → needs flex-col on mobile | `AchievementsForm.jsx`, `About.jsx` (already correct), `InterviewExperiencePage.jsx` filter row |
| Missing `pt-16` / sidebar-offset only for mobile | `DefaultLayout.jsx` (already has `pt-16 md:pt-0`) |
| Grids not collapsing to 1-col | `Contributors.jsx`, `FeatureShowcase.jsx` bento, `RatingLegend.jsx` |
| Tiny tap targets (<44 px) | `AlumniMenu.jsx` submit button, `Error.jsx` button, `MaintenancePage.jsx` |
| Old-school form with no mobile styling | `AlumniSignUpForm.jsx`, `AlumniMenu.jsx` |
| Large hero text not scaling | `Home.jsx` (good), `Events.jsx` (already responsive), `About.jsx` (already responsive) |
| Modal near-full-screen on mobile | `Modal.jsx` (Events), `ProfileDetail.jsx`, `AchievementCard.jsx` (already good) |
| `w-[24rem]` fixed width | `ProfileDetail.jsx` |
| Maintenance page uses bg-gray-100 (not dark) | `MaintenancePage.jsx` |
| NoticeBar `mx-4 w-fit` wrapping issues | `NoticeBar.jsx` |
| Contributors timeline line overlaps on mobile | `Contributors.jsx` |
| Footer 3-col grid on small screens | `Footer.jsx` (already has `sm:grid-cols-3`) — needs 2-col on mobile |
| FAQs dropdown width `md:w-3/4 w-[90%]` | `Dropdown.jsx` (already good) |
| Post page filter grid overflow | `InterviewExperiencePage.jsx` |
| Platform buttons overflow on mobile | `PlateformButtons.jsx` (already has `overflow-x-auto`) |
| LG→mobile layout for leaderboard sidebar | `cp.jsx` (already `flex-col lg:flex-row`) |

---

## Implementation Plan

- [ ] 1. **DefaultLayout — Verify mobile padding is correct**  
      The layout already adds `pt-16 md:pt-0` to `<main>` so the sidebar hamburger button (which is `fixed top-4 left-4`) does not overlap content on mobile. Confirm that `pt-16` (64 px) matches the `h-11` (44 px) button plus any safe-area inset by inspecting on a real 360 px-wide viewport. If the hamburger clips into content, change `pt-16` to `pt-20` (80 px).  
      Files: `client/src/layout/DefaultLayout.jsx`  
      Verify: `npm start` — hamburger does not overlap page content at 360 px viewport width.

- [ ] 2. **SideBar — close on route change (already works); ensure overlay covers full screen**  
      The overlay div uses `fixed inset-0` which is correct. The only gap: the hamburger `z-[10000]` button is rendered even when `mobileOpen` is false, but its `top-4 left-4` position is fine. No code change needed. This item is a review-only check.  
      Files: `client/src/components/SideNavigationBar/SideBar.jsx`  
      Verify: Visual smoke-test — sidebar opens/closes cleanly; overlay taps correctly dismiss it.

- [ ] 3. **MaintenancePage — fix dark-theme background and improve layout**  
      The current page uses `bg-gray-100` (light) on a dark-background app and has no padding for mobile. Replace with a dark glassmorphism card centred on the dark background. Make the image `max-w-[180px] sm:max-w-[250px]`, add `px-6` padding, and use the brand's dark `bg-[#060818]` background. Also ensure the heading and paragraph text is white/light.  
      Files: `client/src/components/Error/MaintenancePage.jsx`  
      Verify: `npm start` — navigate to a broken route that triggers `<MaintenancePage />` and inspect at 360 px.

- [ ] 4. **Error.jsx — improve touch target on "Try Again" button**  
      The `<button>` currently has only `p-2` padding, which is well under 44 px. Add `min-h-[44px] px-6 py-3 rounded-xl` to reach the WCAG 2.5.5 touch target size. Also change `text-red-900` text/icon colours to `text-red-400` so they are readable on the dark background.  
      Files: `client/src/components/Error/Error.jsx`  
      Verify: `npm start` — button tap target is visually large; text readable on dark background.

- [ ] 5. **Events Modal — near-full-screen on mobile**  
      `Modal.jsx` uses `max-w-4xl` with `px-4 py-8` white background. On mobile (360 px), the inner white box is near full-width which is good, but:  
      - Add `mx-2` → already has `px-4`, so the container becomes flush. Replace with `w-[calc(100%-2rem)] sm:w-auto sm:max-w-4xl`.  
      - The white card `bg-white` does not match the dark glassmorphism theme. Update to `bg-zinc-950/95 border border-zinc-800` with dark text so nav/close buttons are readable.  
      - Nav buttons `text-black` → `text-white`.  
      - Close button `text-black` → `text-white`.  
      Files: `client/src/components/Events/Modal.jsx`  
      Verify: `npm start` → open an event with images → image gallery modal appears dark, full-width on mobile, images visible.

- [ ] 6. **AlumniNetwork ProfileDetail — fix fixed width modal**  
      `ProfileDetail.jsx` has `w-[24rem] md:w-[26rem]` hard-coded (white background, blue text). This clips on 360 px. Replace with `w-[calc(100vw-2rem)] max-w-[26rem]` and dark styling (`bg-zinc-950/95 border border-zinc-800 text-zinc-100`) to match the site theme. Change `text-blue-800` → `text-white`, `text-lg font-bold` names to `text-white`, and flex rows to `flex-col sm:flex-row`.  
      Files: `client/src/components/AlumniNetwork/ProfileDetail.jsx`  
      Verify: `npm start` → Alumni Network page → click a profile → modal is readable on 360 px without overflow.

- [ ] 7. **AlumniMenu.jsx — full mobile form overhaul (old legacy form)**  
      This form has many issues:  
      - `section` wrapper has `overflow-hidden rounded-md bg-blue-100/10` but no padding on mobile.  
      - Form fields use `md:w-[20rem]` with no mobile width, so inputs are tiny.  
      - Submit button `mt-10 bg-blue-600 px-8 py-4` is ok but sits inside a flex-col that needs `w-full`.  
      - Image preview is `h-40 w-40 md:h-52 md:w-52` which is fine.  
      Changes:  
      - Section: add `px-4 sm:px-8` padding.  
      - Form: `w-full` container on mobile.  
      - Each field `<div>`: change `m-4 flex w-full flex-col gap-2 md:w-fit` to `flex w-full flex-col gap-2`.  
      - Each `<input>`: change `md:w-[20rem]` to `w-full`.  
      - Submit button: `w-full sm:w-auto min-h-[44px]`.  
      Files: `client/src/components/AlumniDetail/AlumniMenu.jsx`  
      Verify: `npm start` → `/alumni-network/alumni` → form renders usably at 360 px with full-width inputs.

- [ ] 8. **AlumniSignUpForm — dark-theme + mobile-friendly styling**  
      This form still uses `bg-gray-800`, `bg-gray-200` inputs (light), and old non-Tailwind styling. It needs:  
      - Outer wrapper: replace `bg-black-2 p-6 pt-10 md:p-16` with `bg-[#060818] px-4 py-10 sm:px-8`.  
      - The inner `<form>`: replace `bg-gray-800 w-full max-w-lg rounded-lg p-2 shadow-lg md:p-8` with `w-full max-w-lg rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-5 sm:p-8`.  
      - All `<input className="bg-gray-200 w-full rounded p-2 text-black">` → `w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-blue-500/50`.  
      - Submit button: `w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-sm font-bold text-white min-h-[44px]`.  
      - NEXUS logo image: `w-full max-w-[14rem] sm:max-w-[20rem]` and center-align.  
      - Info banner: ensure `flex-col sm:flex-row` so it stacks on mobile.  
      Files: `client/src/components/AlumniSignUpForm/AlumniSignUpForm.jsx`  
      Verify: `npm start` → `/alumni/signup` → entire form renders in dark theme with readable inputs at 360 px.

- [ ] 9. **AchievementsForm — flex-col on mobile for image+form layout**  
      Currently `flex-col items-center md:flex-row` — this is already correct for mobile stacking. But there are issues:  
      - `section` wrapper: `mx-4 mb-48 mt-10` with no overflow guard. Ensure it stays inside viewport by adding `overflow-hidden w-full`.  
      - Image preview: `h-56 w-56 md:h-72 md:w-72` is fine, but on very narrow screens (320 px) it clips. Change to `h-52 w-52 sm:h-64 sm:w-64 md:h-72 md:w-72 max-w-full`.  
      - Form side (`md:w-2/3`): on mobile it is `w-full` but has no horizontal padding. Add `px-2`.  
      - Submit button: add `w-full sm:w-auto min-h-[44px]` to the submit button.  
      Files: `client/src/components/AchievementsForm/AchievementsForm.jsx`  
      Verify: `npm start` → `/achievements/add-new` → form is usable at 360 px, image preview is contained.

- [ ] 10. **NoticeBar — fix `w-fit` wrapping on mobile**  
       The `mx-4 flex w-fit items-center` pattern means the card can be wider than the screen on small viewports (especially when the text is long). Replace `w-fit` with `w-full sm:w-fit` and ensure the `<p>` inside has `w-full` (not the current `w-[90%] md:w-full`).  
       Files: `client/src/components/coding/NoticeBar.jsx`  
       Verify: `npm start` → `/coding` → notice bar is contained within viewport at 360 px.

- [ ] 11. **SortedTable — pagination controls wrapping on mobile**  
       The pagination bar at the bottom uses `flex flex-col items-center justify-between gap-4 sm:flex-row` which already collapses on mobile. However, the pagination buttons row (`First / Prev / [page X of Y] / Next`) can still be too wide at 360 px. The "Page X of Y" display inside a border box is fine. Just ensure the outer `<div>` has `overflow-x-auto` so buttons don't get clipped, and wrap with `flex-wrap gap-2` instead of no-wrap. Also the `bg-indigo-950/20` container wrapping the table already has `overflow-x-auto` — keep it.  
       Changes:  
       - Pagination button row `<div className="flex items-center gap-1">` → add `flex-wrap`.  
       Files: `client/src/components/coding/SortedTable.jsx`  
       Verify: `npm start` → `/coding` → scroll to pagination on 360 px — buttons are accessible without horizontal scroll.

- [ ] 12. **LeaderboardPodium — ensure 3-card grid stacks correctly on mobile**  
       The grid is `grid grid-cols-1 md:grid-cols-3`. On mobile, the gold card (rank 1) has `order-1 md:order-2` which means it appears first on mobile — that is correct. However the `md:-translate-y-2` elevation class only applies at md+. The result is the three cards simply stack vertically on mobile. This is fine. The only issue is the heading row `flex items-center justify-between pb-4` which may become cramped. On narrow viewports, wrap it with `flex-wrap gap-2`. No other changes needed.  
       Files: `client/src/components/coding/LeaderboardPodium.jsx`  
       Verify: `npm start` → `/coding` → podium shows three cards vertically on 360 px.

- [ ] 13. **RatingLegend — fix grid overflow on mobile**  
       When expanded, `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6` collapses to 2 cols on mobile, which is good. But individual legend pill text like "Candidate Master (≥1900)" can overflow its pill. Add `text-[10px]` at mobile and `truncate` or `text-center break-words` to the badge `<div>`. Also the toggle button should have `min-h-[44px]`.  
       Files: `client/src/components/coding/RatingLegend.jsx`  
       Verify: `npm start` → `/coding` → expand legend → pills are readable on 360 px without overflow.

- [ ] 14. **FilterSection (coding) — filter panel on mobile**  
       The filter grid is `grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5`. On mobile all selects stack vertically — correct. The action buttons row (`Clear Filters` + `Apply Filters`) uses `flex items-center justify-end gap-3` which can overflow. Add `flex-wrap` and on mobile make both buttons `w-full sm:w-auto`. Also the filter toggle button `flex items-center gap-2 rounded-xl border px-5 py-2.5` is adequately sized at 44 px height.  
       Files: `client/src/components/coding/FilterSection.jsx`  
       Verify: `npm start` → `/coding` → open Filters panel at 360 px → Clear/Apply buttons are full-width and accessible.

- [ ] 15. **Contributors — fix timeline line on mobile**  
       The vertical timeline line `absolute left-4 top-0 bottom-0 w-[2px]` and the year dot `absolute left-4 -translate-x-1/2` only look correct when the content has left margin. The `ml-12` on the content block provides this. On very narrow screens (320 px), `ml-12` (48 px) + the content grid width may cause horizontal overflow. Make the contributor grid `grid gap-3 md:grid-cols-2` (already has this). On mobile, remove the two-col grid entirely since it's already 1-col. Also check the avatar images `w-9 h-9` — fine. Ensure the section wrapper `my-16 px-6` is fine at mobile — `px-6` on 360 px = 24 px each side leaving 312 px. Fine.  
       No changes needed — verify the component is already correct on mobile.  
       Files: `client/src/components/Contributors/Contributors.jsx`  
       Verify: `npm start` → scroll to contributors on Home page at 360 px — timeline renders without overflow.

- [ ] 16. **Footer — 3→2-col nav links on small mobile**  
       The nav links grid is `grid grid-cols-2 gap-8 sm:grid-cols-3`. On the smallest screens (320 px), 2 columns with 32 px gaps means each column is about 112 px — narrow but workable. The brand section `xl:col-span-1` stacks above on mobile. The large NEXUS watermark text `text-[6rem] sm:text-[9rem] md:text-[12rem]` may cause horizontal overflow. Add `overflow-hidden` to its wrapper (which already has `pointer-events-none select-none mt-8 flex justify-center overflow-hidden` — already set). The copyright bar uses `flex-col sm:flex-row` — already responsive. The email pill `inline-flex items-center` may overflow at 320 px — add `max-w-full overflow-hidden text-ellipsis`. No major changes.  
       Files: `client/src/components/Footer/Footer.jsx`  
       Verify: `npm start` → scroll to footer at 320 px — no overflow, all columns readable.

- [ ] 17. **FAQs Dropdown — question text uses `w-3/4` on mobile**  
       `<h2 className="w-3/4">` means the question only uses 75% of the available width, with the toggle chevron taking 25%. On mobile this is fine as long as the question text wraps. No change needed. The container `w-[90%] md:w-3/4` already collapses to 90% on mobile. The dropdown entry point `min-h-[44px]` check: `p-5` padding on the item + the `flex cursor-pointer items-center justify-between px-2` row means the click target is tall enough.  
       Files: `client/src/components/FAQs/Dropdown.jsx`  
       Verify: Visual confirm — no changes.

- [ ] 18. **Forms / FormCard — layout fix at mobile widths**  
       `FormCard` uses `w-full md:w-[45%] min-w-[20rem]`. The `min-w-[20rem]` (320 px) on a 360 px viewport with `px-4` padding (328 px available) is fine. The inner `flex flex-col justify-between gap-3 text-sm md:flex-row` already collapses to col on mobile. The "Register Now" button uses `Button` with a full-width override. Fine. No changes needed.  
       The `Forms.jsx` wrapper uses `px-4 py-8 md:px-8` — good.  
       Files: `client/src/components/Forms/FormCard.jsx`  
       Verify: `npm start` → `/forms` → cards render correctly at 360 px.

- [ ] 19. **InterviewExperiencePage — controls row and filter panel on mobile**  
       Controls row `flex flex-col sm:flex-row justify-between items-center gap-3` — already stacks on mobile. Fine.  
       Filter panel grid `grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` — already mobile-first. Fine.  
       The bottom row of filter buttons `flex flex-col gap-3 sm:flex-row ... sm:col-span-2 lg:col-span-3 xl:col-span-4` — stacks on mobile. Fine.  
       Pagination `flex items-center justify-center gap-2` — fine for mobile (3 items).  
       Post grid `grid grid-cols-1 gap-6 xl:grid-cols-2` — already 1-col on mobile. Fine.  
       No changes needed.  
       Files: `client/src/components/Post/InterviewExperiencePage.jsx`  
       Verify: `npm start` → `/interview-experiences` → page renders correctly at 360 px.

- [ ] 20. **AlumniNetwork hero section & grid — already responsive**  
       `AlumniNetwork.jsx` uses `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`. Hero text uses `text-4xl sm:text-5xl md:text-6xl`. The info banner uses `flex-col sm:flex-row`. Profile cards use `w-full`. All correct.  
       Files: `client/src/components/AlumniNetwork/AlumniNetwork.jsx`  
       Verify: No changes — confirm visually.

- [ ] 21. **Alumni page (Alumni.jsx / AlumniHero / AlumniCard / AlumniFilters) — review**  
       `AlumniHero.jsx`: `text-4xl md:text-5xl lg:text-6xl` — responsive. `mx-auto flex max-w-3xl items-center justify-center text-xl` around the button — fine.  
       `AlumniCard.jsx`: `p-6` padding, `flex items-center gap-4` row — can become narrow at 320 px. The `h-16 w-16` avatar + name is fine. No changes.  
       `AlumniFilters.jsx`: `grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4` — already stacks on mobile. Apply/Clear buttons `flex justify-end gap-4` can overflow at 320 px. Add `flex-wrap`.  
       Files: `client/src/components/Alumni/AlumniFilters.jsx`  
       Verify: `npm start` → alumni page → open filters at 360 px → buttons accessible.

- [ ] 22. **Teams page — already responsive; verify**  
       `Teams.jsx` uses `px-4 py-16 sm:px-6 lg:px-8`, `text-4xl ... sm:text-5xl md:text-6xl`, year pill selector `flex flex-wrap ... justify-center gap-2`. Team cards rendered by `TeamCard.jsx` use `flex w-full flex-wrap justify-center gap-8`. `ModernProfile` cards need inspection (not in the list). The domain filter chips `flex flex-wrap items-center justify-center gap-2` — fine.  
       Files: `client/src/components/Teams/Teams.jsx`, `client/src/components/Teams/TeamCard.jsx`  
       Verify: `npm start` → `/team` → team grid renders at 360 px with single-col card layout.

- [ ] 23. **About page — already responsive; verify**  
       Hero section uses `flex flex-col-reverse gap-10 md:flex-row md:items-center`. Logo card uses `w-full md:w-80`. Mission grid `grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3`. All good. CTA buttons `flex flex-wrap gap-3`.  
       Files: `client/src/components/About/About.jsx`  
       Verify: `npm start` → `/about` → all sections render correctly at 360 px.

- [ ] 24. **Home page — verify all sections are mobile-ready**  
       `Home.jsx`: hero `min-h-[95svh]`, NEXUS heading `text-[5.5rem] sm:text-[7rem] md:text-[8.5rem] lg:text-[10rem]`. At 360 px, `5.5rem` ≈ 88 px which fits. `px-6 sm:px-8` — fine.  
       `CommunityStats.jsx`: `grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5` — stacks on mobile. Fine.  
       `EventMarquee.jsx`: `overflow-hidden` with marquee — fine.  
       `FeatureShowcase.jsx`: bento grid `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4`. On mobile all cards are 1-col. The `lg:col-span-*` classes have no effect on mobile. Fine.  
       `WhatPeopleThinkAboutUS.jsx`: `flex-col sm:flex-row sm:flex-wrap` — stacks on mobile. Fine.  
       Files: `client/src/components/Home/Home.jsx` (and sub-components)  
       Verify: `npm start` → `/` → entire home page at 360 px — no overflow, all sections readable.

- [ ] 25. **StudyMaterialPage — SelectionCard and Subjects grid on mobile**  
       `SelectionCard`: `w-full max-w-md` — fine for mobile. The inner `flex items-start gap-5` with a fixed `h-14 w-14` icon box is fine.  
       `renderStep3_Subjects`: grid `grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3` — single column on mobile. Good.  
       `Breadcrumb`: `flex items-center gap-2 text-sm` with multiple crumb items — may overflow horizontally on 360 px when 3+ crumbs present. Add `flex-wrap`.  
       Files: `client/src/pages/StudyMaterialPage.jsx`  
       Verify: `npm start` → `/study-material` → breadcrumb and subject cards render at 360 px.

- [ ] 26. **LoginForm — already well-responsive; verify**  
       `max-w-md` card, `px-4 py-12` outer, `p-8` inner. On 360 px with `px-4`, the card fills 328 px. Fine. All inputs `w-full rounded-xl`. Submit button `w-full`. Social links `space-y-2.5 text-center`. Fine.  
       Files: `client/src/components/LogInForm/LogInForm.jsx`  
       Verify: `npm start` → `/login` → renders cleanly at 360 px.

- [ ] 27. **Achievements page — already responsive; verify AchievementCard modal**  
       `AchievementCard.jsx` modal already uses `mx-4 flex max-h-[90vh] w-full max-w-lg`. Fine. Card uses `h-[27rem] w-full max-w-[20rem]`. On mobile with `flex flex-wrap justify-center gap-6`, cards take full width or close to it. Fine.  
       Files: `client/src/components/Achievements/AchievementCard.jsx`  
       Verify: `npm start` → `/achievements` → cards and modal render at 360 px.

- [ ] 28. **Coding — BarChart responsive container**  
       `BarChart.jsx` uses `<ResponsiveContainer width="100%" height={400}>` — this should shrink correctly. The container wrapper `mb-10 flex justify-center p-5` adds 40 px horizontal padding which reduces available width on mobile. Change to `mb-10 p-2 sm:p-5 w-full`. Also at very narrow widths the rotated X-axis labels (`angle={-90}`) may clip. No easy fix without changing the chart library configuration; add `overflow-visible` wrapper.  
       Files: `client/src/components/coding/BarChart.jsx`  
       Verify: `npm start` → `/coding` (if BarChart is still used) → chart fits within viewport.

- [ ] 29. **BatchCard — check mobile rendering**  
       Uses Material Tailwind `Card` with `w-full max-w-[20rem] p-8`. On mobile, `max-w-[20rem]` (320 px) on a 360 px screen with 20 px padding leaves 320 px. Fine.  
       Files: `client/src/components/coding/BatchCard.jsx`  
       Verify: If rendered on the coding page, inspect at 360 px.

- [ ] 30. **PostProfile / Profile pages — check mobile rendering**  
       These files exist in `client/src/components/Profile/` but are not in the required investigation list. Do a quick scan — if they have fixed widths or overflow issues, apply the same fixes (use `w-full`, `max-w-*`, `flex-col sm:flex-row` patterns).  
       Files: `client/src/components/Profile/Profile.jsx`, `client/src/components/Profile/UserProfile.jsx`, `client/src/components/Profile/CodingProfile.jsx`  
       Verify: `npm start` → `/profile` → profile renders correctly at 360 px.

---

## Verification Checklist

After all items are complete, run a full smoke test at the following breakpoints using Chrome DevTools:

| Viewport | Profile |
|---|---|
| 360 × 640 | Galaxy S8 (typical Android) |
| 390 × 844 | iPhone 14 |
| 768 × 1024 | iPad (tablet boundary) |

Pages to test: `/`, `/about`, `/events`, `/achievements`, `/achievements/add-new`, `/coding`, `/team`, `/alumni-network`, `/alumni`, `/alumni/signup`, `/interview-experiences`, `/forms`, `/login`, `/study-material`

**Build verification:** `cd client && npm run build` must complete with `CI=false` (no blocked warnings).
