interface LpVideoEmbedProps {
  videoUrl: string;
  poster?: string;
  title?: string;
  caption?: string;
}

export function LpVideoEmbed({ videoUrl, poster, title, caption }: LpVideoEmbedProps) {
  return (
    <section className="bg-[#0A0A0F] py-20 md:py-24">
      <div className="mx-auto max-w-4xl px-6">
        {title && (
          <h2 className="mb-10 text-center text-3xl font-black tracking-tight text-white md:text-4xl">
            {title}
          </h2>
        )}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#12121A]">
          <div className="relative aspect-video">
            <iframe
              src={videoUrl}
              title={title || "Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
              {...(poster ? { poster } : {})}
            />
          </div>
        </div>
        {caption && <p className="mt-4 text-center text-sm text-text-70">{caption}</p>}
      </div>
    </section>
  );
}

export default LpVideoEmbed;
