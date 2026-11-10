import { WhatsappIcon } from "./Social";
export function WhatsAppFloat({ number }: { number: string }) {
  if (!number) return null;
  const text = encodeURIComponent("Hello Iliza Terra Homes, I'm interested in an opportunity in Rwanda.");
  return (
    <a href={`https://wa.me/${number.replace(/\D/g, "")}?text=${text}`} target="_blank" rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed right-5 bottom-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-xl shadow-black/20 transition hover:scale-110">
      <WhatsappIcon className="h-7 w-7" />
    </a>
  );
}
