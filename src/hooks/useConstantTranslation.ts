import { getConstantTranslation } from "@/utils/data";
import { useLocale } from "next-intl";
import { useMemo } from "react";

const useConstantTranslation = () => {
  const locale = useLocale();
  const translations = useMemo(() => getConstantTranslation(locale), [locale]);

  return translations;
};

export default useConstantTranslation;
