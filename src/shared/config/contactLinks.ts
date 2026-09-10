import { Locale } from "../i18n/I18nProvider";
import { en, zh } from "../i18n/messages";

export const BOOKING_URL = "https://gainmiles.simplybook.asia/v2/";

export const PHONE_URL = "tel:+85228934402";

export const EMAIL_URL = "mailto:memberservice@gumhk.com";

export function whatsappUrl(locale: Locale) {
  const messages = locale === "zh-HK" ? zh : en;

  return `https://wa.me/85260300900?text=${encodeURIComponent(`${messages.whatsappMessage}\n${messages.whatsappSource}`)}`;
}
