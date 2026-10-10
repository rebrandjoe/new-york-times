/**
 * Configurable server-side TTS. Default provider: OpenAI.
 * Credentials never leave the server.
 */

const OPENAI_SPEECH_URL = "https://api.openai.com/v1/audio/speech";
/** OpenAI tts-1 hard limit is 4096 characters per request. */
const CHUNK_LIMIT = 4000;

export function isTtsConfigured(): boolean {
  const provider = (process.env.TTS_PROVIDER || "openai").toLowerCase();
  if (provider === "openai") return Boolean(process.env.OPENAI_API_KEY);
  return false;
}

export function getTtsVoice(): string {
  return process.env.TTS_VOICE || "nova";
}

function splitIntoChunks(text: string, limit = CHUNK_LIMIT): string[] {
  if (text.length <= limit) return [text];
  const chunks: string[] = [];
  let remaining = text;
  while (remaining.length > limit) {
    let cut = remaining.lastIndexOf(". ", limit);
    if (cut < limit * 0.4) cut = remaining.lastIndexOf(" ", limit);
    if (cut < limit * 0.4) cut = limit;
    chunks.push(remaining.slice(0, cut + 1).trim());
    remaining = remaining.slice(cut + 1).trim();
  }
  if (remaining) chunks.push(remaining);
  return chunks.filter(Boolean);
}

async function openaiSpeech(text: string, voice: string, apiKey: string): Promise<Buffer> {
  const res = await fetch(OPENAI_SPEECH_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.TTS_MODEL || "tts-1",
      voice,
      input: text,
      response_format: "mp3",
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`OpenAI TTS failed (${res.status}): ${errText.slice(0, 200)}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Synthesize full article text to a single MP3 buffer.
 * Long text is chunked and concatenated (same model/voice).
 */
export async function synthesizeSpeech(text: string): Promise<Buffer> {
  if (!text.trim()) throw new Error("No text to synthesize");

  const provider = (process.env.TTS_PROVIDER || "openai").toLowerCase();
  if (provider !== "openai") {
    throw new Error(`Unsupported TTS_PROVIDER: ${provider}`);
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

  const voice = getTtsVoice();
  const chunks = splitIntoChunks(text);
  const buffers: Buffer[] = [];

  for (const chunk of chunks) {
    buffers.push(await openaiSpeech(chunk, voice, apiKey));
  }

  return Buffer.concat(buffers);
}

/** Rough duration estimate when the encoder does not return length. ~150 wpm. */
export function estimateDurationSeconds(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(5, Math.round((words / 150) * 60));
}
