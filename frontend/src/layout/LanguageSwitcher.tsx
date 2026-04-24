import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// ✅ Bayroq rasmlarini `public/flags/uz.svg` va `public/flags/ru.svg` qilib qo‘y
const languages: { code: Language; name: string; flag: string }[] = [
  { code: "uz", name: "O'zbekcha", flag: "https://s.yimg.com/fz/api/res/1.2/hztP6TEXagHdqG31Uhc4WQ--~C/YXBwaWQ9c3JjaGRkO2ZpPWZpdDtoPTI2MDtxPTgwO3c9MzMy/https://s.yimg.com/zb/imgv1/f7230cd6-17e0-3eeb-baea-8da3e2544510/t_500x300" },
  { code: "ru", name: "Русский", flag: "https://s.yimg.com/fz/api/res/1.2/i2OA12YFYBZzry.X..1_uQ--~C/YXBwaWQ9c3JjaGRkO2ZpPWZpdDtoPTI2MDtxPTgwO3c9MzMy/https://s.yimg.com/zb/imgv1/4a3bde1e-d8ba-3e5b-8b6e-200b39566e6b/t_500x300" },
];

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const currentLanguage = languages.find((lang) => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          {currentLanguage && (
            <img
              src={currentLanguage.flag}
              alt={currentLanguage.name}
              className="h-4 w-6 rounded-[4px] object-cover"
            />
          )}
        </Button>
      </DropdownMenuTrigger>

      <TooltipProvider>
        {currentLanguage && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="sr-only">{currentLanguage.name}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{currentLanguage.name}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>

      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`cursor-pointer ${language === lang.code ? "bg-primary/10" : ""}`}
          >
            <img
              src={lang.flag}
              alt={lang.name}
              className="h-4 w-6 rounded-[4px] mr-2 object-cover"
            />
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>

  );
};
