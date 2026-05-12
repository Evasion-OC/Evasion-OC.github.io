# Personal Academic Website

A lightweight personal academic site inspired by [pbb.sh](https://pbb.sh/).
Pure HTML + CSS + JS — no build step, no framework. Drop it onto GitHub Pages
and you're done.

## Structure

```
.
├── index.html          # About page (homepage)
├── research.html       # Publications list with tag filters
├── experience.html     # Education / industry / talks / service
├── posts.html          # Blog-style post list
├── contact.html        # Contact form (Formspree-backed)
├── .nojekyll           # Tells GitHub Pages to skip Jekyll processing
├── assets/
│   ├── css/style.css   # All styles (light + dark mode)
│   ├── js/main.js      # Theme toggle, tag filter, last-updated stamp
│   └── img/            # Drop avatar.png, favicon.png, paper thumbnails here
```

## Customize

1. **Identity** — search & replace `Your Name`, `你的名字`, `San Francisco, CA`,
   `yourname` (the GitHub / LinkedIn / Twitter handle), and
   `Curiosity is the spark.` across the HTML files. (Email isn't embedded
   anywhere — the contact form handles that, see below.)
2. **Avatar** — drop `avatar.png` (square, ~400×400) into `assets/img/`. A
   gradient placeholder shows up until you do.
3. **Favicon** — drop `favicon.png` (32×32 or 64×64) into `assets/img/`.
4. **About page** (`index.html`) — rewrite the bio, news list, and Misc
   sections.
5. **Research page** (`research.html`):
   - Each publication is a `<article class="pub-card" data-tags="...">`.
     Copy/paste one to add a new entry.
   - `data-tags="Data,Attribution,Theory"` controls which filter chips show
     the card. Tags must match the `data-tag` attributes on the filter
     buttons.
   - Tag color classes: `tag-blue`, `tag-purple`, `tag-magenta`, `tag-green`,
     `tag-gold`, `tag-red`, `tag-cyan`, `tag-orange`, `tag-volcano`,
     `tag-lime`, `tag-geekblue`.
   - Wrap your own name in `<span class="author author-me">` to bold it.
   - Wrap middle authors you want to collapse in `<span class="author
     author-hidden">` and add `<span class="authors-ellipsis">…,</span>`.
6. **CV** — drop `cv.pdf` at `assets/cv.pdf`; the CV icon in the sidebar links
   to it.
7. **Posts** — each entry is another `pub-card` in `posts.html`.
8. **Contact form** — see "Wiring up the contact form" below.

## Wiring up the contact form

`contact.html` posts to [Formspree](https://formspree.io/) so visitors can reach
you without your email appearing in the page source. Setup, one-time:

1. Sign up at https://formspree.io/ with the email address where you'd like
   submissions delivered.
2. Create a new form; copy the form ID (looks like `xyzwabcd`).
3. In `contact.html`, find this line:

   ```html
   action="https://formspree.io/f/YOUR_FORM_ID"
   ```

   Replace `YOUR_FORM_ID` with your actual ID.
4. Submit the form once from the live site and confirm the verification email
   Formspree sends you. Submissions then route to your inbox.

The form's JS handler refuses to submit while `YOUR_FORM_ID` is still the
placeholder, so you won't accidentally send broken submissions during testing.

Prefer a different service? Any form-relay (Getform, Web3Forms, Formsubmit)
that accepts a `POST` of form data will work — just swap the `action` URL.

## Deploy to GitHub Pages

### Option A: a user/organization site (`<username>.github.io`)

```bash
cd /Users/evasion/Desktop/website
git init
git add .
git commit -m "Initial commit"
git branch -M main
gh repo create <username>.github.io --public --source=. --remote=origin --push
```

GitHub serves `<username>.github.io` from `main` automatically. Your site
goes live at `https://<username>.github.io/` within a minute or two.

### Option B: a project site (any repo name)

```bash
cd /Users/evasion/Desktop/website
git init
git add .
git commit -m "Initial commit"
git branch -M main
gh repo create my-site --public --source=. --remote=origin --push
```

Then in the GitHub UI: **Settings → Pages → Build and deployment** →
*Source* `Deploy from a branch`, *Branch* `main`, folder `/ (root)`.
The site lives at `https://<username>.github.io/my-site/`.

### Custom domain (optional)

1. Create a `CNAME` file in the repo root containing your domain
   (e.g. `your-domain.com`).
2. In your DNS, add an `ALIAS`/`ANAME` (or four `A` records to GitHub's
   Pages IPs) pointing at `<username>.github.io`.
3. Enable **Enforce HTTPS** under Settings → Pages.

## Local preview

The site is plain static HTML, so any local server works:

```bash
cd /Users/evasion/Desktop/website
python3 -m http.server 8000
# open http://localhost:8000
```

## Features

- **Dark mode** — toggle in the sidebar; choice is saved to `localStorage`
  and respects `prefers-color-scheme` on first visit.
- **Tag filters** — click multiple chips on the research page; cards must
  match every active tag (AND filter).
- **Responsive** — sidebar collapses above the main content under 900 px.
- **Icons** — Font Awesome + Academicons loaded via CDN; no install needed.

## Notes

- The fonts and icon libraries load from CDNs (Google Fonts, cdnjs). For an
  offline-friendly build, self-host them under `assets/`.
- No analytics or trackers are wired in. Add your own if you want them.
- If you'd like LaTeX rendering in posts (like the original site's `\TeX`
  signature), add KaTeX via CDN and render with `auto-render`.
