import { LocaleContext } from "@/context";
import { useContext } from "react";

export const useLocale = () => useContext(LocaleContext);
