// Central registry for files in the root /images folder.
import type { StaticImageData } from "next/image";
import type { CoverKey } from "@/types";

import logoMark from "@/images/logo-mark.svg";
import violet from "@/images/covers/violet.svg";
import teal from "@/images/covers/teal.svg";
import amber from "@/images/covers/amber.svg";
import night from "@/images/covers/night.svg";
import rose from "@/images/covers/rose.svg";
import slate from "@/images/covers/slate.svg";

export const images = { logoMark };

export const covers: Record<CoverKey, StaticImageData> = {
  violet,
  teal,
  amber,
  night,
  rose,
  slate,
};

export const coverOptions = Object.keys(covers) as CoverKey[];
