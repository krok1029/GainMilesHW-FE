import { whatsappUrl } from "./contactLinks";

describe("WhatsApp links", () => {
  it.each(["en", "zh-HK"] as const)(
    "should target GUM and encode the localized message for %s",
    (locale) => {
      const target = whatsappUrl;
      const url = new URL(target(locale));
      expect(url.origin + url.pathname).toBe("https://wa.me/85260300900");

      expect(url.searchParams.get("text")).toBe(
        locale === "en"
          ? "Hello, I would like to learn more about MPF information.\nI am contacting you via the GUM App."
          : "你好，我想了解更多有關強積金嘅資訊\n我是透過 GUM App 聯絡你們。",
      );
    },
  );
});
