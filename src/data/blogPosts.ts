import { BRAND } from "../config/brand";

/*
 * Blog articles that ship with the build.
 *
 * These live in the repo rather than the `blogs` table so the build can write
 * each one out as a real HTML page (see scripts/prerenderBlog.ts). A search
 * crawler then gets the title, description and full text in the first
 * response instead of an empty <div id="root"> it has to run JavaScript to
 * fill. Posts in the `blogs` table still work; a slug here wins over the same
 * slug there.
 *
 * Keep this file free of browser imports — vite.config.ts imports it at build
 * time, in Node. (`config/brand.ts` has no imports of its own, so it is safe.)
 *
 * Write things that stay true: how to judge, care for and wear a saree. Leave
 * out prices, discounts, delivery times and stock — those change, and the live
 * catalogue and policy pages are where a reader should find them.
 */

export interface BlogArticle {
  slug: string;
  title: string;
  /** Meta description: what shows under the link in Google. Aim for 140–160 characters. */
  description: string;
  /**
   * Either a file name under /assets/img/blogs/ or a path from the site root
   * (starting with "/"). See `blogImagePath`.
   */
  image: string;
  imageAlt: string;
  publishedAt: string;
  updatedAt: string;
  /** Article body as HTML: h2/h3/p/ul/ol/table/a only, styled by `.blog-article`. */
  html: string;
}

/** Shared picture for posts that have no photograph of their own yet. */
export const DEFAULT_ARTICLE_IMAGE = "/assets/img/logo/maragatha-og.jpg";

export const BLOG_INDEX_TITLE = `Silk Saree Guides & Care Tips | ${BRAND.name} Blog`;
export const BLOG_INDEX_DESCRIPTION =
  "Practical guides from Maragatha Silks: how to spot pure Kanchipuram silk, choose a wedding saree, care for and store silk, and drape it well.";

export const BLOG_INDEX_HEADING = "Silk Saree Guides & Care Tips";
export const BLOG_INDEX_INTRO = `From ${BRAND.silkName}, ${BRAND.town}: how to choose, care for and wear a silk saree.`;

/** Byline printed under an article's title. */
export const ARTICLE_BYLINE = `${BRAND.silkName}, ${BRAND.town}`;

/** Title suffix for an article's <title>. */
export const articlePageTitle = (title: string) => `${title} | ${BRAND.name}`;

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: "how-to-identify-pure-kanchipuram-silk",
    title: "How to Identify a Pure Kanchipuram Silk Saree: Zari, Korvai and the Silk Mark",
    description:
      "Tell a genuine Kanchipuram silk saree from a look-alike: check the zari, the korvai border join, the weight, the Silk Mark label and what a burn test shows.",
    image: DEFAULT_ARTICLE_IMAGE,
    imageAlt: "A Kanchipuram silk saree with a contrast zari border",
    publishedAt: "2026-10-19",
    updatedAt: "2026-10-19",
    html: `
<p>A Kanchipuram silk saree is often the most valuable piece of clothing a family owns. It is worn at a wedding, kept for decades and handed down. That is exactly why imitations are everywhere: power-loom sarees, art-silk blends and sarees with plastic "zari" that look convincing under shop lights. The good news is that a real Kanchipuram silk gives itself away if you know where to look. Here is what we check at ${BRAND.silkName}, and what you can check yourself.</p>

<h2>1. Look for the Silk Mark label</h2>
<p>The <strong>Silk Mark</strong> is a quality label run by the Silk Mark Organisation of India, under the Central Silk Board of the Ministry of Textiles. A saree that carries it has been declared as pure natural silk by a registered seller, and the label has a hologram and a unique number. It is the simplest first check: ask for it, and look for it on the tag.</p>
<p>The Silk Mark tells you the fibre is pure silk. It does not, on its own, tell you that the saree was woven in Kanchipuram or that the zari is real. For that, keep reading.</p>

<h2>2. Check the zari</h2>
<p>Zari is the metallic thread in the border and pallu. In a traditional Kanchipuram saree it is <strong>pure zari</strong>: a silk core thread wrapped in fine silver wire and coated with gold. Cheaper sarees use <strong>tested zari</strong> (a copper base with a silver and gold finish) or <strong>imitation zari</strong> made from metallised polyester film.</p>
<ul>
  <li><strong>The scratch test.</strong> On the reverse, at a loose end, gently scrape a zari thread with a fingernail. Pure zari shows a red or orange silk core under the metal. Copper shows a reddish metal; plastic shows a clear or white film.</li>
  <li><strong>The look.</strong> Real zari has a soft, deep glow, not a mirror-like glitter. Over the years pure zari darkens slightly but does not turn green or flake.</li>
  <li><strong>The feel.</strong> Imitation zari often feels stiff and scratchy. Pure zari is pliable and lies flat with the silk.</li>
</ul>

<h2>3. Turn it over and find the korvai</h2>
<p>Many Kanchipuram sarees have a border in a completely different colour from the body. In a handloom Kanchipuram this is done with the <strong>korvai</strong> technique: the body and border are woven separately, by two weavers working together, and interlocked thread by thread as the saree grows. Where the colours meet you will see a slightly irregular, interlocked line. It is not perfectly straight, because it is made by hand.</p>
<p>A power-loom imitation achieves a contrast border by printing, by floating threads across the back, or by stitching a separate border on. Turn the saree over: long loose threads on the reverse of the border, or a seam, are a sign it is not korvai.</p>
<p>The same applies to the pallu. In a traditional saree the pallu is often woven separately and joined to the body in a zig-zag line called <em>petni</em>. A hand-woven join is a good sign.</p>

<h2>4. Feel the weight and the weave</h2>
<p>Kanchipuram silk is woven from thick, multi-ply mulberry silk threads, so a traditional saree is noticeably heavy, often well over half a kilogram for a wedding piece. Rub the fabric between your fingers: pure silk feels warm and slightly grainy, never slippery or plastic. Hold it up to the light and look at the weave; it should be dense and even, with small irregularities that a machine would not make.</p>

<h2>5. The burn test, if you can spare a thread</h2>
<p>Take a single loose thread from the edge, never from the saree itself, and burn it over a sink. Pure silk burns slowly, smells of burnt hair, stops burning when you take the flame away and leaves a black ash that crushes to powder. Synthetic thread melts into a hard bead and smells of plastic.</p>

<h2>6. Buy from someone who will stand behind it</h2>
<p>None of these checks replaces buying from a seller who knows the weavers and will answer for what they sell. Ask where the saree was woven, whether the zari is pure or tested, and whether it carries the Silk Mark. A good shop will answer all three without hesitating.</p>
<p>Browse the <a href="/silks">${BRAND.silkName} collection</a> to see what we have this season, or read our guide to <a href="/blog/soft-silk-vs-kanchipuram-silk">soft silk vs Kanchipuram silk</a> if you are still deciding which kind to buy.</p>
`,
  },
  {
    slug: "silk-saree-care-and-storage",
    title: "How to Care for and Store Silk Sarees So They Last for Generations",
    description:
      "Simple rules for washing, ironing and storing silk sarees: dry cleaning, keeping zari bright, refolding, and what never to put in the wardrobe with silk.",
    image: DEFAULT_ARTICLE_IMAGE,
    imageAlt: "Silk sarees folded and wrapped in cotton cloth for storage",
    publishedAt: "2026-10-18",
    updatedAt: "2026-10-18",
    html: `
<p>A well-kept silk saree outlives the person who bought it. A badly kept one can split along its folds, lose its colour or have its zari turn black in a few years. The difference is rarely expensive; it is mostly a handful of habits. These are the ones that matter most.</p>

<h2>After wearing</h2>
<ul>
  <li><strong>Air it before you fold it.</strong> Hang the saree in the shade for a few hours so that sweat and moisture dry out. Never put a silk saree away damp.</li>
  <li><strong>Deal with stains quickly.</strong> Blot (do not rub) a fresh spill with a clean, dry cloth. For oil, food or turmeric stains, take it to a dry cleaner who handles silk rather than trying soap at home.</li>
  <li><strong>Keep perfume and deodorant off the silk.</strong> Spray before you drape, and let it dry. Alcohol-based scents can mark silk and dull zari.</li>
</ul>

<h2>Washing</h2>
<p>For a Kanchipuram or any heavy zari saree, <strong>dry cleaning is the safe choice</strong>, especially for the first few washes, when the dyes are most likely to run. Soft silks without heavy zari can be hand-washed at home with care:</p>
<ol>
  <li>Use cold water and a mild liquid detergent made for silk or wool. Never use bleach.</li>
  <li>Wash the border and pallu separately from the body if the colours contrast, so dye cannot run from one into the other.</li>
  <li>Do not soak for long, and do not scrub or wring. Press the water out gently in a towel.</li>
  <li>Dry flat or on a padded hanger in the shade. Direct sunlight fades silk.</li>
</ol>

<h2>Ironing</h2>
<p>Iron silk on the reverse, at the silk or low setting, with a thin cotton cloth between the iron and the saree. Never iron directly on zari, and do not spray water on silk while ironing: it can leave water marks. A steamer held a little away from the fabric works well for creases.</p>

<h2>Storing</h2>
<ul>
  <li><strong>Wrap each saree in soft cotton or muslin cloth.</strong> Silk needs to breathe. Plastic covers trap moisture and can yellow the fabric.</li>
  <li><strong>Keep zari away from air and light.</strong> Folding the saree with the zari on the inside, or wrapping the zari portions in a separate piece of cloth, slows tarnishing.</li>
  <li><strong>Refold every two or three months.</strong> Silk that sits on the same fold for years weakens and can split along the crease. Change the fold lines, or roll heavy sarees around a cardboard tube instead.</li>
  <li><strong>Do not hang heavy silk for long periods.</strong> The weight of the zari pulls on the fabric. Hanging is fine for a few days, folding is better for storage.</li>
  <li><strong>Avoid naphthalene balls touching the saree.</strong> They can discolour silk and zari. If you want protection from insects, use dried neem leaves or cloves in a small cloth pouch, kept beside the saree rather than on it.</li>
  <li><strong>Keep the cupboard dry.</strong> In humid months, a sachet of silica gel in the shelf helps against mould.</li>
</ul>

<h2>Once a year</h2>
<p>Take your silks out, air them in the shade for an hour, check for any insect damage, and refold them on new lines. It takes an afternoon and adds years to every saree.</p>
<p>Not sure your saree is pure silk in the first place? Read <a href="/blog/how-to-identify-pure-kanchipuram-silk">how to identify a pure Kanchipuram silk saree</a>. Looking for a new one? See the <a href="/silks">${BRAND.silkName} collection</a>.</p>
`,
  },
  {
    slug: "choosing-a-wedding-silk-saree",
    title: "Choosing a Wedding Silk Saree: Colour, Weight, Zari and Timing",
    description:
      "A calm, step-by-step guide to choosing a bridal or wedding silk saree: colours for each ceremony, weight and zari, matching the blouse, and when to start shopping.",
    image: DEFAULT_ARTICLE_IMAGE,
    imageAlt: "A bridal silk saree with a rich zari pallu",
    publishedAt: "2026-10-17",
    updatedAt: "2026-10-17",
    html: `
<p>For many families, the wedding silk saree is the single most important purchase of the wedding. It appears in every photograph, it is worn for long hours in a hot hall, and it will be kept for years afterwards. A little planning makes the choice much easier, and much more enjoyable.</p>

<h2>Start with the ceremony, not the saree</h2>
<p>Most South Indian weddings have more than one saree. Decide first which one you are buying for, because each event asks for something different.</p>
<ul>
  <li><strong>Muhurtham.</strong> The main ceremony usually calls for a traditional Kanchipuram silk in rich colours: deep red, maroon, arakku, mustard, peacock blue or bottle green, with a heavy zari border and pallu. Many families have their own custom on colour; ask the elders before you shop.</li>
  <li><strong>Reception.</strong> Evening lighting suits jewel tones and pastels, and a lighter silk is far more comfortable for hours of standing and greeting guests.</li>
  <li><strong>Engagement, mehendi and other functions.</strong> This is the place for soft silks, lighter zari and more playful colours.</li>
</ul>

<h2>Think about weight and comfort</h2>
<p>A heavy bridal Kanchipuram is beautiful, but it is heavy. If the ceremony is long or the season is hot, consider a saree with zari concentrated in the border and pallu and a lighter body, or a fine-count silk that drapes more softly. Hold the saree up and drape it over your shoulder in the shop: you will know quickly whether you can wear it all day.</p>

<h2>Look closely at the zari</h2>
<p>Ask whether the zari is <strong>pure zari</strong> or tested zari. Pure zari costs more, but it keeps its glow for decades and holds its value. If you want an heirloom, it is worth it. Our guide to <a href="/blog/how-to-identify-pure-kanchipuram-silk">identifying pure Kanchipuram silk</a> explains the difference and how to check.</p>

<h2>Match the saree to the jewellery and the photographs</h2>
<ul>
  <li><strong>Gold jewellery</strong> stands out best against deep, saturated colours.</li>
  <li><strong>Contrast borders</strong> (a green saree with a pink border, for example) photograph well and frame the face.</li>
  <li><strong>Very busy all-over zari</strong> can compete with heavy jewellery. If the jewellery is grand, a plainer body lets it shine.</li>
  <li>Look at the saree in daylight, not only under shop lights. Colours shift, and wedding photographs are often taken outdoors.</li>
</ul>

<h2>Leave time for finishing</h2>
<p>A new saree is rarely ready to wear the day you buy it. It needs falls and pico, and the blouse has to be cut and stitched, often with lining and work on the sleeves. Tailors are at their busiest in the wedding season, so start shopping at least a month or two before the date, and earlier if the blouse has embroidery.</p>
<p>Keep in mind that a blouse piece that has been cut, or a saree that has had falls and pico done, cannot be returned. Our <a href="/cancellation-policy">returns policy</a> explains why. Be sure of the saree before you send it to the tailor.</p>

<h2>Bring the right people, and not too many</h2>
<p>One or two people whose taste you trust is ideal. Too many opinions makes a simple decision impossible. Bring a photograph of the jewellery you will wear, and of the groom's outfit if it is already chosen.</p>

<h2>Set a budget, then stay flexible</h2>
<p>Decide a range before you start, and tell the shop. A good silk house will show you the best sarees within it rather than steering you upwards. If something just above the range is clearly better, you can decide with the facts in front of you.</p>
<p>When you are ready, browse the <a href="/silks">${BRAND.silkName} wedding collection</a>. After the wedding, our <a href="/blog/silk-saree-care-and-storage">silk care and storage guide</a> will help the saree last as long as the memories.</p>
`,
  },
  {
    slug: "soft-silk-vs-kanchipuram-silk",
    title: "Soft Silk vs Kanchipuram Silk: Which Saree Is Right for You?",
    description:
      "Soft silk or Kanchipuram silk? Compare weight, drape, zari, care and the occasions each suits, so you can choose the right silk saree with confidence.",
    image: DEFAULT_ARTICLE_IMAGE,
    imageAlt: "A soft silk saree beside a Kanchipuram silk saree",
    publishedAt: "2026-10-16",
    updatedAt: "2026-10-16",
    html: `
<p>Walk into any silk shop and you will be asked the same question: soft silk or Kanchipuram? Both are pure silk, both can be beautiful, and they suit very different days. Here is a plain comparison.</p>

<h2>What makes them different</h2>
<p><strong>Kanchipuram silk</strong> is the traditional heavy silk of Kanchipuram in Tamil Nadu, protected by a Geographical Indication. It is woven from thick, multi-ply mulberry silk, usually with a contrast border joined by the korvai technique and a pallu rich in zari. It is stiff when new, with a structured drape and a deep shine.</p>
<p><strong>Soft silk</strong> is a broad name for lighter silk sarees woven with finer threads. They are fluid, light and drape close to the body. Zari, if there is any, is usually lighter and more restrained, and the designs range from traditional to very modern.</p>

<h2>Side by side</h2>
<table>
  <thead>
    <tr><th></th><th>Kanchipuram silk</th><th>Soft silk</th></tr>
  </thead>
  <tbody>
    <tr><td>Weight</td><td>Heavy</td><td>Light</td></tr>
    <tr><td>Drape</td><td>Structured, holds pleats sharply</td><td>Fluid, falls close to the body</td></tr>
    <tr><td>Zari</td><td>Rich border and pallu, often pure zari</td><td>Lighter, sometimes none</td></tr>
    <tr><td>Best for</td><td>Weddings, muhurtham, major festivals</td><td>Functions, office, temple visits, gifting</td></tr>
    <tr><td>Comfort over a long day</td><td>Warmer and heavier</td><td>Easy to wear for hours</td></tr>
    <tr><td>Care</td><td>Dry clean</td><td>Gentle hand wash is often possible</td></tr>
    <tr><td>Long-term value</td><td>An heirloom; holds value with pure zari</td><td>A wardrobe staple</td></tr>
  </tbody>
</table>

<h2>Choose Kanchipuram if&hellip;</h2>
<ul>
  <li>It is for a wedding, the main day of a festival or a once-in-a-lifetime occasion.</li>
  <li>You want a saree to keep and pass on.</li>
  <li>You like a crisp, regal drape and do not mind the weight.</li>
</ul>

<h2>Choose soft silk if&hellip;</h2>
<ul>
  <li>You will wear it often: to functions, to work or for a long day on your feet.</li>
  <li>You want something easy to drape, pack and look after.</li>
  <li>You are buying a gift and want something that will actually be worn.</li>
</ul>

<h2>Whichever you choose</h2>
<p>Both should be pure silk. Ask for the Silk Mark, and learn the simple checks in our guide to <a href="/blog/how-to-identify-pure-kanchipuram-silk">identifying pure silk</a>. Look after them the same way too: see <a href="/blog/silk-saree-care-and-storage">caring for and storing silk sarees</a>.</p>
<p>You will find both in the <a href="/silks">${BRAND.silkName} collection</a>.</p>
`,
  },
  {
    slug: "how-to-drape-a-silk-saree",
    title: "How to Drape a Silk Saree Neatly: Step-by-Step Tips for Crisp Pleats",
    description:
      "Drape a silk saree that stays in place all day: preparation, pre-pleating the pallu, crisp front pleats, and pinning tips for heavy Kanchipuram silk.",
    image: DEFAULT_ARTICLE_IMAGE,
    imageAlt: "A silk saree draped with neat front pleats",
    publishedAt: "2026-10-15",
    updatedAt: "2026-10-15",
    html: `
<p>Silk behaves differently from cotton or chiffon. A heavy silk holds a pleat beautifully once it is set, but it slips if it is not secured, and it shows every uneven fold. These tips are for the classic drape worn across most of India, with pleats at the front and the pallu over the left shoulder.</p>

<h2>Before you start</h2>
<ul>
  <li><strong>Make sure the saree is finished.</strong> Falls along the lower edge give the pleats weight and protect the border; pico finishes the raw edge. A silk saree without falls never hangs properly.</li>
  <li><strong>Wear a well-fitted petticoat</strong> in a matching colour, tied firmly at the waist. Everything is tucked into it.</li>
  <li><strong>Put on your footwear first.</strong> The saree should just touch the top of your feet with the shoes you will wear, so set the length with them on.</li>
  <li><strong>Keep small safety pins ready</strong>: usually three or four for the pallu, one for the pleats and one at the shoulder.</li>
</ul>

<h2>Step by step</h2>
<ol>
  <li><strong>Tuck the plain end.</strong> Starting at your right hip, tuck the plain end of the saree into the petticoat and wrap it once around your waist, keeping the lower edge just touching the floor.</li>
  <li><strong>Pre-pleat the pallu.</strong> Bring the rest of the saree round under your right arm and up over your left shoulder. Before you pin it, fold the pallu into even pleats about four to five inches wide. For heavy silk, it is easiest to do this on a bed or table the evening before, and iron or press the pleats so they hold.</li>
  <li><strong>Pin the pallu.</strong> Pin the pleated pallu to the blouse at the shoulder from underneath, so the pin does not show. Let it fall to about the back of your knees.</li>
  <li><strong>Make the front pleats.</strong> Gather the remaining fabric into five to seven pleats of equal width, folding from left to right. Line up the border at the bottom so every pleat edge sits on top of the last.</li>
  <li><strong>Secure the pleats.</strong> Hold the pleats together, pin them once a little below the top, and tuck them into the petticoat at the centre, slightly to the left of your navel. The pleats should face left.</li>
  <li><strong>Set the fall.</strong> Run your hand down the pleats to straighten them. Walk a few steps; if the hem drags or rises, adjust before the final pin.</li>
</ol>

<h2>Tips that make the difference</h2>
<ul>
  <li><strong>Iron the pleats the night before</strong> with a cloth between the iron and the silk. A Kanchipuram saree that is pre-pleated and stored that way drapes in half the time.</li>
  <li><strong>Use the border as your guide.</strong> If the border lines up at the hem and along the pallu, the drape will look neat.</li>
  <li><strong>Do not over-pin.</strong> Too many pins damage silk and stop it from moving naturally. Pin where the weight sits: shoulder and pleats.</li>
  <li><strong>Pin into the blouse, not the skin side of the saree.</strong> Fewer holes in the silk means a longer life.</li>
  <li><strong>Take the pins out carefully</strong> when you undress, and refold the saree once it has aired. See <a href="/blog/silk-saree-care-and-storage">how to care for silk sarees</a>.</li>
</ul>
<p>Looking for a saree to practise on, or one for a special day? Visit the <a href="/silks">${BRAND.silkName} collection</a>, or read our guide to <a href="/blog/choosing-a-wedding-silk-saree">choosing a wedding silk saree</a>.</p>
`,
  },
];

export function findBlogArticle(slug: string | undefined): BlogArticle | undefined {
  return BLOG_ARTICLES.find((a) => a.slug === slug);
}

/**
 * Site-relative path of a blog image. Database posts store a bare file name
 * under /assets/img/blogs/; articles here may give a path from the site root
 * instead, so they can share an image that lives elsewhere.
 */
export function blogImagePath(image: string | null | undefined): string {
  if (!image) return DEFAULT_ARTICLE_IMAGE;
  if (image.startsWith("/") || /^https?:\/\//.test(image)) return image;
  return `/assets/img/blogs/${image}`;
}

/** Absolute URL of an article's image. */
export function articleImageUrl(siteUrl: string, a: BlogArticle): string {
  const path = blogImagePath(a.image);
  return /^https?:\/\//.test(path) ? path : `${siteUrl}${path}`;
}

/**
 * schema.org Article + BreadcrumbList for one post. Used both by the page in
 * the browser and by the build step that writes the static HTML, so the two
 * never disagree.
 */
export function articleJsonLd(siteUrl: string, a: BlogArticle): object {
  const url = `${siteUrl}/blog/${a.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: a.title,
        description: a.description,
        image: articleImageUrl(siteUrl, a),
        datePublished: a.publishedAt,
        dateModified: a.updatedAt,
        mainEntityOfPage: url,
        url,
        author: { "@type": "Organization", name: BRAND.name, url: siteUrl },
        publisher: {
          "@type": "Organization",
          name: BRAND.name,
          logo: { "@type": "ImageObject", url: `${siteUrl}${BRAND.logoFull}` },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
          { "@type": "ListItem", position: 3, name: a.title, item: url },
        ],
      },
    ],
  };
}
