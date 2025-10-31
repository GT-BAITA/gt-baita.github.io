export default function YouTubeEmbed() {
  return (
    <div className="flex justify-center">
      <div className="relative w-full max-w-[840px] aspect-video overflow-hidden rounded-2xl shadow-lg">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src="https://www.youtube.com/embed/m_gvrV80jUs"
          title="YouTube video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
