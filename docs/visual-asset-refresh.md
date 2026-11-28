# Website visual asset pack

## Homepage hero

`public/images/editorial/home-hero-cutouts.webp` is the transparent 1200 × 1500 WebP used on the homepage. The original collage was generated with built-in ImageGen using this prompt.

> Create a photorealistic premium shopping-editorial product collage on a genuinely transparent background with an alpha channel, a wide 3:2 canvas designed for the right column of a website hero. Five clean product cutouts in one cohesive asymmetrical arrangement, with a graphite dual-basket air fryer and ivory cylindrical air purifier anchoring the rear, slim open silver laptop adding a low diagonal, a single cream-and-navy running shoe and compact metallic earbuds with open charging case in front. Believable scale relationships, restrained soft studio light, crisp clean silhouettes, charcoal navy ivory palette, subtle depth from overlap and soft shadows confined to within the arrangement. Fill 90 percent of the canvas width and keep at least 5 percent clear margin, nothing clipped. No backdrop, no room, no floor, no plinth, no backdrop gradient, no text, no logos, no border. These are illustrative consumer products, with optically realistic materials and tidy commercial photography finish.

The files in `public/images/inventory-refresh/` use the workbook’s slot IDs as file stems. They are staged alongside the current site assets. The 243 slots marked “Yes” in the workbook resolve to existing files in the current workspace.

## Manufacturer product imagery

### Homepage ranking cards

The banners in `public/images/ranking-cards/` match the model shown as the top pick. The card checks the current pick against the photographed model and uses a category icon if the rank changes. The backdrops are editorial styling.

| Product | Product photo source |
| --- | --- |
| Tefal Easy Fry Mega EY855D | Existing manufacturer packshot from the [Tefal gallery](https://tefalstore.myshopify.com/products/tefal-easy-fry-mega-7-5l-xxl-air-fryer-ey855d) |
| Xiaomi Smart Air Purifier 4 Compact | Existing manufacturer packshot from the [Xiaomi gallery](https://www.mi.com/global/product/xiaomi-smart-air-purifier-4-compact/) |
| Origin Hybrid Mattress | [Origin Sleep Malaysia product gallery](https://originmattress.com.my/products/origin-hybrid-mattress) |
| Dyson V12 Detect Slim Absolute | [Dyson Malaysia product gallery](https://www.dyson.my/dyson-v12-detect-slim-absolute-hepa) |
| AirPods Pro 2 with USB-C | [Apple Newsroom product images](https://www.apple.com/newsroom/2023/09/apple-upgrades-airpods-pro-2nd-generation-with-usb-c-charging/) |
| Cetaphil Gentle Skin Cleanser 236 ml | [Watsons Malaysia product listing](https://www.watsons.com.my/cetaphil-gentle-skin-cleanser-for-face-body-236ml/p/BP_59381) |
| Bosch WGG254A0SG | [Bosch Malaysia product gallery](https://www.bosch-home.com.my/en/mkt-product/washers-dryers/washing-machines/front-load-washing-machines/WGG254A0SG) |
| MacBook Air M5 | [Apple Newsroom product images](https://www.apple.com/newsroom/2026/03/apple-introduces-the-new-macbook-air-with-m5/) |
| Apple Watch SE 3 | [Apple Newsroom product images](https://www.apple.com/newsroom/2025/09/apple-introduces-apple-watch-se-3/) |
| TCL 65P8L | [TCL Malaysia model gallery](https://www.tcl.com/my/en/support-tv/model/65p8l) |
| Nike Pegasus 41 | [Nike Malaysia product gallery](https://www.nike.com/my/t/pegasus-41-mens-road-running-shoes-RZm89S) |

The built-in ImageGen prompts requested empty landscape studio scenes, with the centre kept clear for placing the photographed products. The scenes used limestone kitchen surfaces, a timber-floor home interior, a midnight blue technology studio and a muted clay running track. The existing product images were cropped and scaled to fit their individual proportions.

### Guide photography

The responsive guide banners in `public/images/guides/` use original built-in ImageGen photography. The prompts requested realistic, wide editorial scenes with soft natural contrast, a warm grade, no logos or overlay text, and the subject kept inside the central crop. The seven scenes show an air fryer in use, its basket being cleaned, an air purifier by an apartment window, a person checking mattress firmness, two air fryers on a worktop, a robot and stick vacuum, and a cleanser on a bathroom counter.

### Review imagery inventory

Each product has an 800 × 800 WebP pack shot (`prod-<id>.webp`) and a 1680 × 720 WebP review banner (`review-<id>.webp`). Review banners reuse the same manufacturer imagery with added canvas space.

| Product ID | Manufacturer gallery |
| --- | --- |
| `dyson-tp09` | [Dyson Malaysia, TP09 White/Gold](https://www.dyson.my/dyson-purifier-cool-formaldehyde-white-gold) |
| `philips-1000-dual-na150` | [Philips Malaysia, NA150/09](https://www.philips.com.my/c-p/NA150_09/1000-series-dual-basket-airfryer) |
| `samsung-galaxy-buds3` | [Samsung Malaysia, Galaxy Buds3 Silver](https://www.samsung.com/my/audio-sound/galaxy-buds/galaxy-buds3-silver-sm-r530nzaaxme/) |
| `tefal-easy-fry-mega-ey855d` | [Tefal, EY855D gallery](https://tefalstore.myshopify.com/products/tefal-easy-fry-mega-7-5l-xxl-air-fryer-ey855d) |
| `xiaomi-ap4-compact` | [Xiaomi, Smart Air Purifier 4 Compact](https://www.mi.com/global/product/xiaomi-smart-air-purifier-4-compact/) |

Manufacturer image reuse rights were not verified. The other 105 models retain their existing site imagery.

## Brand, tools and methodology

The dark wordmark is a 1200 × 320 PNG export of the site's existing lockup. The seven tool icons are 96 × 96 SVGs styled to match the site's icon set. The 1200 × 800 methodology WebP uses the seven published scorecard weights.

The three team headshots require approved portraits and consent, as specified in the inventory.

## Editorial banners

Eleven 1680 × 720 WebP banners were generated with the built-in ImageGen tool. Appliance and product scenes are illustrative.

### `categories-hero.webp`

Create one premium photorealistic website editorial banner, subject: A premium Malaysian apartment living space with a dark TV, understated air purifier, and small laptop on a side table, seen as an elegantly furnished room with soft daylight. Extremely wide 21:9 composition, landscape, plan for a central 1680x720 crop and keep key details within middle half of image height. Soft side daylight, neutral ivory, muted navy and stone tones, tactile materials, beautifully restrained Malaysian lifestyle magazine photography, natural optical depth, plausible physical objects. Clean negative space to the left, subject mostly to the center-right; no embedded text, visible branding or watermark.

### `guide-hero-is-an-air-fryer-worth-it.webp`

Create one premium photorealistic website editorial banner, subject: A brushed charcoal air fryer and a small ceramic plate of crisp golden potato wedges on a Malaysian apartment kitchen island. Extremely wide 21:9 composition, landscape, plan for a central 1680x720 crop and keep key details within middle half of image height. Soft side daylight, neutral ivory, muted navy and stone tones, tactile materials, beautifully restrained Malaysian lifestyle magazine photography, natural optical depth, plausible physical objects. Clean negative space to the left, subject mostly to the center-right; no embedded text, visible branding or watermark.

### `guide-hero-how-to-clean-an-air-fryer.webp`

Create one premium photorealistic website editorial banner, subject: A removable nonstick air fryer basket seated beside the appliance, damp soft sponge and folded cloth on a stone counter, realistic detailing. Extremely wide 21:9 composition, landscape, plan for a central 1680x720 crop and keep key details within middle half of image height. Soft side daylight, neutral ivory, muted navy and stone tones, tactile materials, beautifully restrained Malaysian lifestyle magazine photography, natural optical depth, plausible physical objects. Clean negative space to the left, subject mostly to the center-right; no embedded text, visible branding or watermark.

### `guide-hero-do-you-need-an-ionizer.webp`

Create one premium photorealistic website editorial banner, subject: A modern matte ivory air purifier with realistic perforations near a linen curtain in a tranquil Malaysian apartment, no effects or visible airflow. Extremely wide 21:9 composition, landscape, plan for a central 1680x720 crop and keep key details within middle half of image height. Soft side daylight, neutral ivory, muted navy and stone tones, tactile materials, beautifully restrained Malaysian lifestyle magazine photography, natural optical depth, plausible physical objects. Clean negative space to the left, subject mostly to the center-right; no embedded text, visible branding or watermark.

### `guide-hero-mattress-firmness-for-back-pain.webp`

Create one premium photorealistic website editorial banner, subject: Quiet modern bedroom with an exposed quilted mattress corner, careful textile details and morning daylight. Extremely wide 21:9 composition, landscape, plan for a central 1680x720 crop and keep key details within middle half of image height. Soft side daylight, neutral ivory, muted navy and stone tones, tactile materials, beautifully restrained Malaysian lifestyle magazine photography, natural optical depth, plausible physical objects. Clean negative space to the left, subject mostly to the center-right; no embedded text, visible branding or watermark.

### `guide-hero-update-air-fryer-list.webp`

Create one premium photorealistic website editorial banner, subject: Three different generic air fryers side by side on a large stone counter, realistically spaced and photographed with clean product-review editorial styling. Extremely wide 21:9 composition, landscape, plan for a central 1680x720 crop and keep key details within middle half of image height. Soft side daylight, neutral ivory, muted navy and stone tones, tactile materials, beautifully restrained Malaysian lifestyle magazine photography, natural optical depth, plausible physical objects. Clean negative space to the left, subject mostly to the center-right; no embedded text, visible branding or watermark.

### `guide-hero-robot-vs-cordless-vacuum.webp`

Create one premium photorealistic website editorial banner, subject: A round robot vacuum and a cordless stick vacuum sharing a modern living-room floor, both clear and visually distinct. Extremely wide 21:9 composition, landscape, plan for a central 1680x720 crop and keep key details within middle half of image height. Soft side daylight, neutral ivory, muted navy and stone tones, tactile materials, beautifully restrained Malaysian lifestyle magazine photography, natural optical depth, plausible physical objects. Clean negative space to the left, subject mostly to the center-right; no embedded text, visible branding or watermark.

### `guide-hero-how-to-choose-a-facial-cleanser.webp`

Create one premium photorealistic website editorial banner, subject: Three unbranded cleanser containers with different silhouettes in a limestone bathroom and soft reflections, one restrained gel swatch. Extremely wide 21:9 composition, landscape, plan for a central 1680x720 crop and keep key details within middle half of image height. Soft side daylight, neutral ivory, muted navy and stone tones, tactile materials, beautifully restrained Malaysian lifestyle magazine photography, natural optical depth, plausible physical objects. Clean negative space to the left, subject mostly to the center-right; no embedded text, visible branding or watermark.

### `guide-hero-how-to-read-our-scores.webp`

Create one premium photorealistic website editorial banner, subject: A design-forward tabletop scene with laptop, plain printed evaluation sheets with graphic marks and no legible text, and pen. Extremely wide 21:9 composition, landscape, plan for a central 1680x720 crop and keep key details within middle half of image height. Soft side daylight, neutral ivory, muted navy and stone tones, tactile materials, beautifully restrained Malaysian lifestyle magazine photography, natural optical depth, plausible physical objects. Clean negative space to the left, subject mostly to the center-right; no embedded text, visible branding or watermark.

### `guide-hero-malaysia-buying-basics.webp`

Create one premium photorealistic website editorial banner, subject: A contemporary Malaysian apartment table with a shopper's hands comparing products on a laptop and phone, screen details unobtrusive and unreadable. Extremely wide 21:9 composition, landscape, plan for a central 1680x720 crop and keep key details within middle half of image height. Soft side daylight, neutral ivory, muted navy and stone tones, tactile materials, beautifully restrained Malaysian lifestyle magazine photography, natural optical depth, plausible physical objects. Clean negative space to the left, subject mostly to the center-right; no embedded text, visible branding or watermark.

### `about-hero.webp`

Create one premium photorealistic website editorial banner, subject: A refined editorial worktable in daylight, with an open laptop, a compact unbranded gadget and notes, human presence implied through a carefully arranged workspace. Extremely wide 21:9 composition, landscape, plan for a central 1680x720 crop and keep key details within middle half of image height. Soft side daylight, neutral ivory, muted navy and stone tones, tactile materials, beautifully restrained Malaysian lifestyle magazine photography, natural optical depth, plausible physical objects. Clean negative space to the left, subject mostly to the center-right; no embedded text, visible branding or watermark.

