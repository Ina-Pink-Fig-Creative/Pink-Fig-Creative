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

  const { name, what, who, location, serve, about, extra, services, extraSections, extraInsights, colourInstruction } = req.body;

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
  const colours = colourInstruction || 'COLOURS: Use a clean neutral palette, white background, soft warm accents, dark professional text.';

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

${colours}

CRITICAL RULES — read carefully before writing a single line:

1. COPY FIRST. This is a homepage framework, not a design showcase. The purpose is to give the business owner a complete, structured copy template they can take into Squarespace or give to a designer. Every decision should serve the copy, not the other way around.

2. NO ANIMATIONS. Zero. No CSS transitions, no keyframes, no hover effects, no transform effects, no opacity changes, no JavaScript interactions. Static HTML only.

3. KEEP IT SIMPLE. Plain clean HTML. No complex layouts. No decorative elements. No gradients. No shadows. No fancy CSS. Simple flat colours only.

4. ALWAYS FINISH. You must complete the entire page including the footer closing tags. Never cut off mid-section. If you are running out of space, simplify the CSS — never cut content sections. A complete simple page is better than a beautiful incomplete one.

5. TOKEN BUDGET. You have a limited token budget. Spend it on copy, not CSS. Write minimal CSS. Reuse classes. No duplicate styles.

MANDATORY HOMEPAGE SECTIONS (all required, in this order):
1. NAV: Logo/business name and a simple contact link.
2. HERO: H1 exactly 5-8 words. One subheading sentence. One CTA button.
3. IDEAL CUSTOMER: A short paragraph addressing their pain points, followed by 4-6 bullet points showing you understand their situation.
4. SERVICES: Each service as a simple card. Name, price if provided, 2-3 sentence description.
5. ABOUT: Use the about text provided. Warm, personal, first person. One CTA.
6. TESTIMONIALS: 3 placeholder testimonials. Mark clearly as [PLACEHOLDER, replace with real testimonial].
7. CTA SECTION: One strong closing call to action with a button.
8. FOOTER: Business name, simple nav links, copyright, privacy policy placeholder, contact email placeholder.
${extraSections && extraSections.length ? '\n9. COMPETITOR EXTRAS: ' + extraSections.join(', ') + ' — add simply after services.' : ''}

COPY RULES:
- First person: "I", never "we"
- Short punchy sentences
- Warm, direct tone
- Sentence case headings only
- No em dashes, use commas or full stops
- No italics
- H1 between 5 and 8 words exactly, count carefully
- Speak directly to: ${who}
- Mention ${location} naturally for local SEO

HTML AND CSS RULES:
- Google Font Montserrat only
- Mobile responsive with simple media queries
- Flat colours only, no gradients, no shadows, no box-shadow
- No animations, no transitions, no keyframes, no hover effects
- Simple card layout for services: white background, thin border, padding
- Keep all CSS minimal and reuse classes wherever possible
- No JavaScript at all

OUTPUT: Return ONLY the complete HTML starting with <!DOCTYPE html> and ending with </html>. No explanation. No markdown. No code blocks. Just the HTML.`;

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
