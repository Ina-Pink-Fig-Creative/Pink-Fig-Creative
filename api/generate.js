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

  const { name, what, who, location, serve, about, services, extraSections, extraInsights, colourInstruction } = req.body;

  if (!name || !what || !who || !location || !services) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const servicesText = services
    .map(s => `- ${s.name}${s.price ? ' (' + s.price + ')' : ''}${s.desc ? ': ' + s.desc : ''}`)
    .join('\n');

  const extraSectionsText = extraSections && extraSections.length
    ? `\n\nCOMPETITOR ANALYSIS: also add these sections:\n${extraSections.map(s => '- ' + s).join('\n')}\n${extraInsights ? 'Context: ' + extraInsights : ''}`
    : '';

  const aboutText = about
    ? `ABOUT THE BUSINESS OWNER: ${about}`
    : '';

  const colours = colourInstruction || 'COLOURS: Use a clean neutral palette, white background, soft warm accents, dark professional text.';

  const prompt = `You are an expert website copywriter. Generate a complete professional homepage HTML for a service-based business.

BUSINESS DETAILS:
- Business name: ${name}
- What they do: ${what}
- Who they serve: ${who}
- Location: ${location}
- Where they serve clients: ${serve || 'not specified'}
- Services:
${servicesText}
${aboutText}
${extraSectionsText}

${colours}

MANDATORY HOMEPAGE STRUCTURE (ALL sections required):
1. HERO: H1 exactly 5-8 words. Subheading and primary CTA button.
2. TALK TO IDEAL CUSTOMER: Problem-aware section with bullet points on pain points and solutions.
3. SERVICES: All services as cards with names, prices, descriptions. CTA included.
4. ABOUT: Use the about text provided to write a warm personal intro. Include a CTA.
5. CLIENT LOVE: 2-3 testimonials marked [PLACEHOLDER, replace with real testimonials].
6. CALL TO ACTION: Final CTA section.
7. FOOTER: Business name, nav links, copyright, privacy policy placeholder, contact email placeholder.
${extraSections && extraSections.length ? '\n8. FROM COMPETITOR ANALYSIS: ' + extraSections.join(', ') + ', weave in naturally.' : ''}

COPY RULES:
- First person only: "I", never "we"
- Short punchy sentences
- Warm, direct tone
- Sentence case: only first word of each heading capitalised
- No em dashes, use commas or full stops instead
- No italics
- No filler
- H1 between 5 and 8 words exactly
- Speak directly to: ${who}
- Mention ${location} naturally for local SEO

DESIGN:
- Clean modern HTML with embedded CSS
- Google Font: Montserrat
- Fully mobile-responsive
- Services as card grid (3 col desktop, stacks mobile)
- Testimonials as cards
- Smooth button hover transitions

OUTPUT: Return ONLY the complete HTML starting with <!DOCTYPE html>. No explanation, no markdown.`;

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
        max_tokens: 8000,
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

    return res.status(200).json({ html });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
