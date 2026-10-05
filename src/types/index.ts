export interface LoveStoryConfig {
  partnerName: string;
  senderName: string;
  proposalQuestion: string;
  specialDate?: string;
  reasonsToLove: string[];
}

export type PageStep = 
  | 'intro'
  | 'balloons'
  | 'love_letter'
  | 'scratch'
  | 'popup_card'
  | 'heart_key'
  | 'constellation'
  | 'proposal'
  | 'celebration';

export interface BalloonItem {
  id: number;
  color: string;
  question: string;
  options: string[];
  sweetNote: string;
  popped: boolean;
  userAnswer?: string;
  xPos: number;
  speed: number;
  size: number;
}

export interface PromiseItem {
  id: string;
  text: string;
  category: 'adventure' | 'forever' | 'daily' | 'sweet';
}
