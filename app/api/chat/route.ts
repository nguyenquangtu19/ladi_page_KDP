// app/api/chat/route.ts — Google Gemini 1.5 Flash (FREE, 1M tokens/day)
import { systemPrompt } from '@/lib/chatbot-knowledge'

export const runtime = 'edge'

type Msg = { role: 'user' | 'assistant'; content: string }

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'GEMINI_API_KEY chua duoc set trong .env.local' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }

  let messages: Msg[]
  try {
    const body = await req.json()
    messages = body.messages
    if (!Array.isArray(messages) || messages.length === 0) throw new Error('empty')
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 })
  }

  // Convert to Gemini format (user/model roles, no system in contents)
  const contents = messages.slice(-20).map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:streamGenerateContent?alt=sse&key=${apiKey}`

  const upstream = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: { maxOutputTokens: 800, temperature: 0.7 },
    }),
  })

  if (!upstream.ok || !upstream.body) {
    const err = await upstream.text().catch(() => 'Gemini error')
    return new Response(JSON.stringify({ error: `Gemini error: ${upstream.status} ${err}` }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Transform Gemini SSE -> OpenAI-compatible SSE (frontend expects choices[0].delta.content)
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  ;(async () => {
    const reader = upstream.body!.getReader()
    let buffer = ''
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6).trim()
          if (!raw || raw === '[DONE]') continue
          try {
            const json = JSON.parse(raw)
            const text = json.candidates?.[0]?.content?.parts?.[0]?.text
            if (text) {
              const chunk = `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`
              await writer.write(encoder.encode(chunk))
            }
          } catch { /* skip */ }
        }
      }
    } finally {
      await writer.write(encoder.encode('data: [DONE]\n\n'))
      await writer.close()
    }
  })()

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
