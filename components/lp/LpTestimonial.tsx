import { Quote } from "lucide-react";

interface LpTestimonialProps {
  quote: string;
  author: string;
  role: string;
  photo?: string;
  accentColor?: string;
}

export function LpTestimonial({
  quote,
  author,
  role,
  photo,
  accentColor = "#00D4FF",
}: LpTestimonialProps) {
  return (
    <section className="bg-[#0A0A0F] py-20 md:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="rounded-2xl border border-white/10 bg-[#12121A] p-8 md:p-10">
          <Quote className="h-10 w-10 opacity-40" style={{ color: accentColor }} />
          <blockquote className="mt-5 text-lg font-medium leading-relaxed text-white md:text-xl">
            &ldquo;{quote}&rdquo;
          </blockquote>
          <div className="mt-8 flex items-center gap-4">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-lg font-bold text-white"
              style={photo ? { backgroundImage: `url(${photo})`, backgroundSize: "cover" } : {}}
            >
              {!photo && author.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-white">{author}</div>
              <div className="text-sm text-white/60">{role}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LpTestimonial;
