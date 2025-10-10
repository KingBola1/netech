# CoNet
Africa IT project
# CoNet Ltd – Website

Live site: https://kingbola1.github.io/CoNet/

A fast, mobile‑first marketing site for CoNet Ltd with productized services, cards, and simple contact paths. This README explains how to run, deploy, and maintain the site, plus how to add chat and fix the known mobile issue on the Services page.

---

## Pages

- Home: index.html
- About: about.html
- Services: services.html
- Portfolio: portfolio.html
- Contact: contact.html

Tech: HTML + CSS + vanilla JS. Hosted on GitHub Pages.

---

## Run locally

- Option A: open index.html in your browser.
- Option B (recommended): VS Code → install “Live Server” → right‑click index.html → Open with Live Server.

---

## Deploy (GitHub Pages)

- Commit/push to GitHub.
- Settings → Pages → Build from “Deploy from a branch” (main / root).
- Your site will be available at https://<username>.github.io/CoNet/

---

## Chat and contact integrations

You can have both a live chat (Tawk.to) and a WhatsApp floating button.

### 1) Tawk.to live chat

1) Sign up at tawk.to and add your website.
2) Copy your “property ID” from their installer (looks like 12345/abcdef).
3) Paste this block just ABOVE </body> in each HTML file (index, about, services, portfolio, contact).
   - Replace 12345/abcdef with your real ID.

```html
<!-- Tawk.to live chat -->
<script type="text/javascript">
  var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
  (function () {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://embed.tawk.to/12345/abcdef/DEFAULT";
    s.charset = "UTF-8";
    s.setAttribute("crossorigin", "*");
    document.body.appendChild(s);
  })();
</script>
```

Tip: Keep your own script line before third‑party code. Example page bottom order:

```html
<!-- WhatsApp button (see below) -->
<!-- <a ... class="whatsapp-float">💬</a> -->

<script src="js/script.js" defer></script>
<!-- then the Tawk.to block -->
```

### 2) WhatsApp floating button (with prefilled message)

- Paste this ONE line just ABOVE </body> on each page.
- Replace 2348012345678 with your phone (country code, no +, no spaces).
- Message used (multi‑line, shown prefilled in WhatsApp):
  Hello I'm Engr,
  Welcome to CoNet Ltd,
  Your Digital Transformation Partner
  How can we help you?

```html
<a href="https://wa.me/2348012345678?text=Hello%20I%27m%20Engr%2C%0AWelcome%20to%20CoNet%20Ltd%2C%0AYour%20Digital%20Transformation%20Partner%0AHow%20can%20we%20help%20you%3F" class="whatsapp-float" aria-label="Chat on WhatsApp" target="_blank" rel="noopener">💬</a>
```

Add this CSS once at the END of css/style.css. It keeps the button above the Tawk chat:

```css
/* WhatsApp floating button */
.whatsapp-float {
  position: fixed;
  right: 16px;
  bottom: 88px; /* lift above Tawk bubble; adjust if needed */
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #25D366;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 6px 20px rgba(0,0,0,.2);
  z-index: 2147483647 !important;
  text-decoration: none;
}
```

Notes
- Use only one WhatsApp link per page.
- If you prefer the left side, change right: 16px to left: 16px.

### 3) (Optional later) Crisp chat

Replace the Tawk block with this (paste just ABOVE </body>). Replace abcd-efgh-1234 with your Crisp Website ID.

```html
<script type="text/javascript">
  window.$crisp=[]; window.CRISP_WEBSITE_ID="abcd-efgh-1234";
  (function(){
    var d=document, s=d.createElement("script");
    s.src="https://client.crisp.chat/l.js"; s.async=1;
    d.getElementsByTagName("head")[0].appendChild(s);
  })();
</script>
```

---

## Fix: Mobile hamburger hidden on Services page

Cause: On services.html, the “chips carousel” (category filter with left/right arrows) pushed the page slightly wider than the screen, so the header aligned to the wider page and the hamburger slid off-screen.

Fix: Keep the carousel inside the viewport and let only the chip list scroll.

Paste this block at the END of css/style.css:

```css
/* === Services chips carousel overflow fix === */
.chip-carousel {
  position: relative;
  padding-inline: 56px;   /* space for the two arrow buttons inside */
  overflow: hidden;       /* prevents layout from getting wider than the screen */
  max-width: 100vw;
  box-sizing: border-box;
}

.chip-carousel .chips-scroller {
  display: inline-flex;
  gap: 12px;
  align-items: center;
  overflow-x: auto;       /* only the chips scroll */
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  max-width: 100%;
}

.chip-carousel .chip-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  z-index: 2;             /* sit above the chips, not beside them */
}
.chip-carousel .chip-nav.prev { left: 8px; }
.chip-carousel .chip-nav.next { right: 8px; }

/* Progress bar should not add width */
.chip-carousel .chip-progress {
  position: relative;
  overflow: hidden;
  max-width: 100%;
  box-sizing: border-box;
}

/* Optional: hide arrows on very small screens, users can swipe */
@media (max-width: 640px) {
  .chip-carousel { padding-inline: 0; }
  .chip-carousel .chip-nav { display: none; }
}

/* Optional global guard (hides tiny horizontal scrollbars) */
html, body { overflow-x: clip; }
```

Optional safety: keep the header width tied to the viewport.

```css
header, .navbar {
  position: sticky; /* or fixed if you want it always visible */
  top: 0;
  left: 0;
  right: 0;
  width: 100vw;
  max-width: 100vw;
  z-index: 1000;
}
```

Debug tool (use in DevTools Console) to find any future overflow:

```js
(() => {
  const vw = document.documentElement.clientWidth;
  document.querySelectorAll('*').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width > vw + 1) {
      el.style.outline = '2px solid red';
      console.log('Overflowing:', el, Math.round(r.width), '>', vw);
    }
  });
})();
```

---

## FAQs inside Tawk.to

You’re managing FAQs in Tawk (Knowledge Base) instead of adding FAQ HTML to pages.

How to set up:
- Tawk → Knowledge Base → create site (e.g., conet.tawk.help).
- Create a Category “Services”.
- Add these 6 articles (titles + body). Then enable “Show Knowledge Base in widget” in Chat Widget settings.

Use this content:

1) Title: How fast can you launch my website?
- We offer a “Launch in 2 Weeks” package: brand + 5‑page site + intro video.
- Includes mobile‑first pages, on‑page SEO, OG tags, analytics, and contact/quote forms.
- Typical timeline: ~10 business days after kickoff and content handover.
- Next step: https://kingbola1.github.io/CoNet/contact.html

2) Title: What’s included in Websites & Hosting?
- Modern, fast pages designed for conversions.
- On‑page SEO, OG tags, analytics setup.
- Contact/quote forms (optional CRM handoff).
- Optional CMS/blog for publishing articles.
- Ask for a proposal: https://kingbola1.github.io/CoNet/contact.html

3) Title: Can you set up e‑commerce with local payments?
- Yes—M‑Pesa, Paystack, Flutterwave, and Stripe.
- Store setup: products, variants, shipping, taxes, merchandising.
- Product templates with schema; abandoned cart + email hooks.
- Start here: https://kingbola1.github.io/CoNet/contact.html

4) Title: Do you provide ongoing support and maintenance?
- Care Plans (Hosting & Maintenance).
- SSL, backups, updates, monitoring, and monthly edits (1–6 hours depending on tier).
- Choose a plan: https://kingbola1.github.io/CoNet/contact.html

5) Title: Can you help with SEO and content?
- SEO Foundations: technical checks, on‑page fixes, internal linking, schema, keyword mapping.
- Content Engine: 2–4 SEO posts/month, internal links, social snippets, monthly performance report.
- Request an audit: https://kingbola1.github.io/CoNet/contact.html

6) Title: How will we measure results?
- KPI & Tracking: GA4/Plausible setup, events, attribution.
- Dashboards & Pipelines: connect your data, build executive dashboards with drill‑downs.
- Monthly insights so you can see what’s working.
- Book a setup: https://kingbola1.github.io/CoNet/contact.html

Pro tip: create Tawk Shortcuts for fast replies during chat:
- /launch, /hosting, /ecom, /support, /seo, /measure → paste the matching answer.

---

## Migration notes (moving off GitHub Pages)

- Tawk.to + WhatsApp work on any host. Keep the same snippets.
- WordPress: use the Tawk plugin or paste the snippet with a “Header & Footer” plugin.
- React/Next.js: add the Tawk snippet in your main layout (e.g., Next.js app/layout.js or pages/_document.js with next/script).

---

## Troubleshooting

- WhatsApp button hidden behind chat:
  - Ensure .whatsapp-float has z-index: 2147483647 and bottom: 88px (or move Tawk to bottom‑left in its settings).
- Hamburger off‑screen on Services:
  - Ensure you added the “chips carousel overflow fix” CSS above.
- Nothing loads on GitHub Pages:
  - Check Settings → Pages → Source (main / root). Confirm files are in the repository root and paths are relative (e.g., css/style.css, js/script.js).

---

## Contact

- Live site: https://kingbola1.github.io/CoNet/
- Add new services or fixes: open an issue or PR.
- Business inquiries: use the WhatsApp button on the site or the Tawk chat.
