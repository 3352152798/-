
import express from 'express';
import cors from 'cors';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();

// Vercel handles the port, we just export the app
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Initialize Gemini
// 1. Try to get GEMINI_BASE_URL from Environment Variables
// 2. If not found, fallback to the user's Cloudflare Worker (Hardcoded for convenience)
const BASE_URL = process.env.GEMINI_BASE_URL || 'https://geminibaseurl.3352152798.workers.dev';

const ai = new GoogleGenAI({ 
  apiKey: process.env.API_KEY,
  baseUrl: BASE_URL 
});

const promptResponseSchema = {
  type: Type.OBJECT,
  properties: {
    optimizedPrompt: {
      type: Type.STRING,
      description: "The highly detailed, artistic, and optimized prompt (or reverse-engineered description) in the requested output language."
    },
    explanation: {
      type: Type.STRING,
      description: "A concise explanation of the changes, artistic choices, or image analysis."
    },
    technicalDetails: {
      type: Type.STRING,
      description: "Technical parameters like camera settings, aspect ratio, style keywords."
    },
    negativePrompt: {
      type: Type.STRING,
      description: "Suggested negative prompt to avoid common artifacts in English."
    }
  },
  required: ["optimizedPrompt", "explanation", "technicalDetails"]
};

app.post('/api/generate', async (req, res) => {
  try {
    const { 
      prompt, 
      mediaType, 
      mode, 
      taskMode, 
      outputLang, 
      interfaceLang, 
      uploadedImage 
    } = req.body;

    const modelName = mode === 'THINKING' 
      ? 'gemini-3-pro-preview' 
      : 'gemini-2.5-flash';

    const explainLang = interfaceLang === 'CN' ? 'CHINESE (Simplified)' : 'ENGLISH';

    let systemInstruction = '';

    if (taskMode === 'OPTIMIZE') {
      systemInstruction = `You are an expert AI Art Director and Lead Prompt Engineer.
      Your mission is to alchemize simple user inputs into visually stunning, professional-grade generation prompts.

      ### CORE OBJECTIVES
      1. **Analyze** the user's intent, extracting the core subject, mood, and desired aesthetic.
      2. **Expand** brevity into rich visual description.
      3. **Enhance** with technical keywords appropriate for high-end rendering.
      4. **Structure** the prompt logically: [Subject] + [Environment] + [Lighting] + [Camera] + [Style].

      ### LANGUAGE RULES
      1. **Output Language**: The 'optimizedPrompt' MUST be in **${outputLang}**.
      2. **Explanation Language**: The 'explanation' and 'technicalDetails' MUST be in **${explainLang}**.
      3. **Negative Prompt**: MUST be in **English**.
      
      ### OUTPUT FORMAT
      Return ONLY the JSON matching the schema.
      `;
    } else {
      if (mediaType === 'VIDEO') {
           systemInstruction = `You are a Visionary Film Director, Screenwriter, and Cinematographer.
           Your task is to analyze the provided image as a "Keyframe" and write a professional video generation prompt (for Sora/Veo/Gen-3) that brings this scene to life.

           ### ROLE: FILM DIRECTOR & SCREENWRITER
           - Treat the image as the opening shot of a scene.
           - **Infer the Narrative**: What is the story? What is the character feeling?
           - **Direct the Action**: Describe specific movements (micro-expressions, walking, environmental shifts).
           - **Direct the Camera**: Use precise terminology (Dolly Zoom, Truck Left, Crane Up, Rack Focus).

           ### VISUAL ANALYSIS & EXTRAPOLATION
           1. **Scene & Setting**: Establish the location and time period immediately.
           2. **Lighting & Mood**: Describe how the light interacts with the subject (volumetric, chiaroscuro, practical lights).
           3. **Dynamic Elements**: Wind, rain, traffic, particle effects, crowd movement.

           ### PROMPT STRUCTURE (Sora/Veo Style)
           Construct the prompt as a fluid narrative description:
           "[Cinematic Style] of [Subject] doing [Specific Action] in [Environment]. [Camera Movement] reveals [New Detail]. Lighting is [Lighting Type]. Atmosphere is [Mood]. Technical specs: [Resolution, FPS, Lens]."

           ### LANGUAGE RULES
           1. **Output Language**: The 'optimizedPrompt' MUST be in **${outputLang}**.
           2. **Explanation Language**: The 'explanation' MUST be in **${explainLang}**. Explain the *Director's Vision*—why this camera move? What is the subtext?
           3. **Negative Prompt**: Static, frozen, warping, distortion, watermark.
           
           ### OUTPUT FORMAT
           Return ONLY the JSON matching the schema.
           `;
      } else {
           systemInstruction = `You are a World-Class Photographer, Art Critic, and Senior Art Director.
           Your task is to reverse-engineer the uploaded image into a "Masterpiece" level text-to-image prompt (Midjourney v6/Flux/SDXL).

           ### ROLE: PHOTOGRAPHER & ARTIST
           - **Deconstruct the Light**: Is it Rembrandt lighting? Butterfly lighting? Golden Hour? Cyberpunk neon?
           - **Analyze the Gear/Medium**: Is this shot on 35mm Portra 400? A Canon 50mm f/1.2? Or is it an Oil Painting with thick impasto strokes?
           - **Composition Theory**: Analyze the framing (Rule of Thirds, Center Composition, Leading Lines).

           ### PROMPT CONSTRUCTION
           1. **Subject**: Detailed description of the focal point (clothing, texture, expression).
           2. **Environment**: Background details, depth of field.
           3. **Style & Aesthetics**: Art styles, specific artists, color grading (Teal & Orange, Desaturated, Vivid).
           4. **Technical Modifiers**: "8k resolution", "Unreal Engine 5", "Octane Render" (if 3D), "Provia", "Bokeh".

           ### LANGUAGE RULES
           1. **Output Language**: The 'optimizedPrompt' MUST be in **${outputLang}**.
           2. **Explanation Language**: The 'explanation' MUST be in **${explainLang}**. Analyze the image from a professional photographer's perspective (e.g., discussing ISO, aperture, composition rules).
           3. **Negative Prompt**: ugly, blurry, low quality, bad anatomy, watermark.
           
           ### OUTPUT FORMAT
           Return ONLY the JSON matching the schema.
           `;
      }
    }

    const requestConfig = {
      responseMimeType: "application/json",
      responseSchema: promptResponseSchema,
      systemInstruction: systemInstruction,
    };

    if (mode === 'THINKING') {
      requestConfig.thinkingConfig = { thinkingBudget: 32768 };
    }

    const contents = [];
      
    if (taskMode === 'REVERSE' && uploadedImage) {
      const matches = uploadedImage.match(/^data:(.+);base64,(.+)$/);
      if (!matches) {
          throw new Error("Invalid image data");
      }
      const mimeType = matches[1];
      const data = matches[2];
      
      const userMessage = prompt && prompt.trim() 
          ? `Reverse engineer this image. Additional instructions: ${prompt}` 
          : `Reverse engineer this image into a detailed prompt in ${outputLang}.`;

      contents.push({
        role: 'user',
        parts: [
          { inlineData: { mimeType: mimeType, data: data } },
          { text: userMessage }
        ]
      });
    } else {
      contents.push({
          role: 'user',
          parts: [{ text: `Optimize this for ${mediaType} in ${outputLang}: "${prompt}"` }]
      });
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: requestConfig
    });

    res.json(JSON.parse(response.text));

  } catch (error) {
    console.error("Backend Generation Error:", error);
    res.status(500).json({ error: "Failed to generate prompt", details: error.message });
  }
});

export default app;
