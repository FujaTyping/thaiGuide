import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import ICONTAT from "@/assets/tat.webp";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function Footer() {
  const t = useTranslations("FooterBar");
  return (
    <>
      <main className="bg-primary py-3 border-t-2 text-white">
        <div className="max-w-7xl mx-auto px-3 py-2 flex flex-col md:flex-row place-content-between gap-6 md:gap-0 items-start text-white">
          <div className="flex flex-col items-center md:items-end gap-1 w-full md:w-fit">
            <h2 className="font-semibold text-lg">{t("alli")}</h2>
            <div className="flex gap-3 items-center justify-center w-full">
              <Tooltip>
                <TooltipTrigger>
                  <Link href={"https://www.tat.or.th/"}>
                    <img
                      src={ICONTAT.src}
                      alt="Logo"
                      className="w-14 h-14 object-cover"
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("parther.tat")}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="grid grid-cols-2 md:flex md:flex-row items-start gap-5 w-full md:w-fit">
            <div className="flex flex-col items-center md:items-end gap-1 w-full md:w-fit">
              <h2 className="font-semibold text-lg">{t('usefull')}</h2>
              <Link href={"/sitemap"}>{t('sitemap')}</Link>
            </div>
            <div className="flex flex-col items-center md:items-end gap-1 w-full md:w-fit">
              <h2 className="font-semibold text-lg">{t("DOCTitle")}</h2>
              <Link href={"/terms"}>{t("terms")}</Link>
              <Link href={"/privacy"}>{t("pp")}</Link>
            </div>
            <div className="flex flex-col items-center md:items-end gap-1 w-full md:w-fit">
              <h2 className="font-semibold text-lg">{t("CUSTitle")}</h2>
              <Link href={"/feedback"}>{t("feedback")}</Link>
              <Link href={"mailto:contact@thaiguide.in.th"}>{t("mail")}</Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-3 mt-4">
          <div className="bg-white w-full h-0.5 rounded-xl"></div>
          <p className="text-center mt-3">{t("title")}</p>
        </div>
      </main>
    </>
  );
}

export default Footer;
