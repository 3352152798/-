import React, { useState, useEffect, useRef } from 'react';
// REMOVED: import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MediaType, OptimizationMode, PromptResult, HistoryItem, InterfaceLanguage, OutputLanguage, TaskMode, Preset, ModelProvider, ModelConfig } from './types';

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

const SidebarTriggerIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h12m-12 5.25h16.5" />
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

const ExclamationCircleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
  </svg>
);

const Cog6ToothIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const GoogleIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.347.533 12S5.867 24 12.48 24c3.44 0 6.013-1.133 8.053-3.24 2.067-2.107 2.68-5.053 2.68-7.453 0-.733-.08-1.453-.213-2.133h-10.52z"/>
    </svg>
);

const OpenAIIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M22.2819 9.82116L12.0002 3.88516C11.6669 3.69266 11.2605 3.69266 10.9272 3.88516L0.64549 9.82116C0.312157 10.0137 0.10376 10.3751 0.10376 10.7602V22.6312C0.10376 23.0163 0.312157 23.3777 0.64549 23.5702L10.9272 29.5062C11.0939 29.6025 11.2814 29.6506 11.4688 29.6506C11.6563 29.6506 11.8438 29.6025 12.0105 29.5062L22.2922 23.5702C22.6255 23.3777 22.8339 23.0163 22.8339 22.6312V10.7602C22.8235 10.3751 22.6152 10.0137 22.2819 9.82116ZM18.7819 21.0812L15.3444 19.0987V13.8437L20.4485 16.7912L18.7819 21.0812ZM11.4688 27.2762L4.62549 23.3287V15.4337L11.4688 19.3837V27.2762ZM4.15674 13.8437V8.58866L7.59424 6.60616L9.26091 10.8962L4.15674 13.8437ZM12.0002 12.8337L5.15674 8.88366L12.0002 4.93366L18.8435 8.88366L12.0002 12.8337ZM16.4069 6.60616L19.8444 8.58866V13.8437L14.7402 10.8962L16.4069 6.60616Z" transform="translate(0.53 3.65) scale(0.65)"/>
    </svg>
);


// --- Translations ---

const translations = {
  [InterfaceLanguage.CN]: {
    appTitle: "提示词炼金术",
    historyTitle: "历史记录",
    presetsTitle: "预设风格",
    settingsTitle: "模型设置",
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
    outKR: "한국어",
    fallbackToast: "深度思考超时，已自动切换为快速模式",
    textModel: "文本模型 (提示词优化)",
    visionModel: "视觉模型 (图片反推)",
    previewModel: "视觉预览模型",
    provider: "提供商",
    modelName: "模型名称",
    apiKey: "API Key",
    baseUrl: "API Base URL",
    saveSettings: "保存设置",
    default: "默认",
    custom: "自定义",
    visualPreview: "视觉预览",
    generatePreview: "🔮 召唤画面",
    generatingPreview: "绘制中...",
    previewFailed: "预览生成失败",
    clickToEnlarge: "点击放大",
  },
  [InterfaceLanguage.EN]: {
    appTitle: "Prompt Alchemy",
    historyTitle: "History",
    presetsTitle: "Presets",
    settingsTitle: "Settings",
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
    outKR: "Korean",
    fallbackToast: "Thinking mode timed out, switched to Fast mode automatically",
    textModel: "Text Model (Optimize)",
    visionModel: "Vision Model (Reverse)",
    previewModel: "Visual Preview Model",
    provider: "Provider",
    modelName: "Model Name",
    apiKey: "API Key",
    baseUrl: "API Base URL",
    saveSettings: "Save Settings",
    default: "Default",
    custom: "Custom",
    visualPreview: "Visual Preview",
    generatePreview: "🔮 Conjure Vision",
    generatingPreview: "Painting...",
    previewFailed: "Preview failed",
    clickToEnlarge: "Click to Enlarge",
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

function useOnClickOutside(ref: React.RefObject<HTMLElement | null>, handler: (event: MouseEvent | TouchEvent) => void) {
  useEffect(
    () => {
      const listener = (event: MouseEvent | TouchEvent) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target as Node)) {
          return;
        }
        handler(event);
      };
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    },
    [ref, handler]
  );
}

// --- Custom Components ---

interface SelectOption {
    label: string;
    value: string;
    icon?: React.ReactNode;
}

const CustomSelect = ({ 
    options, 
    value, 
    onChange, 
    icon,
    className = "",
    dropdownClassName = "",
    direction = "down"
}: { 
    options: SelectOption[], 
    value: string, 
    onChange: (val: string) => void,
    icon?: React.ReactNode,
    className?: string,
    dropdownClassName?: string,
    direction?: "up" | "down"
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    
    useOnClickOutside(ref, () => setIsOpen(false));

    const selectedOption = options.find(o => o.value === value) || options[0];

    return (
        <div className={`relative ${className}`} ref={ref}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 hover:border-slate-600 transition-colors focus:outline-none focus:border-indigo-500 ${isOpen ? 'border-indigo-500 ring-1 ring-indigo-500/20' : ''}`}
            >
                <div className="flex items-center gap-2 truncate">
                    {icon && <span className="text-slate-400 flex-shrink-0">{icon}</span>}
                    {selectedOption?.icon && <span className="text-indigo-400 flex-shrink-0">{selectedOption.icon}</span>}
                    <span className="truncate">{selectedOption?.label}</span>
                </div>
                <svg 
                    className={`w-4 h-4 text-slate-500 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </button>

            {isOpen && (
                <div className={`absolute z-50 w-full bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden animate-fade-in-up ${direction === 'up' ? 'bottom-full mb-1' : 'top-full mt-1'} ${dropdownClassName}`}>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center gap-2 transition-colors
                                    ${opt.value === value 
                                        ? 'bg-indigo-600/20 text-indigo-300' 
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }
                                `}
                            >
                                {opt.icon && <span className={`flex-shrink-0 ${opt.value === value ? "text-indigo-400" : "text-slate-500"}`}>{opt.icon}</span>}
                                <span className="truncate">{opt.label}</span>
                                {opt.value === value && (
                                    <svg className="w-4 h-4 ml-auto text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};


type SidebarTab = 'HISTORY' | 'PRESETS';

// --- Components ---

const VisualPreview = ({ 
    prompt, 
    mediaType, 
    lang, 
    modelConfig,
    existingImage
}: { 
    prompt: string, 
    mediaType: MediaType, 
    lang: InterfaceLanguage,
    modelConfig: ModelConfig,
    existingImage?: string
}) => {
    const [image, setImage] = useState<string | null>(existingImage || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const t = translations[lang];

    // Reset local state if prompt changes (new generation) and no existing image passed
    useEffect(() => {
        if (!existingImage) {
            setImage(null);
            setError(null);
        }
    }, [prompt, existingImage]);

    const generatePreview = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt,
                    mediaType,
                    modelConfig // Pass the config to check API Key (though server uses default for now)
                })
            });

            if (!response.ok) {
                // Try to parse error message from backend
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.details || errData.error || 'Failed to generate image');
            }

            const data = await response.json();
            setImage(data.imageUrl);
        } catch (e: any) {
            console.error(e);
            setError(e.message || t.previewFailed);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-xl p-6 relative overflow-hidden group">
             {isZoomed && image && (
                <div 
                    className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
                    onClick={() => setIsZoomed(false)}
                >
                    <img src={image} className="max-w-full max-h-full rounded-lg shadow-2xl" alt="Preview" />
                </div>
            )}

            <div className="flex justify-between items-center mb-4">
                 <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                    <PhotoIcon className="w-4 h-4" /> {t.visualPreview}
                </h3>
            </div>

            {!image && !loading && !error && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <button 
                        onClick={generatePreview}
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 rounded-full transition-all hover:shadow-lg hover:shadow-purple-500/20 font-medium flex items-center gap-2 group-hover:scale-105"
                    >
                         {t.generatePreview}
                    </button>
                    {mediaType === MediaType.VIDEO && (
                        <p className="text-xs text-slate-500 mt-2">
                            (Generates an adaptive storyboard)
                        </p>
                    )}
                </div>
            )}

            {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                     <div className="w-8 h-8 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin mb-3"></div>
                     <span className="text-slate-400 text-sm animate-pulse">{t.generatingPreview}</span>
                </div>
            )}

            {error && (
                <div className="text-center py-8 text-red-400 text-sm px-4">
                    <div className="font-medium mb-1">{t.previewFailed}</div>
                    <div className="text-xs text-red-400/70 mb-3 break-words max-w-md mx-auto">{error}</div>
                    <button onClick={generatePreview} className="underline hover:text-red-300 text-xs uppercase tracking-wider">Retry</button>
                </div>
            )}

            {image && !loading && (
                <div className="relative rounded-lg overflow-hidden border border-slate-700/50 shadow-xl group/img">
                    <img 
                        src={image} 
                        alt="Visual Preview" 
                        className="w-full h-auto cursor-zoom-in"
                        onClick={() => setIsZoomed(true)}
                    />
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover/img:opacity-100 transition-opacity">
                         <span className="bg-black/60 text-white text-[10px] px-2 py-1 rounded-full pointer-events-none">
                            {t.clickToEnlarge}
                         </span>
                    </div>
                </div>
            )}
        </div>
    );
};

const FallbackToast = ({ message, visible }: { message: string, visible: boolean }) => {
    if (!visible) return null;
    return (
        <div className="fixed top-20 right-4 z-50 animate-fade-in-up">
            <div className="bg-orange-500/90 text-white px-4 py-3 rounded-lg shadow-xl backdrop-blur-md flex items-center gap-3 border border-orange-400/50 max-w-sm">
                <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{message}</span>
            </div>
        </div>
    );
};

const SettingsModal = ({ isOpen, onClose, lang, textConfig, setTextConfig, visionConfig, setVisionConfig, previewConfig, setPreviewConfig }: { 
    isOpen: boolean, 
    onClose: () => void, 
    lang: InterfaceLanguage,
    textConfig: ModelConfig,
    setTextConfig: (c: ModelConfig) => void,
    visionConfig: ModelConfig,
    setVisionConfig: (c: ModelConfig) => void,
    previewConfig: ModelConfig,
    setPreviewConfig: (c: ModelConfig) => void
}) => {
    if (!isOpen) return null;
    const t = translations[lang];
    
    const providerOptions: SelectOption[] = [
        { label: "Google GenAI (Gemini)", value: ModelProvider.GOOGLE, icon: <GoogleIcon /> },
        { label: "OpenAI Compatible", value: ModelProvider.OPENAI, icon: <OpenAIIcon /> }
    ];

    const ConfigSection = ({ title, config, setConfig }: { title: string, config: ModelConfig, setConfig: (c: ModelConfig) => void }) => (
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 space-y-3">
            <h4 className="font-bold text-indigo-300 text-sm uppercase tracking-wide flex items-center gap-2">
                {title}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs text-slate-400 mb-1">{t.provider}</label>
                    <CustomSelect 
                        options={providerOptions}
                        value={config.provider}
                        onChange={(val) => setConfig({ ...config, provider: val as ModelProvider })}
                    />
                </div>
                <div>
                    <label className="block text-xs text-slate-400 mb-1">{t.modelName}</label>
                    <input 
                        type="text"
                        value={config.modelName}
                        onChange={(e) => setConfig({ ...config, modelName: e.target.value })}
                        placeholder={config.provider === ModelProvider.GOOGLE ? "gemini-2.5-flash" : "gpt-4o"}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none placeholder-slate-600 h-[38px]"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">{t.baseUrl} <span className="text-slate-600">(Optional)</span></label>
                    <input 
                        type="text"
                        value={config.baseUrl}
                        onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                        placeholder={config.provider === ModelProvider.GOOGLE ? "https://generativelanguage.googleapis.com" : "https://api.openai.com"}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none placeholder-slate-600"
                    />
                </div>
                 <div className="md:col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">{t.apiKey} <span className="text-slate-600">(Leave empty to use server default for Google)</span></label>
                    <input 
                        type="password"
                        value={config.apiKey}
                        onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                        placeholder="sk-..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none placeholder-slate-600 font-mono"
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in-up">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50 rounded-t-2xl">
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center gap-2">
                        <Cog6ToothIcon /> {t.settingsTitle}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                    <ConfigSection title={t.textModel} config={textConfig} setConfig={setTextConfig} />
                    <ConfigSection title={t.visionModel} config={visionConfig} setConfig={setVisionConfig} />
                    <ConfigSection title={t.previewModel} config={previewConfig} setConfig={setPreviewConfig} />
                </div>
                <div className="p-4 border-t border-slate-800 bg-slate-950/30 rounded-b-2xl text-center">
                    <button 
                        onClick={onClose}
                        className="px-8 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        {t.saveSettings}
                    </button>
                </div>
            </div>
        </div>
    );
};

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
          <h3 className="text-lg font-bold text-slate-400 mb-2 flex items-center gap-2">
            <Cog6ToothIcon /> 模型设置
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            点击侧边栏的齿轮图标，您可以自定义后端调用的模型。支持切换 Google Gemini 或 OpenAI Compatible (如 GPT-4o, DeepSeek 等) 模型，并可分别设置文本生成和视觉反推所使用的模型。
          </p>
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
          <h3 className="text-lg font-bold text-slate-400 mb-2 flex items-center gap-2">
            <Cog6ToothIcon /> Model Settings
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
             Click the gear icon in the sidebar to customize backend models. You can switch between Google Gemini or OpenAI Compatible (e.g., GPT-4o, DeepSeek) and configure Text Generation and Vision Analysis models separately.
          </p>
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

const DEFAULT_TEXT_CONFIG: ModelConfig = {
    provider: ModelProvider.GOOGLE,
    modelName: 'gemini-2.5-flash',
    apiKey: '',
    baseUrl: ''
};

const DEFAULT_VISION_CONFIG: ModelConfig = {
    provider: ModelProvider.GOOGLE,
    modelName: 'gemini-2.5-flash',
    apiKey: '',
    baseUrl: ''
};

const DEFAULT_PREVIEW_CONFIG: ModelConfig = {
    provider: ModelProvider.GOOGLE,
    modelName: 'gemini-2.5-flash-image',
    apiKey: '',
    baseUrl: ''
};

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
  
  // Model Settings State
  const [textModelConfig, setTextModelConfig] = useState<ModelConfig>(DEFAULT_TEXT_CONFIG);
  const [visionModelConfig, setVisionModelConfig] = useState<ModelConfig>(DEFAULT_VISION_CONFIG);
  const [previewModelConfig, setPreviewModelConfig] = useState<ModelConfig>(DEFAULT_PREVIEW_CONFIG);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PromptResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>('HISTORY');
  const [isMobile, setIsMobile] = useState(false);
  
  // Modal States
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Fallback Toast State
  const [showFallbackToast, setShowFallbackToast] = useState(false);

  const t = translations[interfaceLang];

  // Output Language Options
  const outputLangOptions: SelectOption[] = [
      { label: t.outCN, value: OutputLanguage.CN },
      { label: t.outEN, value: OutputLanguage.EN },
      { label: t.outJP, value: OutputLanguage.JP },
      { label: t.outKR, value: OutputLanguage.KR },
  ];

  // Load data & settings on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('prompt_alchemy_history');
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) { localStorage.removeItem('prompt_alchemy_history'); }
    }
    
    const savedPresets = localStorage.getItem('prompt_alchemy_presets');
    if (savedPresets) {
        try { setPresets(JSON.parse(savedPresets)); } catch (e) { localStorage.removeItem('prompt_alchemy_presets'); }
    }

    const savedLang = localStorage.getItem('prompt_alchemy_lang');
    if (savedLang && (savedLang === 'CN' || savedLang === 'EN')) {
      setInterfaceLang(savedLang as InterfaceLanguage);
    }
    
    // Load Model Configs
    const savedTextConfig = localStorage.getItem('prompt_alchemy_text_config');
    if (savedTextConfig) {
        try { setTextModelConfig({ ...DEFAULT_TEXT_CONFIG, ...JSON.parse(savedTextConfig) }); } catch (e) {}
    }
    
    const savedVisionConfig = localStorage.getItem('prompt_alchemy_vision_config');
    if (savedVisionConfig) {
         try { setVisionModelConfig({ ...DEFAULT_VISION_CONFIG, ...JSON.parse(savedVisionConfig) }); } catch (e) {}
    }
    
    const savedPreviewConfig = localStorage.getItem('prompt_alchemy_preview_config');
    if (savedPreviewConfig) {
         try { setPreviewModelConfig({ ...DEFAULT_PREVIEW_CONFIG, ...JSON.parse(savedPreviewConfig) }); } catch (e) {}
    }

    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Save history
  useEffect(() => {
    try { localStorage.setItem('prompt_alchemy_history', JSON.stringify(history)); } catch (e) {}
  }, [history]);

  // Save presets
  useEffect(() => {
    try { localStorage.setItem('prompt_alchemy_presets', JSON.stringify(presets)); } catch (e) {}
  }, [presets]);

  // Save language preference
  useEffect(() => {
    localStorage.setItem('prompt_alchemy_lang', interfaceLang);
  }, [interfaceLang]);
  
  // Save model configs
  useEffect(() => {
      localStorage.setItem('prompt_alchemy_text_config', JSON.stringify(textModelConfig));
  }, [textModelConfig]);
  
  useEffect(() => {
      localStorage.setItem('prompt_alchemy_vision_config', JSON.stringify(visionModelConfig));
  }, [visionModelConfig]);
  
  useEffect(() => {
      localStorage.setItem('prompt_alchemy_preview_config', JSON.stringify(previewModelConfig));
  }, [previewModelConfig]);

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
    setShowFallbackToast(false); // Reset toast

    // Determine which config to use based on task
    const activeConfig = taskMode === TaskMode.REVERSE ? visionModelConfig : textModelConfig;

    // Create an abort controller for the fetch request
    const controller = new AbortController();
    // Increase client side timeout to 90s to handle "Thinking" models which are slow
    const timeoutId = setTimeout(() => controller.abort(), 90000);

    try {
      // PREPARE IMAGE PAYLOAD: Resize to avoid 413 Payload Too Large on Vercel
      let payloadImage = uploadedImage;
      if (taskMode === TaskMode.REVERSE && uploadedImage) {
        try {
           // 1024px is plenty for GenAI to understand context, but small enough (<500kb) for Vercel
           payloadImage = await resizeImage(uploadedImage, 1024);
        } catch (e) {
           console.error("Failed to resize image for payload, sending original (might fail)", e);
        }
      }

      // Use the backend API
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
          uploadedImage: payloadImage, // Use the resized image
          modelConfig: activeConfig // Send the specific config
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const parsedResult = await response.json() as PromptResult;
      
      // CHECK FOR FALLBACK
      if (parsedResult.isFallback) {
         setMode(OptimizationMode.FAST); // Visual update to match reality
         setShowFallbackToast(true);
         setTimeout(() => setShowFallbackToast(false), 2500); // Hide after 2.5s
      }

      setResult(parsedResult);
      
      // Prepare Thumbnail for history (Smaller 200px)
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

    } catch (error: any) {
      console.error("Generation failed", error);
      if (error.name === 'AbortError') {
         alert(t.failed + " (Timeout: The model took too long to think)");
      } else {
         alert(`${t.failed} (${error.message})`);
      }
    } finally {
      clearTimeout(timeoutId);
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
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
        lang={interfaceLang}
        textConfig={textModelConfig}
        setTextConfig={setTextModelConfig}
        visionConfig={visionModelConfig}
        setVisionConfig={setVisionModelConfig}
        previewConfig={previewModelConfig}
        setPreviewConfig={setPreviewModelConfig}
      />
      
      {/* Fallback Toast */}
      <FallbackToast message={t.fallbackToast} visible={showFallbackToast} />

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
          <div className="flex items-center gap-1">
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
                onClick={() => setSettingsOpen(true)}
                className="text-slate-400 hover:text-indigo-400 transition-colors p-1"
                title={translations[interfaceLang].settingsTitle}
            >
                <Cog6ToothIcon />
            </button>
             <button 
                onClick={() => setHelpOpen(true)}
                className="text-slate-400 hover:text-indigo-400 transition-colors p-1"
                title={translations[interfaceLang].helpTitle}
            >
                <QuestionMarkCircleIcon />
            </button>
             {isMobile && (
                <button onClick={() => setSidebarOpen(false)} className="text-slate-400 p-1">
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
            <button 
                onClick={() => setSidebarOpen(true)} 
                className="text-slate-300 mr-4 p-2 -ml-2 rounded-lg hover:bg-slate-800 hover:text-indigo-400 transition-colors active:scale-95"
            >
              <SidebarTriggerIcon className="w-8 h-8" />
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

            {/* Note: Removed overflow-hidden to allow custom dropdowns to display correctly */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-1 shadow-lg">
              
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
              <div className="flex flex-col xl:flex-row justify-between items-center p-3 gap-4 border-t border-slate-800/50 bg-slate-900/30 rounded-b-xl relative z-10">
                
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
                    {/* Only show Thinking mode if using Google (Gen 2.5 feature) - or let backend degrade gracefully */}
                    <button
                      onClick={() => setMode(OptimizationMode.THINKING)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${mode === OptimizationMode.THINKING ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      <BrainIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">{t.thinking}</span>
                    </button>
                  </div>

                  {/* Output Language Selector */}
                  <div className="flex items-center">
                     <span className="text-xs text-slate-400 mr-2 whitespace-nowrap">{t.outputLang}:</span>
                     <CustomSelect 
                       options={outputLangOptions}
                       value={outputLang}
                       onChange={(val) => setOutputLang(val as OutputLanguage)}
                       className="w-32"
                       direction="up" // Opens upward to avoid being cut off
                     />
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
                
                {/* Visual Preview Card (New) */}
                <div className="md:col-span-2">
                    <VisualPreview 
                        prompt={result.optimizedPrompt} 
                        mediaType={mediaType} 
                        lang={interfaceLang}
                        modelConfig={previewModelConfig} // Use specific preview config
                        existingImage={result.generatedImage}
                    />
                </div>

                {/* Explanation Card */}
                <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
                        {t.explanation}
                    </h3>
                    <button 
                        onClick={() => copyToClipboard(result.explanation)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-medium border border-slate-700"
                        title={t.copy}
                    >
                        <CopyIcon className="w-3.5 h-3.5" />
                        {t.copy}
                    </button>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                    {result.explanation}
                  </p>
                </div>

                {/* Technical Details Card */}
                <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400">
                        {t.technical}
                    </h3>
                    <button 
                        onClick={() => copyToClipboard(result.technicalDetails)}
                         className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-medium border border-slate-700"
                        title={t.copy}
                    >
                        <CopyIcon className="w-3.5 h-3.5" />
                        {t.copy}
                    </button>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                    {result.technicalDetails}
                  </p>
                </div>

                {/* Negative Prompt (Optional) */}
                {result.negativePrompt && (
                  <div className="md:col-span-2 bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-2">
                       <h3 className="text-sm font-bold uppercase tracking-wider text-red-400">
                        {t.negative}
                      </h3>
                      <button 
                        onClick={() => copyToClipboard(result.negativePrompt!)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-medium border border-slate-700"
                      >
                         <CopyIcon className="w-3.5 h-3.5" />
                         {t.copy}
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