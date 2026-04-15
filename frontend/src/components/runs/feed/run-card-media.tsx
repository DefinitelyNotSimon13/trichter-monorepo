import { clientEnv } from "#/env/client";

function resolveImageUrl(imageUrl?: string) {
  if (!imageUrl) return null;

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  return `${clientEnv.VITE_API_BASE_URL}${imageUrl}`;
}

export function RunCardMedia(props: { imageUrl?: string; alt: string }) {
  const src = resolveImageUrl(props.imageUrl);

  if (!src) return null;

  return (
    <div className="border-b bg-muted/20">
      <img
        src={src}
        alt={props.alt}
        loading="lazy"
        className="h-72 w-full object-cover"
      />
    </div>
  );
}
