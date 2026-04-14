import { Image as ImageIcon } from "lucide-react";
import { env } from "#/env";

function resolveImageUrl(imageUrl?: string) {
  if (!imageUrl) return null;

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  return `${env.VITE_API_BASE_URL}${imageUrl}`;
}

export function RunCardMedia(props: { imageUrl?: string; alt: string }) {
  const src = resolveImageUrl(props.imageUrl);

  if (!src) return null;

  return (
    <div className="border-b bg-muted/20">
      {src ? (
        <img
          src={src}
          alt={props.alt}
          loading="lazy"
          className="h-72 w-full object-cover"
        />
      ) : (
        <div className="flex h-72 items-center justify-center bg-muted/30">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImageIcon className="size-8" />
            <span className="text-sm">No image</span>
          </div>
        </div>
      )}
    </div>
  );
}
