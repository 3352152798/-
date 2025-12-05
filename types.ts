
export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

export enum OptimizationMode {
  FAST = 'FAST',
  THINKING = 'THINKING'
}

export enum TaskMode {
  OPTIMIZE = 'OPTIMIZE',
  REVERSE = 'REVERSE'
}

export enum InterfaceLanguage {
  CN = 'CN',
  EN = 'EN'
}

export enum OutputLanguage {
  CN = 'Chinese',
  JP = 'Japanese',
  KR = 'Korean',
  EN = 'English'
}

export interface PromptResult {
  optimizedPrompt: string;
  explanation: string;
  technicalDetails: string; // Camera settings, aspect ratio suggestions, etc.
  negativePrompt?: string;
  isFallback?: boolean; // New flag to indicate auto-downgrade
}

export interface PromptOptions {
  originalPrompt: string;
  mediaType: MediaType;
  mode: OptimizationMode;
  outputLanguage: OutputLanguage;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  originalPrompt: string;
  mediaType: MediaType;
  mode: OptimizationMode;
  taskMode?: TaskMode;
  outputLanguage: OutputLanguage;
  result: PromptResult;
  imagePreview?: string; // For reverse mode history
}

export interface Preset {
  id: string;
  name: string;
  content: string;
}