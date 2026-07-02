import { toPng } from "html-to-image";

/** Renders a DOM node to a PNG blob, used for both download and Web Share. */
export async function nodeToPngBlob(node: HTMLElement): Promise<Blob> {
  const dataUrl = await toPng(node, { pixelRatio: 2, cacheBust: true });
  const res = await fetch(dataUrl);
  return res.blob();
}

export async function downloadPng(node: HTMLElement, filename: string): Promise<void> {
  const blob = await nodeToPngBlob(node);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/** Uses the Web Share API when available, falling back to clipboard image copy, then plain-text clipboard. */
export async function shareWeatherCard(node: HTMLElement, summaryText: string, filename: string): Promise<"shared" | "image-copied" | "text-copied"> {
  const blob = await nodeToPngBlob(node);
  const file = new File([blob], filename, { type: "image/png" });

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: "WeatherSphere AI", text: summaryText });
    return "shared";
  }

  if (navigator.clipboard && "write" in navigator.clipboard) {
    try {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      return "image-copied";
    } catch {
      /* fall through to text clipboard */
    }
  }

  await navigator.clipboard.writeText(summaryText);
  return "text-copied";
}
