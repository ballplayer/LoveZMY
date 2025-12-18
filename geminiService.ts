
import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getSweetResponse(context: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: context,
      config: {
        systemInstruction: "你是一个充满爱意的男朋友设计的App智能助手。你的语气极度宠溺、温柔、鼓励。你会称呼用户为‘最爱的宝贝’、‘小仙女’或‘公主殿下’。保持简洁，1-2句话即可。",
        temperature: 0.9,
      },
    });
    return response.text || "宝贝太棒了，你是我的骄傲！💖";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "宝贝真厉害！这是给你的专属奖励，爱你哦～ 💖";
  }
}

export async function getDailyFortune(): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "请为女朋友写一句超级甜蜜的今日心动寄语，包含今日运势关键词，50字以内。",
      config: {
          systemInstruction: "你是最会宠溺女朋友的AI男友。语录要梦幻、治愈、充满粉红泡泡。",
      }
    });
    return response.text || "今天的宝贝也是全世界最可爱的，幸运指数爆表哦！✨";
  } catch (error) {
    return "今天的宝贝也是全世界最可爱的，幸运指数爆表哦！✨";
  }
}

export async function speakText(text: string): Promise<Uint8Array | null> {
  if (!text) return null;

  try {
    /**
     * The error 'Rpc failed due to xhr error' with status 500 often happens at the proxy level
     * when a specific model or modality is temporarily unavailable or rejected by safety filters.
     * We follow the documentation's exact array-based contents structure and use a simple 
     * English-prefixed instruction to help the TTS engine process the request more reliably.
     */
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Speak this in a warm, loving way: ${text}` }] }],
      config: {
        // Using explicit string to avoid potential enum mapping issues in certain environments.
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Kore is deep and warm
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return decode(base64Audio);
    }
    return null;
  } catch (e: any) {
    // Gracefully handle the 500 error to prevent the app from hanging.
    // This allows the user to continue using the app while only skipping the audio playback.
    console.warn("TTS Audio playback skipped due to a service/proxy error (500 UNKNOWN):", e.message || e);
    return null;
  }
}

// Helper to decode base64
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Standard PCM decoding for Gemini TTS output (24000Hz, Mono).
 */
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const sampleRate = 24000;
  const numChannels = 1;
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
