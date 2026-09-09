import Image from "next/image";

import favicon from "@/app/favicon.png";
import { cn } from "@/lib/utils";

type AppLogoProps = {
  size?: number;
  className?: string;
  priority?: boolean;
};

export function AppLogo({
  size = 32,
  className,
  priority = false,
}: AppLogoProps) {
  return (
    <Image
      src={favicon}
      alt="Sperraw"
      width={favicon.width}
      height={favicon.height}
      className={cn("h-auto rounded-lg", className)}
      style={{ width: size, height: "auto" }}
      priority={priority}
    />
  );
}
