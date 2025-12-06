
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// --- JSON Schemas ---
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

// --- Prompt Engineering ---
const getSystemInstruction = (taskMode, mediaType, outputLang, interfaceLang) => {
    const explainLang = interfaceLang === 'CN' ? 'CHINESE (Simplified)' : 'ENGLISH';
    
    if (taskMode === 'OPTIMIZE') {
      return `You are an expert AI Art Director and Lead Prompt Engineer.
      Your mission is to alchemize simple user inputs into visually stunning, professional-grade generation prompts.

      ### CORE OBJECTIVES
      1. **Analyze** the user's intent, extracting the core subject, mood, and desired aesthetic.
      2. **Expand** brevity into rich visual description.
      3. **Enhance** with technical keywords appropriate for high-end rendering.
      4. **Structure** the prompt logically: [Subject] + [Environment] + [Lighting] + [Camera] + [Style].

      ### VIDEO STYLE GUIDELINES
      For video generation prompts, do NOT limit yourself to generic "Cinematic" styles. 
      Actively explore and apply diverse styles that best fit the subject, such as:
      - **Animation**: 3D Render (Pixar/Dreamworks style), 2D Anime (Ghibli/Makoto Shinkai), Claymation, Stop Motion.
      - **Artistic**: Watercolor, Oil Painting, Ink Wash, Glitch Art, Pixel Art, Synthwave/Cyberpunk.
      - **Film**: Vintage 8mm/16mm, VHS, Noir, Wes Anderson symmetrical, Documentary, Hand-held footage.
      - **Abstract**: Fractal, Kaleidoscopic, Fluid simulation.
      Select the most impactful style for the specific concept.

      ### LANGUAGE RULES
      1. **Output Language**: The 'optimizedPrompt' MUST be in **${outputLang}**.
      2. **Explanation Language**: The 'explanation' and 'technicalDetails' MUST be in **${explainLang}**.
      3. **Negative Prompt**: MUST be in **English**.
      
      ### OUTPUT FORMAT
      Return strictly a JSON object matching the requested schema.
      `;
    } else {
      // REVERSE MODE
      if (mediaType === 'VIDEO') {
           return `You are a Visionary Film Director, Screenwriter, and Cinematographer.
           Your task is to analyze the provided image as a "Keyframe" and write a professional video generation prompt (for Sora/Veo/Gen-3) that brings this scene to life.

           ### ROLE: FILM DIRECTOR & SCREENWRITER
           - Treat the image as the opening shot of a scene.
           - **Infer the Narrative**: What is the story? What is the character feeling?
           - **Direct the Action**: Describe specific movements (micro-expressions, walking, environmental shifts).
           - **Direct the Camera**: Use precise terminology (Dolly Zoom, Truck Left, Crane Up, Rack Focus).

           ### STYLE DIVERSITY
           Do not default to "Cinematic" if the image suggests otherwise. accurately identify and describe the style.
           
           ### PROMPT STRUCTURE (Sora/Veo Style)
           Construct the prompt as a fluid narrative description:
           "[Specific Style/Medium] of [Subject] doing [Specific Action] in [Environment]. [Camera Movement] reveals [New Detail]. Lighting is [Lighting Type]. Atmosphere is [Mood]. Technical specs: [Resolution, FPS, Lens]."

           ### LANGUAGE RULES
           1. **Output Language**: The 'optimizedPrompt' MUST be in **${outputLang}**.
           2. **Explanation Language**: The 'explanation' MUST be in **${explainLang}**.
           3. **Negative Prompt**: Static, frozen, warping, distortion, watermark.
           
           ### OUTPUT FORMAT
           Return strictly a JSON object matching the requested schema.
           `;
      } else {
           return `You are a World-Class Photographer, Art Critic, and Senior Art Director.
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
           2. **Explanation Language**: The 'explanation' MUST be in **${explainLang}**.
           3. **Negative Prompt**: ugly, blurry, low quality, bad anatomy, watermark.
           
           ### OUTPUT FORMAT
           Return strictly a JSON object matching the requested schema.
           `;
      }
    }
};

// --- Google GenAI Handler (Text) ---
const generateWithGemini = async (body, modelName, apiKey, baseUrl) => {
    const { 
      prompt, 
      mediaType, 
      mode, 
      taskMode, 
      outputLang, 
      interfaceLang, 
      uploadedImage 
    } = body;

    const clientOptions = { apiKey: apiKey };
    if (baseUrl && baseUrl.trim()) {
        clientOptions.baseUrl = baseUrl;
    }
    const ai = new GoogleGenAI(clientOptions);
    const systemInstruction = getSystemInstruction(taskMode, mediaType, outputLang, interfaceLang);
    const isThinking = mode === 'THINKING';

    const requestConfig = {
      responseMimeType: "application/json",
      responseSchema: promptResponseSchema,
      systemInstruction: systemInstruction,
    };

    if (isThinking) {
        requestConfig.thinkingConfig = { thinkingBudget: 2048 };
    }

    const contents = [];
    if (taskMode === 'REVERSE' && uploadedImage) {
      const matches = uploadedImage.match(/^data:(.+);base64,(.+)$/);
      if (!matches) throw new Error("Invalid image data");
      
      const userMessage = prompt && prompt.trim() 
          ? `Reverse engineer this image. Additional instructions: ${prompt}` 
          : `Reverse engineer this image into a detailed prompt in ${outputLang}.`;

      contents.push({
        role: 'user',
        parts: [
          { inlineData: { mimeType: matches[1], data: matches[2] } },
          { text: userMessage }
        ]
      });
    } else {
      contents.push({
          role: 'user',
          parts: [{ text: `Optimize this for ${mediaType} in ${outputLang}: "${prompt}"` }]
      });
    }

    try {
        const response = await ai.models.generateContent({
            model: modelName || 'gemini-2.5-flash',
            contents, 
            config: requestConfig 
        });
        return JSON.parse(response.text);
    } catch (error) {
        throw error;
    }
};

// --- Google GenAI Handler (Image Preview) ---
const generateImageWithGemini = async (body, modelName, apiKey) => {
    const { prompt, mediaType } = body;
    const ai = new GoogleGenAI({ apiKey });
    
    // For Video, we modify the prompt to ask for a storyboard
    const imagePrompt = mediaType === 'VIDEO'
        ? `Draw a professional storyboard sheet for the video scene described below. Based on the action's complexity, select an appropriate EVEN number of panels (e.g., 4, 6, or 8). Number the panels sequentially (1, 2, 3, etc.) to depict the narrative flow and camera movements. Arrange them in a clean grid layout. Scene: ${prompt}`
        : prompt;

    // Use passed modelName or default to gemini-2.0-flash-exp for better free tier availability
    const targetModel = modelName || 'gemini-2.0-flash-exp';

    const response = await ai.models.generateContent({
        model: targetModel,
        contents: [{ parts: [{ text: imagePrompt }] }],
    });

    if (!response.candidates || !response.candidates[0] || !response.candidates[0].content || !response.candidates[0].content.parts) {
         throw new Error("No candidates returned from Gemini.");
    }

    // Extract the image from parts
    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64EncodeString = part.inlineData.data;
            return `data:image/png;base64,${base64EncodeString}`;
        }
        // If the model refuses (e.g. Safety), it might return text explaining why
        if (part.text) {
             throw new Error(`Model Refusal: ${part.text}`);
        }
    }
    
    throw new Error("No image generated.");
};

// --- OpenAI Compatible Handler (Image) ---
const generateImageWithOpenAI = async (body, modelName, apiKey, baseUrl) => {
    const { prompt, mediaType } = body;
    
    const url = (baseUrl ? baseUrl.replace(/\/$/, '') : 'https://api.openai.com/v1') + '/images/generations';
    
    const imagePrompt = mediaType === 'VIDEO'
        ? `Draw a professional storyboard sheet for the video scene described below. Based on the action's complexity, select an appropriate EVEN number of panels (e.g., 4, 6, or 8). Number the panels sequentially (1, 2, 3, etc.) to depict the narrative flow and camera movements. Arrange them in a clean grid layout. Scene: ${prompt}`
        : prompt;

    const payload = {
        model: modelName || "dall-e-3",
        prompt: imagePrompt.substring(0, 4000), // OpenAI limits
        n: 1,
        size: "1024x1024",
        response_format: "b64_json"
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenAI Image Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    if (data.data && data.data.length > 0) {
        return `data:image/png;base64,${data.data[0].b64_json}`;
    }
    throw new Error("No image generated.");
};


// --- OpenAI Compatible Handler (Text) ---
const generateWithOpenAI = async (body, modelName, apiKey, baseUrl) => {
    const { 
      prompt, 
      mediaType, 
      mode, 
      taskMode, 
      outputLang, 
      interfaceLang, 
      uploadedImage 
    } = body;

    const url = (baseUrl ? baseUrl.replace(/\/$/, '') : 'https://api.openai.com/v1') + '/chat/completions';
    const systemInstruction = getSystemInstruction(taskMode, mediaType, outputLang, interfaceLang);

    // Build Messages
    const messages = [
        { role: 'system', content: systemInstruction + "\n\nIMPORTANT: You MUST return valid JSON matching the schema." }
    ];

    const userContent = [];
    if (taskMode === 'REVERSE' && uploadedImage) {
        // OpenAI expects explicit image_url object
        userContent.push({
            type: "image_url",
            image_url: {
                url: uploadedImage // OpenAI supports data URI directly
            }
        });
        const userMessage = prompt && prompt.trim() 
          ? `Reverse engineer this image. Additional instructions: ${prompt}` 
          : `Reverse engineer this image into a detailed prompt in ${outputLang}.`;
        userContent.push({ type: "text", text: userMessage });
    } else {
        userContent.push({ type: "text", text: `Optimize this for ${mediaType} in ${outputLang}: "${prompt}"` });
    }
    messages.push({ role: 'user', content: userContent });

    const payload = {
        model: modelName || 'gpt-4o',
        messages: messages,
        response_format: { type: "json_object" }, // Enforce JSON mode if supported
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenAI API Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    return JSON.parse(content);
};

// --- Main Route (Text Generation) ---
app.post('/api/generate', async (req, res) => {
  try {
    const { mode, interfaceLang, modelConfig } = req.body;
    
    const provider = modelConfig?.provider || 'GOOGLE';
    let modelName = modelConfig?.modelName;
    let apiKey = modelConfig?.apiKey;
    let baseUrl = modelConfig?.baseUrl;

    if (provider === 'GOOGLE') {
        if (!modelName) modelName = 'gemini-2.5-flash';
        if (!apiKey) apiKey = process.env.API_KEY; 
    } else {
        if (!modelName) modelName = 'gpt-4o';
        if (!apiKey) {
            return res.status(400).json({ error: "API Key is required for custom OpenAI compatible models." });
        }
    }

    let result;

    if (provider === 'OPENAI') {
        result = await generateWithOpenAI(req.body, modelName, apiKey, baseUrl);
    } else {
        try {
            result = await generateWithGemini(req.body, modelName, apiKey, baseUrl);
        } catch (error) {
             if (mode === 'THINKING') {
                console.warn("Thinking mode failed, retrying with Fast mode...");
                const fallbackBody = { ...req.body, mode: 'FAST' };
                result = await generateWithGemini(fallbackBody, 'gemini-2.5-flash', apiKey, baseUrl);
                
                const note = interfaceLang === 'CN' 
                ? "(注：深度思考模式响应超时，已自动切换为快速模式。)" 
                : "(Note: Deep Thinking timed out, switched to Fast mode automatically.)";
                
                result.explanation = `${note}\n\n${result.explanation}`;
                result.isFallback = true;
             } else {
                 throw error;
             }
        }
    }

    res.json(result);

  } catch (error) {
    console.error("Backend Generation Error:", error);
    res.status(500).json({ error: "Failed to generate prompt", details: error.message });
  }
});

// --- Image Preview Route ---
app.post('/api/generate-image', async (req, res) => {
    try {
        const { prompt, mediaType, modelConfig } = req.body;
        
        const provider = modelConfig?.provider || 'GOOGLE';
        let modelName = modelConfig?.modelName;
        let apiKey = modelConfig?.apiKey;
        let baseUrl = modelConfig?.baseUrl;

        // Default logic for Key if not provided in custom config
        if (provider === 'GOOGLE' && !apiKey) {
             apiKey = process.env.API_KEY;
        }

        if (!apiKey) {
             return res.status(400).json({ error: "API Key not configured for image generation." });
        }

        let imageUrl;
        if (provider === 'OPENAI') {
             imageUrl = await generateImageWithOpenAI({ prompt, mediaType }, modelName, apiKey, baseUrl);
        } else {
             // Correctly pass modelName to Gemini function
             imageUrl = await generateImageWithGemini({ prompt, mediaType }, modelName, apiKey);
        }

        res.json({ imageUrl });

    } catch (error) {
        console.error("Image Generation Error:", error);
        
        // Handle Rate Limits (429) specifically
        if (error.message && (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED') || error.message.includes('Quota exceeded'))) {
            return res.status(429).json({ error: "Rate limit exceeded", details: error.message });
        }

        res.status(500).json({ error: "Failed to generate image preview", details: error.message });
    }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
