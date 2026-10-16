# Project Name — Bandra West

Static, responsive HTML/CSS/JavaScript website. Open `index.html` directly or serve this directory with any static HTTP server. No build step is required. Fonts, animation libraries and all displayed imagery are local.

The visual treatment follows https://halobyraghava.com/; project copy, pricing, floor plans, contact links and GTF configuration come from https://websitedesigningcompany.co.in/demo-gtf/kp-layout2/. This is a recreation adapted to the supplied content, rather than a pixel-identical copy. The reference's video and hundreds-frame image sequences are replaced with AI WebP imagery and scroll-driven image animation.

## Enquiry integration

`index.html` contains static forms with the supplied field IDs. Its inline integration script holds Agent ID `4444`, project `Godrej Global Business City Noida`, and the supplied Noida project/thank-you URLs. The same inline script loads the supplied GTF script and calls `SubmitQueryData` with each form’s field IDs, including its hidden country code. `js/intl.custom.js` initializes intl-tel-input 18.2.1, defaults to India, and synchronizes dial codes. No live leads were submitted during testing.

## Images

All images used by the site are WebP. No PNG, JPEG or SVG assets are referenced. `img/ai/hero.webp` was newly generated with the built-in imagegen tool and converted to WebP. Other AI-labelled visuals and the supplied floor plans/location image were downloaded from the content reference. AI imagery is illustrative and labelled accordingly.

Generation prompt: “Photorealistic architectural visualization of five elegant slender contemporary cream limestone and bronze glass residential towers beside the Arabian Sea in Bandra West Mumbai, lush tropical landscaped podium and curved infinity swimming pool in foreground, distant Bandra Worli Sea Link faintly visible. Golden sunset transitioning to warm smoky amber dusk, realistic materials, warm glowing windows, eye level perspective from landscaped pool deck. Towers on left and center, open dusk sky upper right. No text, logos or watermark. Conceptual AI illustration, not a factual photograph.”

## Verification

Verified in headless Chrome at 1440px desktop and 390px mobile widths, with reduced motion and normal animation. Checks covered loaded image assets, horizontal overflow, carousel controls, amenity switching, residence pricing and floor-plan changes, image dialog, enquiry validation/fallback, read-more and mobile navigation. No browser runtime errors or failed asset requests were observed. Live GTF delivery and the thank-you redirect require verification against the external service; browser checks mock that service to avoid submitting test leads.
