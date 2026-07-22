import type { LucideIcon } from 'lucide-react';
import { Car, Plane, Tag, MapPin, HelpCircle, Headset } from 'lucide-react';

/** What tapping a chat option does. */
export type ChatAction =
  | { type: 'node'; node: ChatNodeId }   // move to another node in the tree
  | { type: 'booking' }                  // jump to the booking form
  | { type: 'service'; slug: string }    // open a service landing page
  | { type: 'call' }
  | { type: 'email' };

export interface ChatOption {
  /** Message key under `chat.` for the button label. */
  labelKey: string;
  action: ChatAction;
  icon?: LucideIcon;
}

export interface ChatNode {
  /** Message key under `chat.` for the bot's answer when this node opens. */
  answerKey: string;
  options: ChatOption[];
  /** The FAQ node also lists `faq.items` questions as dynamic buttons. */
  showFaqItems?: boolean;
}

export type ChatNodeId = 'root' | 'airport' | 'pricing' | 'area' | 'faq' | 'human';

const BACK: ChatOption = { labelKey: 'back', action: { type: 'node', node: 'root' } };

/** The whole conversation — a small decision tree, no AI involved. */
export const CHAT_SCRIPT: Record<ChatNodeId, ChatNode> = {
  root: {
    answerKey: 'greeting',
    options: [
      { labelKey: 'menu.book',    action: { type: 'booking' },                icon: Car },
      { labelKey: 'menu.airport', action: { type: 'node', node: 'airport' },  icon: Plane },
      { labelKey: 'menu.pricing', action: { type: 'node', node: 'pricing' },  icon: Tag },
      { labelKey: 'menu.area',    action: { type: 'node', node: 'area' },     icon: MapPin },
      { labelKey: 'menu.faq',     action: { type: 'node', node: 'faq' },      icon: HelpCircle },
      { labelKey: 'menu.human',   action: { type: 'node', node: 'human' },    icon: Headset },
    ],
  },
  airport: {
    answerKey: 'airport.answer',
    options: [
      { labelKey: 'airport.book',      action: { type: 'booking' }, icon: Plane },
      { labelKey: 'airport.learnMore', action: { type: 'service', slug: 'airport-transfer' } },
      BACK,
    ],
  },
  pricing: {
    answerKey: 'pricing.answer',
    options: [
      { labelKey: 'pricing.book', action: { type: 'booking' }, icon: Car },
      { labelKey: 'call',         action: { type: 'call' } },
      BACK,
    ],
  },
  area: {
    answerKey: 'area.answer',
    options: [
      { labelKey: 'call', action: { type: 'call' } },
      BACK,
    ],
  },
  faq: {
    answerKey: 'faq.answer',
    showFaqItems: true,
    options: [BACK],
  },
  human: {
    answerKey: 'human.answer',
    options: [
      { labelKey: 'call',  action: { type: 'call' } },
      { labelKey: 'email', action: { type: 'email' } },
      BACK,
    ],
  },
};
