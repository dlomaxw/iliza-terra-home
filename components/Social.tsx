type P = { className?: string };
const base = (className = "h-5 w-5") => ({ className, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true });

export const FacebookIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="M14 8.5V6.8c0-.8.5-1 1-1h2.4V2.1L14.6 2C11.5 2 10.4 4.2 10.4 6.3v2.2H8v3.8h2.4V22H14v-9.7h3.1l.5-3.8H14z" /></svg>
);
export const InstagramIcon = ({ className }: P) => (
  <svg {...base(className)} fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
);
export const LinkedinIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="M4.5 9h3.6v11.5H4.5zM6.3 3.5a2.1 2.1 0 110 4.2 2.1 2.1 0 010-4.2zM10.2 9h3.4v1.6c.5-.9 1.7-1.9 3.6-1.9 3.8 0 4.5 2.5 4.5 5.8v6H18v-5.3c0-1.3 0-2.9-1.8-2.9s-2.1 1.4-2.1 2.8v5.4h-3.6z" /></svg>
);
export const YoutubeIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="M22 8.2a3 3 0 00-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 002 8.2 31 31 0 001.6 12c0 1.3.1 2.6.4 3.8a3 3 0 002.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 002.1-2.1c.3-1.2.4-2.5.4-3.8s-.1-2.6-.4-3.8zM10 15.1V8.9l5.2 3.1L10 15.1z" /></svg>
);
export const XIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="M17.8 3h3.1l-6.8 7.7 8 10.3h-6.3l-4.9-6.4L5.3 21H2.2l7.3-8.3L1.9 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.5l11.2 14.5z" /></svg>
);
export const TiktokIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="M16.6 3c.3 2.2 1.6 3.7 3.9 3.9v3.1c-1.4.1-2.7-.3-3.9-1.1v6.2c0 3.6-2.6 5.9-5.8 5.9a5.7 5.7 0 01-5.7-5.8c0-3.5 3-6 6.6-5.5v3.2c-1.6-.4-3.2.6-3.2 2.3 0 1.4 1 2.4 2.4 2.4 1.5 0 2.4-1 2.4-2.6V3h3.3z" /></svg>
);
export const WhatsappIcon = ({ className }: P) => (
  <svg {...base(className)}><path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.7 11.8 11.8 0 004.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z" /></svg>
);
