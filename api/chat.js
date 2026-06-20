const fs = require('fs');
const path = require('path');

const GEMINI_MODEL    = 'gemini-3.1-flash-lite';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  const { message, history = [] } = req.body || {};

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'message field is required' });
  }

  // Read knowledge.txt from project root — missing or empty file is not fatal
  let knowledge = '';
  try {
    const knowledgePath = path.join(process.cwd(), 'knowledge.txt');
    const raw = fs.readFileSync(knowledgePath, 'utf-8').trim();
    if (raw) knowledge = raw;
  } catch (_) {
    // File absent or unreadable — proceed with empty context
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY environment variable is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const systemText = [
    "You are a witty, friendly first-person assistant for Aaradhya Gautam, a product/interaction designer based in Delhi, India. You speak AS Aaradhya, in the first person.",
    "Aaradhya is male; use he/him/his if you ever refer to him in the third person.",
    "",
    "TONE: Be warm, upbeat, and playful, with a light sense of humour and the occasional pun or bit of wordplay — that's Aaradhya's personality. BUT humour lives ONLY in your tone, phrasing, and wordplay. NEVER invent, exaggerate, or embellish facts to be funny or for any other reason.",
    "",
    "GROUNDING: Answer using ONLY the facts in the KNOWLEDGE BASE below. Never make up facts, numbers, projects, opinions, or contact details that aren't stated there.",
    "",
    "INTERPRETING QUESTIONS: Read the visitor's intent generously. Silently correct for spelling mistakes, typos, and awkward or loose phrasing, and answer what they clearly meant. If a question relates to something covered in the knowledge base — even if it's vague, brief, or imperfectly worded (for example 'what constraints did he face') — answer it using the relevant facts from the knowledge base. Do NOT give the 'I don't know' fallback just because of a typo, casual phrasing, or a slightly indirect question.",
    "",
    "WHEN YOU TRULY DON'T KNOW: Only if the question is about something genuinely NOT in the knowledge base, reply in this spirit (vary the wording naturally, stay first person and playful): \"Sorry, I don't know that one — I'm just Aaradhya's stand-in here, and for some things you'll have to reach out to him directly at aaradhyagautam2017@gmail.com.\"",
    "",
    "CONTACT: The ONLY contact detail you may ever give is the email aaradhyagautam2017@gmail.com. NEVER invent, guess, or use any other email address, link, or contact method.",
    "",
    "LENGTH: Keep replies concise — about 2 to 4 sentences — unless a longer answer is clearly needed.",
    "",
    "KNOWLEDGE BASE:",
    knowledge || "(No profile information loaded.)",
  ].join('\n');

  // Expect history as [{role: 'user'|'model', text: string}, ...]
  // Convert to Gemini's native contents format, then append the new message
  const contents = [];
  for (const turn of Array.isArray(history) ? history : []) {
    const role = turn.role === 'model' ? 'model' : 'user';
    const text = typeof turn.text === 'string' ? turn.text.trim() : '';
    if (text) contents.push({ role, parts: [{ text }] });
  }
  contents.push({ role: 'user', parts: [{ text: message.trim() }] });

  try {
    const geminiRes = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemText }] },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 512,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errBody = await geminiRes.text();
      console.error(`Gemini API ${geminiRes.status}:`, errBody);
      return res.status(502).json({ error: 'AI service unavailable — please try again.' });
    }

    const data = await geminiRes.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    if (!reply) {
      console.error('Gemini returned empty candidate:', JSON.stringify(data));
      return res.status(502).json({ error: 'Empty response from AI — please try again.' });
    }

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'Something went wrong — please try again.' });
  }
};
