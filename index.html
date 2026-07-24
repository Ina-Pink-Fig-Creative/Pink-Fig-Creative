export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { name, what, who, location, serve, about, extra, tone, services, extraSections, extraInsights, colourInstruction } = req.body;

  if (!name || !what || !who || !location || !services) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const servicesText = services
    .map(s => `- ${s.name}${s.price ? ' (' + s.price + ')' : ''}${s.desc ? ': ' + s.desc : ''}`)
    .join('\n');

  const extraSectionsText = extraSections && extraSections.length
    ? `\nADDITIONAL SECTIONS FROM COMPETITOR ANALYSIS: ${extraSections.join(', ')}. ${extraInsights}`
    : '';

  const aboutText = about ? `ABOUT THE BUSINESS OWNER: ${about}` : '';
  const extraNotes = extra ? `ADDITIONAL CONTEXT: ${extra}` : '';

  // Parse colours from colourInstruction
  const colours = colourInstruction || '';
  let primaryColour = '#333333';
  let secondaryColour = '#f5f5f5';
  let accentColour = '#666666';

  if (colours.includes('primary')) {
    const primaryMatch = colours.match(/primary ([#\w]+)/);
    if (primaryMatch) primaryColour = primaryMatch[1];
  }
  if (colours.includes('secondary')) {
    const secondaryMatch = colours.match(/secondary ([#\w]+)/);
    if (secondaryMatch) secondaryColour = secondaryMatch[1];
  }
  if (colours.includes('accent')) {
    const accentMatch = colours.match(/accent ([#\w]+)/);
    if (accentMatch) accentColour = accentMatch[1];
  }

  const toneDescriptions = {
    friendly: 'warm, conversational and approachable, like talking to a trusted friend',
    professional: 'polished, confident and credible, professional without being cold',
    bold: 'direct, strong and no-nonsense, straight to the point with no fluff',
    calm: 'gentle, supportive and reassuring, puts clients at ease immediately',
    playful: 'fun, energetic and full of personality, a little cheeky',
    inspiring: 'uplifting, empowering and motivational, makes clients feel they can achieve anything'
  };
  const toneStyle = toneDescriptions[tone] || toneDescriptions.friendly;

  const prompt = `You are an expert website copywriter. Generate a complete homepage HTML for a service-based business.

BUSINESS DETAILS:
- Business name: ${name}
- Services offered: ${what}
- Ideal client: ${who}
- Location: ${location}
- Where they serve clients: ${serve || 'not specified'}
- Services:
${servicesText}
${aboutText}
${extraNotes}
${extraSectionsText}

BRAND COLOURS (use these throughout — apply them to ALL headings, buttons, backgrounds, borders, and accents):
- Primary colour (headings, buttons, nav, section backgrounds): ${primaryColour}
- Secondary colour (alternate section backgrounds, card backgrounds): ${secondaryColour}
- Accent colour (highlights, links, borders): ${accentColour}
- White (#ffffff) for text on dark backgrounds and card content areas
- Use these colours consistently. Every button must use the primary colour. Every section heading must use the primary colour.

TONE OF VOICE: Write all copy in a ${toneStyle} tone.

CRITICAL RULES:
1. COPY FIRST. This is a homepage framework. Complete structured copy is the goal. Every section must have real, useful, specific copy based on the business details provided.
2. NO ANIMATIONS. Zero CSS transitions, keyframes, hover effects, transforms. Static HTML only.
3. SIMPLE CLEAN HTML. No gradients, no shadows, no box-shadow, no complex layouts. Flat colours only.
4. ALWAYS FINISH THE PAGE. If running low on tokens, simplify CSS but never cut a section. A simple complete page beats a beautiful incomplete one.
5. TOKEN BUDGET. Spend tokens on copy, not CSS. Keep CSS minimal and reuse classes.
6. TWO COLUMNS FOR LONG TEXT. Any text block over 100 words must be split into two columns or broken up with a heading or placeholder image between paragraphs.
7. IMAGE PLACEHOLDERS. Include placeholder images in every section that would benefit from one. Use a simple grey div with a label inside. Never leave image spots empty.

MANDATORY HOMEPAGE SECTIONS (all required, in this order):
1. NAV: Business name as logo on left, simple navigation links on right. Use primary colour as background.

2. HERO: 
   - H1 exactly 5-8 words
   - One subheading sentence
   - One CTA button in primary colour
   - A LARGE placeholder image on the right side (use a grey div at least 400px tall with text "[Hero image — add your best photo here]")
   - Layout: two columns, copy on left, image on right

3. IDEAL CUSTOMER:
   - Section heading
   - Short paragraph (under 50 words) addressing their situation
   - 5-6 bullet points showing you understand their pain points
   - Use secondary colour as background

4. SERVICES:
   - Section heading
   - Each service as a simple card: name, price if provided, 2-3 sentence description
   - Cards in a row (2 or 3 across)
   - CTA button below cards

5. ABOUT:
   - Two column layout: placeholder image on left, copy on right
   - Use the about text provided, written in first person
   - Placeholder image: grey div with "[Your photo here]"
   - One CTA button
   - Use secondary colour as background

6. TESTIMONIALS:
   - 3 placeholder testimonials in cards
   - Mark each as [PLACEHOLDER, replace with real testimonial]
   - Include placeholder name and business

7. CTA SECTION:
   - Strong heading
   - One short paragraph
   - One large CTA button in primary colour

8. FOOTER:
   - Business name
   - Simple nav links
   - Contact email: [your@email.com]
   - Copyright notice
   - Privacy Policy placeholder link
   - Use primary colour as background, white text
${extraSections && extraSections.length ? '\n9. COMPETITOR EXTRAS: ' + extraSections.join(', ') + ' — add simply after services section.' : ''}

TEA CHAT POPUP (add this at the very end of the body, before </body>):
A fixed popup in the bottom right corner of the page with:
- Background: primary colour (${primaryColour})
- White text
- Small heading: "Let's chat about your website"
- One line: "Book a free Tea Chat with Ina"
- A button linking to https://pinkfigcreative.as.me/teachat that says "Book now"
- A small X button to close it
- Position: fixed, bottom: 24px, right: 24px, width: 260px, padding: 20px, border-radius: 12px, border-top-left-radius: 0
- Include a small JavaScript snippet to handle the close button only (no other JS)

COPY RULES:
- Tone: ${toneStyle}
- First person: "I", never "we"
- Sentence case headings only
- No em dashes, use commas or full stops
- No italics
- H1 between 5 and 8 words, count carefully
- Speak directly to: ${who}
- Mention ${location} naturally for local SEO
- Make all copy specific to the business, not generic filler

HTML RULES:
- Google Font Montserrat only
- Mobile responsive with simple media queries
- No animations, no transitions, no keyframes
- No JavaScript except for the popup close button
- Keep all CSS in a single style tag in the head

OUTPUT: Return ONLY the complete HTML starting with <!DOCTYPE html> and ending with </html>. No explanation. No markdown. Just the HTML.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 14000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      return res.status(500).json({ error: data.error?.message || 'Anthropic API error' });
    }

    const textBlock = data.content && data.content.find(b => b.type === 'text');
    if (!textBlock) {
      return res.status(500).json({ error: 'No content returned from API' });
    }

    let html = textBlock.text.trim();
    if (html.startsWith('```')) {
      html = html.replace(/^```html?\n?/, '').replace(/\n?```$/, '');
    }

    // Safety check — ensure HTML is complete
    if (!html.includes('</html>')) {
      html = html + '\n</body>\n</html>';
    }

    return res.status(200).json({ html });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
