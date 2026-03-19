import { UsersIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

export function PortalDecorations({
  side,
  title,
  description,
}: {
  side: "left" | "right";
  title: string;
  description: string;
}) {
  const align =
    side === "left" ? "items-start text-left" : "items-end text-right";

  return (
    <>
      <div
        className={twMerge(
          "absolute hidden md:flex",
          side === "left" ? "left-13" : "right-13",
          align
        )}
      >
        <span className="font-geist text-2xl font-medium text-ne butral-800">
          {title}
        </span>
      </div>

      <div
        className={twMerge(
          "absolute flex left-12 gap-10 w-full",
          side === "left" ? "-bottom-10 " : "-bottom-6 "
        )}
      >
        <div className="flex w-fit h-fit items-center p-2 gap-2 rounded-full border px-3 py-1 text-sm font-medium text-green-600 border-green-200 bg-green-50">
          <UsersIcon className="size-4" />
          <span>Aberto ao Público</span>
        </div>

        <div className="bg-neutral-50 leading-4 tracking-[0.426px] border border-neutral-400 text-center rounded-sm font-geist max-w-[322px] w-full px-5 py-4 flex items-center justify-center">
          {description}
        </div>
      </div>
    </>
  );
}
