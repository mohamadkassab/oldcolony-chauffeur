'use client';
import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { MessageCircle, X, Phone, Mail } from 'lucide-react';
import { Link, useRouter } from '@/i18n/navigation';
import clsx from 'clsx';
import { CHAT_SCRIPT, type ChatAction, type ChatNodeId, type ChatOption } from '@/lib/chat-script';

interface ChatMessage {
  from: 'bot' | 'user';
  text: string;
}

/** Where the conversation currently is: a script node, or an opened FAQ answer. */
type ChatView = { kind: 'node'; node: ChatNodeId } | { kind: 'faqAnswer' };

const OPTION_PILL =
  'flex items-center gap-2 rounded-full border border-brand-magenta/40 bg-white px-3.5 py-2 type-body-sm font-medium text-brand-magenta hover:bg-brand-light transition-colors cursor-pointer text-left';

export function ChatWidget() {
  const t    = useTranslations('chat');
  const tFaq = useTranslations('faq');
  const router = useRouter();

  const [open, setOpen]     = useState(false);
  const [view, setView]     = useState<ChatView>({ kind: 'node', node: 'root' });
  const [thread, setThread] = useState<ChatMessage[]>(() => [{ from: 'bot', text: t('greeting') }]);
  const threadRef = useRef<HTMLDivElement>(null);

  const faqItems = tFaq.raw('items') as { q: string; a: string }[];

  // Keep the newest message (and its option pills) in view.
  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' });
  }, [thread, view, open]);

  // Android/browser back closes the chat instead of leaving the page —
  // same pattern as the mobile menu.
  useEffect(() => {
    if (!open) return;
    window.history.pushState({ chatWidget: true }, '');
    const onPop = () => setOpen(false);
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
      if (window.history.state?.chatWidget) window.history.back();
    };
  }, [open]);

  const say = (user: string, bot?: string) => {
    setThread((prev) => [
      ...prev,
      { from: 'user', text: user },
      ...(bot ? [{ from: 'bot', text: bot } as ChatMessage] : []),
    ]);
  };

  const goToBooking = () => {
    setOpen(false);
    const target = document.getElementById('booking');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Page without a booking form — send the visitor home to the hero form.
      router.push('/');
      setTimeout(() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }), 350);
    }
  };

  const handleOption = (label: string, action: ChatAction) => {
    switch (action.type) {
      case 'node':
        say(label, t(CHAT_SCRIPT[action.node].answerKey));
        setView({ kind: 'node', node: action.node });
        break;
      case 'booking':
        say(label);
        goToBooking();
        break;
      // 'service', 'call' and 'email' render as links — no click handling here.
      case 'service':
      case 'call':
      case 'email':
        break;
    }
  };

  const handleFaqItem = (index: number) => {
    say(faqItems[index].q, faqItems[index].a);
    setView({ kind: 'faqAnswer' });
  };

  const renderOption = (option: ChatOption) => {
    const label = t(option.labelKey);
    const Icon  = option.icon;
    const inner = (
      <>
        {Icon && <Icon size={14} className="flex-shrink-0" />}
        {label}
      </>
    );

    switch (option.action.type) {
      case 'service':
        return (
          <Link
            key={option.labelKey}
            href={{ pathname: '/services/[slug]', params: { slug: option.action.slug } }}
            className={OPTION_PILL}
            onClick={() => setOpen(false)}
          >
            {inner}
          </Link>
        );
      case 'call':
        return (
          <a key={option.labelKey} href="tel:+17812345451" className={OPTION_PILL}>
            <Phone size={14} className="flex-shrink-0" />
            {label}
          </a>
        );
      case 'email':
        return (
          <a key={option.labelKey} href="mailto:info@oldcolonychauffeur.com" className={OPTION_PILL}>
            <Mail size={14} className="flex-shrink-0" />
            {label}
          </a>
        );
      default:
        return (
          <button
            key={option.labelKey}
            type="button"
            onClick={() => handleOption(label, option.action)}
            className={OPTION_PILL}
          >
            {inner}
          </button>
        );
    }
  };

  const currentNode = view.kind === 'node' ? CHAT_SCRIPT[view.node] : null;

  return (
    <>
      {/* Launcher bubble — sits above the sticky mobile bar on phones. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('open')}
        className={clsx(
          'fixed right-4 bottom-[4.5rem] md:right-6 md:bottom-6 z-[80] p-3.5 rounded-full',
          'bg-brand-magenta text-white shadow-lg hover:bg-brand-pink transition-all duration-200 cursor-pointer',
          open && 'opacity-0 pointer-events-none scale-90',
        )}
      >
        <MessageCircle size={24} />
      </button>

      {/* Panel */}
      <div
        className={clsx(
          'fixed z-[80] inset-x-3 bottom-[4.5rem] md:inset-x-auto md:right-6 md:bottom-6 md:w-96',
          'flex flex-col rounded-2xl bg-white shadow-2xl overflow-hidden',
          'transition-all duration-200 origin-bottom-right',
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-brand-magenta px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
              <svg viewBox="0 0 100 100" aria-hidden="true" className="w-5 h-5">
                <polygon points="50,4 55.5,45 96,50 55.5,55 50,96 44.5,55 4,50 44.5,45" fill="#FFFFFF" />
                <polygon points="72,28 58,50 72,72 50,58 28,72 42,50 28,28 50,42" fill="#FFFFFF" fillOpacity="0.55" />
              </svg>
            </div>
            <p className="type-body-sm font-semibold text-white leading-tight">{t('title')}</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t('close')}
            className="text-white/70 hover:text-white p-1 cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Thread + options */}
        <div ref={threadRef} className="flex-1 overflow-y-auto px-3.5 py-4 space-y-3 max-h-[55vh] md:max-h-[26rem]">
          {thread.map((msg, i) => (
            <div key={i} className={clsx('flex', msg.from === 'user' ? 'justify-end' : 'justify-start')}>
              <p
                className={clsx(
                  'type-body-sm max-w-[85%] rounded-2xl px-3.5 py-2.5 whitespace-pre-line',
                  msg.from === 'user'
                    ? 'bg-brand-magenta text-white rounded-br-sm'
                    : 'bg-brand-light text-gray-700 rounded-bl-sm',
                )}
              >
                {msg.text}
              </p>
            </div>
          ))}

          {/* Option pills for the current step */}
          <div className="flex flex-wrap gap-2 pt-1">
            {currentNode?.showFaqItems &&
              faqItems.map((item, i) => (
                <button key={i} type="button" onClick={() => handleFaqItem(i)} className={OPTION_PILL}>
                  {item.q}
                </button>
              ))}
            {currentNode?.options.map(renderOption)}
            {view.kind === 'faqAnswer' && (
              <>
                {renderOption({ labelKey: 'moreQuestions', action: { type: 'node', node: 'faq' } })}
                {renderOption({ labelKey: 'back', action: { type: 'node', node: 'root' } })}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
