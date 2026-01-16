// User Types
export interface User {
  id: string;
  email: string;
  created_at: string;
}

// App State Types
export interface AppState {
  isTrialMode: boolean;
  trialCount: number;
  currentPanel: PanelType;
  activeGender: 'Male' | 'Female';
  affimateMassMode: boolean;
}

export type PanelType = 'character' | 'image' | 'script' | 'veo';

// Character Generator Types
export interface CharacterSettings {
  gender: 'Male' | 'Female';
  style: string;
  age: string;
  ethnicity: string;
  hair: string;
  hairColor: string;
  body: string;
  outfit: string;
  prompt: string;
}

// Product Studio Types
export interface ProductSettings {
  description: string;
  modelOption: string;
  theme: string;
  lighting: string;
  angle: string;
  extraDetails: string;
  massMode: boolean;
  genCount: number;
}

export interface ProductImages {
  front: string | null;
  back: string | null;
  customModel: string | null;
}

// Script Generator Types
export interface ScriptSettings {
  mode: 'script' | 'caption' | 'hashtag';
  productDesc: string;
  audience: string;
  platform: string;
  duration: string;
  tone: string;
  language: string;
  structure: string;
  points: string;
  veoMode: boolean;
  veoDuration: string;
  veoSceneCount: number;
}

// VEO Generator Types
export interface VeoSettings {
  style: string;
  shot: string;
  camera: string;
  dialogue: string;
  instruction: string;
}

// TTS Settings
export interface TTSSettings {
  voice: string;
  temperature: number;
}

// API Response Types
export interface GenerateResponse {
  success: boolean;
  data?: string;
  error?: string;
}

// Toast Types
export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error';
}

// Modal Types
export interface ImagePreviewState {
  isOpen: boolean;
  src: string;
  base64: string;
  onRegenerate?: () => void;
}

export interface CropModalState {
  isOpen: boolean;
  imageSrc: string;
  aspectRatio: number;
}

// Dropdown Options
export interface SelectOption {
  value: string;
  label: string;
}

// Smart Theme Categories
export type ThemeCategory = 'fashion' | 'food' | 'tech' | 'beauty' | 'general';
