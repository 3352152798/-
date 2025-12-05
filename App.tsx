
import React, { useState, useEffect, useRef } from 'react';
// REMOVED: import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MediaType, OptimizationMode, PromptResult, HistoryItem, InterfaceLanguage, OutputLanguage, TaskMode, Preset } from './types';

// --- Icons ---
const SparkIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

const BrainIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 2.625a3.375 3.375 0 00-2.456-2.456L12 12.75l.259 1.035a3.375 3.375 0 002.456 2.456L15.75 16.5l-1.035.259a3.375 3.375 0 00-2.456 2.456L12 19.5l.259 1.035a3.375 3.375 0 002.456 2.456L15.75 23.25l-1.035.259a3.375 3.375 0 00-2.456 2.456L12 26.25l.259 1.035z" /> 
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CopyIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5" />
  </svg>
);

const HistoryIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TrashIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const MenuIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const XIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const GlobeIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
);

const UploadIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

const PhotoIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

const BookmarkIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
  </svg>
);

const PlusIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const QuestionMarkCircleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
  </svg>
);


// --- Translations ---

const translations = {
  [InterfaceLanguage.CN]: {
    appTitle: "提示词炼金术",
    historyTitle: "历史记录",
    presetsTitle: "预设风格",
    noHistory: "暂无历史记录",
    noPresets: "暂无预设，点击下方按钮保存当前提示词。",
    startMagic: "开始创造魔法！",
    newGen: "新建生成",
    placeholder: "在此输入您的创意（例如：一只在霓虹灯雨夜中撑伞的猫）...",
    placeholderReverse: "可选：添加额外的指示（例如：强调光影，忽略背景人物）...",
    image: "图片",
    video: "视频",
    fast: "快速",
    thinking: "深度思考",
    generate: "生成魔法",
    reverse: "反推提示词",
    optimizing: "优化中...",
    reversing: "反推中...",
    thinkingState: "思考中...",
    optimizedPrompt: "优化/反推结果",
    explanation: "设计思路 / 画面分析",
    technical: "技术参数",
    negative: "负向提示词",
    copy: "复制",
    failed: "优化失败，请重试。",
    outputLang: "提示词语言",
    interfaceLang: "界面语言",
    taskOptimize: "提示词优化",
    taskReverse: "图片反推",
    uploadImage: "点击或拖拽上传图片",
    removeImage: "移除图片",
    savePreset: "保存预设",
    enterPresetName: "请输入预设名称：",
    addCurrentToPresets: "将当前提示词存为预设",
    applyPreset: "应用",
    deletePreset: "删除",
    helpTitle: "使用说明书",
    langCN: "中文",
    langEN: "English",
    outCN: "中文",
    outEN: "English",
    outJP: "日本語",
    outKR: "한국어"
  },
  [InterfaceLanguage.EN]: {
    appTitle: "Prompt Alchemy",
    historyTitle: "History",
    presetsTitle: "Presets",
    noHistory: "No history yet",
    noPresets: "No presets yet. Save your current prompt.",
    startMagic: "Start creating magic!",
    newGen: "New Generation",
    placeholder: "Enter your idea here (e.g., A cat holding an umbrella in a neon rainy night)...",
    placeholderReverse: "Optional: Add instructions (e.g., Focus on lighting, ignore background)...",
    image: "Image",
    video: "Video",
    fast: "Fast",
    thinking: "Thinking",
    generate: "Generate Magic",
    reverse: "Reverse Prompt",
    optimizing: "Optimizing...",
    reversing: "Reversing...",
    thinkingState: "Thinking...",
    optimizedPrompt: "Optimized / Reversed Prompt",
    explanation: "Design Logic / Analysis",
    technical: "Parameters",
    negative: "Negative Prompt",
    copy: "Copy",
    failed: "Optimization failed, please try again.",
    outputLang: "Output Language",
    interfaceLang: "Interface Language",
    taskOptimize: "Optimize",
    taskReverse: "Reverse",
    uploadImage: "Click or Drag to Upload Image",
    removeImage: "Remove Image",
    savePreset: "Save Preset",
    enterPresetName: "Enter preset name:",
    addCurrentToPresets: "Save current as preset",
    applyPreset: "Apply",
    deletePreset: "Delete",
    helpTitle: "User Guide",
    langCN: "中文",
    langEN: "English",
    outCN: "Chinese",
    outEN: "English",
    outJP: "Japanese",
    outKR: "Korean"
  }
};

// --- Helper Functions ---

const resizeImage = (base64Str: string, maxWidth = 300): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7)); // Compress to 70% quality JPEG
      } else {
        resolve(base64Str); // Fallback
      }
    };
    img.onerror = () => resolve(base64Str); // Fallback
  });
};

type SidebarTab = 'HISTORY' | 'PRESETS';

// --- Help Component ---

const HelpModal = ({ isOpen, onClose, lang }: { isOpen: boolean, onClose: () => void, lang: InterfaceLanguage }) => {
  if (!isOpen) return null;

  const content = lang === InterfaceLanguage.CN ? (
    <div className="space-y-6">
      <section>
        <h3 className="text-lg font-bold text-indigo-400 mb-2 flex items-center gap-2">
          <SparkIcon /> 提示词优化 (Prompt Optimization)
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          将您简单的创意转化为专业级的生成式AI提示词。
          <br/>
          <span className="text-slate-500 text-xs">适用场景：Midjourney, Stable Diffusion, Runway, Sora.</span>
        </p>
        <ul className="list-disc list-inside text-slate-400 text-xs mt-2 space-y-1">
          <li>输入简短的描述，例如“赛博朋克风格的猫”。</li>
          <li>AI 会自动补充<b>环境、光影、镜头语言、艺术风格</b>。</li>
          <li>选择<b>[深度思考]</b>模式可处理更复杂的逻辑和叙事。</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-bold text-orange-400 mb-2 flex items-center gap-2">
          <PhotoIcon /> 图片反推 (Reverse Engineering)
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          上传参考图，AI 像摄影师或导演一样解析画面，生成“复刻”该风格的提示词。
        </p>
        <ul className="list-disc list-inside text-slate-400 text-xs mt-2 space-y-1">
          <li><b>图片模式：</b>分析光圈、焦距、构图法则。</li>
          <li><b>视频模式：</b>分析运镜（推拉摇移）、动态、剧情氛围。</li>
          <li>支持在上传后添加额外指令，例如“保留风格但改成夜晚”。</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-bold text-emerald-400 mb-2 flex items-center gap-2">
          <BrainIcon /> 核心模式说明
        </h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-800 p-3 rounded-lg border border-emerald-500/30">
            <strong className="text-emerald-300 block mb-1">快速 (Fast)</strong>
            响应极快，适合日常风格化、扩写和简单反推。
          </div>
          <div className="bg-slate-800 p-3 rounded-lg border border-purple-500/30">
            <strong className="text-purple-300 block mb-1">深度思考 (Thinking)</strong>
            调用 Gemini 2.0 Thinking 模型。它会进行复杂的推理，适合需要严谨逻辑、精确分镜的视频脚本。
          </div>
        </div>
      </section>

       <section>
        <h3 className="text-lg font-bold text-blue-400 mb-2 flex items-center gap-2">
          <BookmarkIcon /> 预设与技巧
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          在侧边栏切换到<b>“预设风格”</b>。您可以将常用的修饰词（如“8k resolution, unreal engine 5, cinematic lighting”）保存为预设，点击即可追加到当前输入框中。
        </p>
      </section>
    </div>
  ) : (
    <div className="space-y-6">
       <section>
        <h3 className="text-lg font-bold text-indigo-400 mb-2 flex items-center gap-2">
          <SparkIcon /> Prompt Optimization
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Transmute simple ideas into professional-grade generative AI prompts.
          <br/>
          <span className="text-slate-500 text-xs">Best for: Midjourney, Stable Diffusion, Runway, Sora.</span>
        </p>
        <ul className="list-disc list-inside text-slate-400 text-xs mt-2 space-y-1">
          <li>Enter a brief idea (e.g., "Cyberpunk cat").</li>
          <li>AI enriches it with <b>Environment, Lighting, Camera, and Style</b>.</li>
          <li>Use <b>[Thinking]</b> mode for complex narrative or logic.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-bold text-orange-400 mb-2 flex items-center gap-2">
          <PhotoIcon /> Reverse Engineering
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Upload a reference image. The AI acts as a Photographer or Director to analyze and replicate the style.
        </p>
        <ul className="list-disc list-inside text-slate-400 text-xs mt-2 space-y-1">
          <li><b>Image Mode:</b> Analyzes Aperture, Focal Length, Composition.</li>
          <li><b>Video Mode:</b> Analyzes Camera Movement (Dolly, Pan), Dynamics, Mood.</li>
          <li>You can add extra instructions, e.g., "Keep style but make it night".</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-bold text-emerald-400 mb-2 flex items-center gap-2">
          <BrainIcon /> Core Modes
        </h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-800 p-3 rounded-lg border border-emerald-500/30">
            <strong className="text-emerald-300 block mb-1">Fast</strong>
            Lightning fast. Perfect for daily styling and simple reverse prompting.
          </div>
          <div className="bg-slate-800 p-3 rounded-lg border border-purple-500/30">
            <strong className="text-purple-300 block mb-1">Thinking</strong>
            Uses Gemini 2.0 Thinking model. Performs deep reasoning, perfect for logical video scripts and complex composition.
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-blue-400 mb-2 flex items-center gap-2">
          <BookmarkIcon /> Presets & Tips
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Switch to <b>"Presets"</b> in the sidebar. Save your favorite modifiers (e.g., "8k resolution, cinematic lighting") and click to append them to your current prompt instantly.
        </p>
      </section>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50 rounded-t-2xl">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            {translations[lang].helpTitle}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {content}
        </div>
        <div className="p-4 border-t border-slate-800 bg-slate-950/30 rounded-b-2xl text-center">
            <button 
                onClick={onClose}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors"
            >
                {lang === InterfaceLanguage.CN ? '关闭' : 'Close'}
            </button>
        </div>
      </div>
    </div>
  );
};


// --- App Component ---

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.IMAGE);
  const [mode, setMode] = useState<OptimizationMode>(OptimizationMode.FAST);
  const [taskMode, setTaskMode] = useState<TaskMode>(TaskMode.OPTIMIZE);
  const [outputLang, setOutputLang] = useState<OutputLanguage>(OutputLanguage.CN);
  const [interfaceLang, setInterfaceLang] = useState<InterfaceLanguage>(InterfaceLanguage.CN);
  
  // Image Upload State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PromptResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>('HISTORY');
  const [isMobile, setIsMobile] = useState(false);
  
  // Help State
  const [helpOpen, setHelpOpen] = useState(false);

  const t = translations[interfaceLang];

  // NOTE: GoogleGenAI Client removed. We now fetch from backend.
  // const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Load history & presets on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('prompt_alchemy_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to load history", e);
        localStorage.removeItem('prompt_alchemy_history');
      }
    }
    
    const savedPresets = localStorage.getItem('prompt_alchemy_presets');
    if (savedPresets) {
        try {
            setPresets(JSON.parse(savedPresets));
        } catch (e) {
            console.error("Failed to load presets", e);
            localStorage.removeItem('prompt_alchemy_presets');
        }
    }

    // Load interface language pref
    const savedLang = localStorage.getItem('prompt_alchemy_lang');
    if (savedLang && (savedLang === 'CN' || savedLang === 'EN')) {
      setInterfaceLang(savedLang as InterfaceLanguage);
    }

    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Save history
  useEffect(() => {
    try {
      localStorage.setItem('prompt_alchemy_history', JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save history.", e);
    }
  }, [history]);

  // Save presets
  useEffect(() => {
    try {
        localStorage.setItem('prompt_alchemy_presets', JSON.stringify(presets));
    } catch (e) {
        console.error("Failed to save presets.", e);
    }
  }, [presets]);

  // Save language preference
  useEffect(() => {
    localStorage.setItem('prompt_alchemy_lang', interfaceLang);
  }, [interfaceLang]);

  // Reset result when switching tasks
  useEffect(() => {
    setResult(null);
    setPrompt('');
    setUploadedImage(null);
  }, [taskMode]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const savePreset = () => {
      if (!prompt.trim()) return;
      const name = window.prompt(t.enterPresetName);
      if (name) {
          const newPreset: Preset = {
              id: Date.now().toString(),
              name: name,
              content: prompt
          };
          setPresets(prev => [newPreset, ...prev]);
          setActiveSidebarTab('PRESETS');
      }
  };

  const applyPreset = (presetContent: string) => {
      setPrompt(prev => {
          if (!prev.trim()) return presetContent;
          return `${prev} ${presetContent}`;
      });
  };

  const deletePreset = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      setPresets(prev => prev.filter(p => p.id !== id));
  };

  const optimizePrompt = async () => {
    if (taskMode === TaskMode.OPTIMIZE && !prompt.trim()) return;
    if (taskMode === TaskMode.REVERSE && !uploadedImage) return;

    setLoading(true);
    setResult(null);

    try {
      // Use the backend API
      // In production, this URL should be your deployed backend URL.
      // For local development, it assumes standard localhost:3000 or relative proxy.
      const apiUrl = '/api/generate'; 

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          mediaType,
          mode,
          taskMode,
          outputLang,
          interfaceLang,
          uploadedImage // Sends base64 string
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const parsedResult = await response.json() as PromptResult;
      setResult(parsedResult);
      
      // Prepare Thumbnail for history
      let thumbnail = undefined;
      if (taskMode === TaskMode.REVERSE && uploadedImage) {
          try {
              thumbnail = await resizeImage(uploadedImage, 200);
          } catch (e) {
              console.warn("Thumbnail generation failed, skipping image preview in history", e);
          }
      }

      // Add to history
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        originalPrompt: prompt || (taskMode === TaskMode.REVERSE ? '[Image]' : ''),
        mediaType,
        mode,
        taskMode,
        outputLanguage: outputLang,
        result: parsedResult,
        imagePreview: thumbnail // Use the resized thumbnail
      };
      setHistory(prev => [newItem, ...prev]);

    } catch (error) {
      console.error("Generation failed", error);
      alert(t.failed);
    } finally {
      setLoading(false);
      if (isMobile && sidebarOpen) setSidebarOpen(false);
    }
  };

  const deleteHistoryItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setPrompt(item.originalPrompt === '[Image]' ? '' : item.originalPrompt);
    setMediaType(item.mediaType);
    setMode(item.mode);
    setTaskMode(item.taskMode || TaskMode.OPTIMIZE);
    setOutputLang(item.outputLanguage || OutputLanguage.CN);
    setResult(item.result);
    if (item.imagePreview) {
        // Warning: This loads the low-res thumbnail as the input image. 
        // In a real app, you'd want to store the full image in a database or blob storage, not localStorage.
        setUploadedImage(item.imagePreview);
    } else {
        setUploadedImage(null);
    }
    if (isMobile) setSidebarOpen(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const toggleInterfaceLang = () => {
    setInterfaceLang(prev => prev === InterfaceLanguage.CN ? InterfaceLanguage.EN : InterfaceLanguage.CN);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200 font-sans">
      
      {/* Help Modal */}
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} lang={interfaceLang} />

      {/* Mobile Backdrop */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - History & Presets */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-72 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            {t.appTitle}
          </h2>
          <div className="flex items-center gap-2">
             {!isMobile && (
                <button 
                onClick={toggleInterfaceLang} 
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors text-xs font-mono border border-slate-700"
                title={t.interfaceLang}
                >
                {interfaceLang}
                </button>
            )}
             <button 
                onClick={() => setHelpOpen(true)}
                className="text-slate-400 hover:text-indigo-400 transition-colors"
                title={translations[interfaceLang].helpTitle}
            >
                <QuestionMarkCircleIcon />
            </button>
             {isMobile && (
                <button onClick={() => setSidebarOpen(false)} className="text-slate-400">
                <XIcon />
                </button>
            )}
          </div>
        </div>

        {/* Sidebar Tabs */}
        <div className="flex border-b border-slate-800">
            <button
                onClick={() => setActiveSidebarTab('HISTORY')}
                className={`flex-1 py-3 text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 ${activeSidebarTab === 'HISTORY' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5' : 'text-slate-500 hover:text-slate-300'}`}
            >
                <HistoryIcon className="w-4 h-4" />
                {t.historyTitle}
            </button>
            <button
                onClick={() => setActiveSidebarTab('PRESETS')}
                className={`flex-1 py-3 text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 ${activeSidebarTab === 'PRESETS' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5' : 'text-slate-500 hover:text-slate-300'}`}
            >
                <BookmarkIcon className="w-4 h-4" />
                {t.presetsTitle}
            </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
          
          {/* HISTORY LIST */}
          {activeSidebarTab === 'HISTORY' && (
              <>
                {history.length === 0 && (
                    <div className="text-center text-slate-600 py-8 text-sm">
                    {t.noHistory}<br/>{t.startMagic}
                    </div>
                )}
                {history.map(item => (
                    <div 
                    key={item.id}
                    onClick={() => loadHistoryItem(item)}
                    className={`
                        group p-3 rounded-lg cursor-pointer border transition-all duration-200
                        ${result?.optimizedPrompt === item.result.optimizedPrompt 
                        ? 'bg-indigo-500/20 border-indigo-500/50' 
                        : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800 hover:border-slate-700'}
                    `}
                    >
                    <div className="flex justify-between items-start mb-1">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${item.mode === OptimizationMode.THINKING ? 'bg-purple-500/20 text-purple-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                        {item.mode === OptimizationMode.THINKING ? 'THINK' : 'FAST'}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ml-1 ${item.taskMode === TaskMode.REVERSE ? 'bg-orange-500/20 text-orange-300' : 'bg-blue-500/20 text-blue-300'}`}>
                        {item.taskMode === TaskMode.REVERSE ? 'REV' : 'OPT'}
                        </span>
                        <button 
                        onClick={(e) => deleteHistoryItem(e, item.id)}
                        className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                        >
                        <TrashIcon />
                        </button>
                    </div>
                    <div className="flex gap-2 items-center">
                        {item.imagePreview && (
                            <div className="w-8 h-8 rounded bg-slate-700 flex-shrink-0 overflow-hidden border border-slate-600">
                                <img src={item.imagePreview} alt="thumb" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <p className="text-sm text-slate-300 line-clamp-2">
                            {item.taskMode === TaskMode.REVERSE && !item.originalPrompt ? '[Image Analysis]' : item.originalPrompt}
                        </p>
                    </div>
                    <div className="text-xs text-slate-500 mt-2 flex justify-between">
                        <span>{item.mediaType}</span>
                        <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                    </div>
                ))}
              </>
          )}

          {/* PRESETS LIST */}
          {activeSidebarTab === 'PRESETS' && (
              <>
                 <button
                    onClick={savePreset}
                    disabled={!prompt.trim()}
                    className="w-full mb-4 py-2 px-4 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/50 text-indigo-300 text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                     <PlusIcon className="w-4 h-4" />
                     {t.addCurrentToPresets}
                 </button>

                 {presets.length === 0 && (
                     <div className="text-center text-slate-600 py-8 text-sm">
                        {t.noPresets}
                     </div>
                 )}

                 {presets.map(preset => (
                     <div
                        key={preset.id}
                        onClick={() => applyPreset(preset.content)}
                        className="group p-3 rounded-lg cursor-pointer border bg-slate-800/40 border-slate-800 hover:bg-slate-800 hover:border-slate-700 transition-all duration-200"
                     >
                         <div className="flex justify-between items-start mb-1">
                             <h4 className="font-semibold text-sm text-slate-200">{preset.name}</h4>
                             <button
                                onClick={(e) => deletePreset(e, preset.id)}
                                className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                             >
                                 <TrashIcon />
                             </button>
                         </div>
                         <p className="text-xs text-slate-400 line-clamp-2 font-mono">
                             {preset.content}
                         </p>
                     </div>
                 ))}
              </>
          )}

        </div>
        
        {/* Sidebar Footer for Mobile Lang Toggle */}
        {isMobile && (
          <div className="p-4 border-t border-slate-800">
             <button 
              onClick={toggleInterfaceLang} 
              className="w-full flex justify-center items-center gap-2 text-slate-400 hover:text-white p-2 rounded-md bg-slate-800 hover:bg-slate-700 transition-colors text-sm"
            >
              <GlobeIcon />
              {interfaceLang === InterfaceLanguage.CN ? 'Switch to English' : '切换到中文'}
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
        {/* Header (Mobile only toggle) */}
        <header className="lg:hidden p-4 flex items-center border-b border-slate-800 bg-slate-900/50 backdrop-blur-md z-10 sticky top-0 justify-between">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(true)} className="text-slate-300 mr-4">
              <MenuIcon />
            </button>
            <span className="font-bold text-lg">{t.newGen}</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-8 max-w-5xl mx-auto w-full">
          
          {/* Main Controls Section */}
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Task Mode Switcher */}
             <div className="flex justify-center mb-6">
                 <div className="bg-slate-900/60 p-1 rounded-xl flex shadow-lg border border-slate-800">
                     <button
                        onClick={() => setTaskMode(TaskMode.OPTIMIZE)}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${taskMode === TaskMode.OPTIMIZE ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                     >
                         <SparkIcon className="w-4 h-4" />
                         {t.taskOptimize}
                     </button>
                     <button
                        onClick={() => setTaskMode(TaskMode.REVERSE)}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${taskMode === TaskMode.REVERSE ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                     >
                         <PhotoIcon className="w-4 h-4" />
                         {t.taskReverse}
                     </button>
                 </div>
             </div>

            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-1 shadow-lg overflow-hidden">
              
              {/* Input Area */}
              {taskMode === TaskMode.OPTIMIZE ? (
                <div className="relative">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={t.placeholder}
                        className="w-full h-32 bg-transparent text-lg p-5 placeholder:text-slate-600 focus:outline-none resize-none rounded-xl"
                    />
                    {prompt.trim() && (
                         <button 
                            onClick={savePreset}
                            className="absolute bottom-3 right-3 text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-indigo-300 px-2 py-1 rounded border border-slate-700 transition-colors flex items-center gap-1"
                            title={t.addCurrentToPresets}
                         >
                            <BookmarkIcon className="w-3 h-3" />
                            {t.savePreset}
                         </button>
                    )}
                </div>
              ) : (
                <div className="w-full min-h-32 bg-slate-900/30 rounded-xl relative">
                    {!uploadedImage ? (
                        <div 
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            onClick={triggerFileUpload}
                            className="h-48 border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors group m-2"
                        >
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleImageUpload} 
                                className="hidden" 
                                accept="image/*"
                            />
                            <div className="p-4 rounded-full bg-slate-800 group-hover:bg-indigo-600/20 text-slate-400 group-hover:text-indigo-400 transition-colors mb-3">
                                <UploadIcon className="w-8 h-8" />
                            </div>
                            <p className="text-slate-400 group-hover:text-slate-200 font-medium">{t.uploadImage}</p>
                        </div>
                    ) : (
                        <div className="relative h-64 bg-slate-950/50 flex items-center justify-center p-4">
                            <img src={uploadedImage} alt="Preview" className="max-h-full max-w-full object-contain rounded-lg shadow-xl" />
                            <button 
                                onClick={() => setUploadedImage(null)}
                                className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full shadow-lg transition-transform hover:scale-110 backdrop-blur-sm"
                                title={t.removeImage}
                            >
                                <XIcon className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    {/* Optional Text Context for Reverse */}
                    <div className="px-4 pb-2">
                        <input 
                            type="text" 
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={t.placeholderReverse}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 px-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
                        />
                    </div>
                </div>
              )}

              {/* Controls Footer */}
              <div className="flex flex-col xl:flex-row justify-between items-center p-3 gap-4 border-t border-slate-800/50 bg-slate-900/30 rounded-b-xl">
                
                <div className="flex flex-wrap gap-2 w-full xl:w-auto justify-center xl:justify-start">
                  {/* Media Type */}
                  <div className="flex bg-slate-800 rounded-lg p-1">
                    <button
                      onClick={() => setMediaType(MediaType.IMAGE)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${mediaType === MediaType.IMAGE ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      {t.image}
                    </button>
                    <button
                      onClick={() => setMediaType(MediaType.VIDEO)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${mediaType === MediaType.VIDEO ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      {t.video}
                    </button>
                  </div>

                  {/* Mode */}
                  <div className="flex bg-slate-800 rounded-lg p-1">
                    <button
                      onClick={() => setMode(OptimizationMode.FAST)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${mode === OptimizationMode.FAST ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      <SparkIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">{t.fast}</span>
                    </button>
                    <button
                      onClick={() => setMode(OptimizationMode.THINKING)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${mode === OptimizationMode.THINKING ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      <BrainIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">{t.thinking}</span>
                    </button>
                  </div>

                  {/* Output Language Selector */}
                  <div className="flex items-center bg-slate-800 rounded-lg px-3 py-1.5 border border-slate-700">
                     <span className="text-xs text-slate-400 mr-2 whitespace-nowrap">{t.outputLang}:</span>
                     <select 
                       value={outputLang}
                       onChange={(e) => setOutputLang(e.target.value as OutputLanguage)}
                       className="bg-transparent text-sm text-slate-200 focus:outline-none cursor-pointer"
                     >
                        <option value={OutputLanguage.CN}>{t.outCN}</option>
                        <option value={OutputLanguage.EN}>{t.outEN}</option>
                        <option value={OutputLanguage.JP}>{t.outJP}</option>
                        <option value={OutputLanguage.KR}>{t.outKR}</option>
                     </select>
                  </div>
                </div>

                <button
                  onClick={optimizePrompt}
                  disabled={loading || (taskMode === TaskMode.OPTIMIZE && !prompt.trim()) || (taskMode === TaskMode.REVERSE && !uploadedImage)}
                  className={`
                    w-full xl:w-auto px-8 py-2.5 rounded-lg font-bold text-white shadow-lg shadow-indigo-500/20
                    transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                    ${loading || (taskMode === TaskMode.OPTIMIZE && !prompt.trim()) || (taskMode === TaskMode.REVERSE && !uploadedImage)
                      ? 'bg-slate-700 cursor-not-allowed opacity-80' 
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'}
                  `}
                >
                  {loading ? (
                    <span className="flex items-center gap-2 justify-center">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {mode === OptimizationMode.THINKING ? t.thinkingState : (taskMode === TaskMode.REVERSE ? t.reversing : t.optimizing)}
                    </span>
                  ) : (taskMode === TaskMode.REVERSE ? t.reverse : t.generate)}
                </button>
              </div>
            </div>
          </div>

          {/* Result Section */}
          {result && (
            <div className="mt-8 space-y-6 pb-12 animate-fade-in-up">
              
              {/* Main Prompt Card */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 md:p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400">{t.optimizedPrompt}</h3>
                    <button 
                      onClick={() => copyToClipboard(result.optimizedPrompt)}
                      className="text-slate-400 hover:text-white transition-colors bg-slate-800 p-2 rounded-lg hover:bg-slate-700"
                      title={t.copy}
                    >
                      <CopyIcon />
                    </button>
                  </div>
                  <div className="font-mono text-base md:text-lg leading-relaxed text-slate-200 break-words whitespace-pre-wrap">
                    {result.optimizedPrompt}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Explanation Card */}
                <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-3">
                    {t.explanation}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                    {result.explanation}
                  </p>
                </div>

                {/* Technical Details Card */}
                <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 mb-3">
                    {t.technical}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                    {result.technicalDetails}
                  </p>
                </div>

                {/* Negative Prompt (Optional) */}
                {result.negativePrompt && (
                  <div className="md:col-span-2 bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="text-sm font-bold uppercase tracking-wider text-red-400">
                        {t.negative}
                      </h3>
                      <button 
                        onClick={() => copyToClipboard(result.negativePrompt!)}
                        className="text-slate-500 hover:text-white transition-colors"
                      >
                        <CopyIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="font-mono text-xs text-slate-400 break-words">
                      {result.negativePrompt}
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}
