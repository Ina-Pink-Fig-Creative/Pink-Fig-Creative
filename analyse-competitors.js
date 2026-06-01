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

  const { competitors } = req.body;

  if (!competitors || !competitors.length) {
    return res.status(200).json({ extra_sections: [], insights: '', checklist: [] });
  }

  const prompt = `You are a website strategist. Analyse these competitor websites for a service business.

Competitor URLs:
${competitors.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Do two things:
1. Identify homepage sections or elements they use that are NOT in: hero, talk to ideal customer, services, about, testimonials, CTA, footer.
2. Write up to 3 short observations the business owner should note. One sentence each, practical and specific.

Return ONLY valid JSON (no markdown):
{"extra_sections": ["name"], "insights": "summary", "checklist": ["obs 1", "obs 2", "obs 3"]}

If URLs are inaccessible return: {"extra_sections": [], "insights": "", "checklist": []}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'web-search-2025-03-05'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      return res.status(200).json({ extra_sections: [], insights: '', checklist: [] });
    }

    const textBlock = data.content && data.content.find(b => b.type === 'text');
    if (!textBlock) {
      return res.status(200).json({ extra_sections: [], insights: '', checklist: [] });
    }

    const raw = textBlock.text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(raw);
    return res.status(200).json(parsed);

  } catch (err) {
    return res.status(200).json({ extra_sections: [], insights: '', checklist: [] });
  }
}
