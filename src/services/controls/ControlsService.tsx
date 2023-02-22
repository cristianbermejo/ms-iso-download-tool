import { WebClient } from "./WebClient";

// Private functions
const findLanguages = (result: string) => {
  let div = document.createElement("div");
  div.innerHTML = result;

  if (div.querySelector("#errorModalTitle")) {
    let title = div.querySelector("#errorModalTitle")?.textContent;
    let message = div.querySelector("#errorModalMessage")?.innerHTML;

    throw Object.assign(new Error(message), {
      title: title,
      message: message,
      hasError: true
    });
  }

  let options = div.querySelectorAll("option");
  let productInfo = div.querySelector("#product-info-content i");
  let languagesData: { info?: string, languages: { value: string, text: string }[] } = { info: productInfo?.textContent || undefined, languages: [] };

  for (let i = 0; i < options.length; i++) {
    languagesData.languages.push({
      value: options[i].value,
      text: options[i].text
    });
  }

  return languagesData;
}

export const ControlsService = {
  getSkuInformationByProductEdition(sessionId: string, productEditionId: string): Promise<{ info?: string, languages: { value
    : string, text: string }[] }> {
    return WebClient.post([
      { name: "pageId", value: "a8f8f489-4c7f-463a-9ca6-5cff94d8d041" },
      { name: "host", value: "www.microsoft.com" },
      { name: "segments", value: "software-download%2cwindows11" },
      { name: "query", value: "" },
      { name: "action", value: "GetSkuInformationByProductEdition" },
      { name: "sessionId", value: sessionId },
      { name: "productEditionId", value: productEditionId },
      { name: "sdVersion", value: "2" }
    ]).then(result => findLanguages(result));
  },
  getDownloadLinks(sessionId: string, skuId: string, skuLanguage: string): Promise<{ title: string, links: { text: string, url: string }[], expires: number }> {
    let storedValue = JSON.parse(localStorage.getItem(`${skuId}-${skuLanguage}`) || "{}");
    if (storedValue && storedValue.expires && storedValue.expires > Date.now()) {
      return new Promise(resolve => resolve(storedValue));
    } else {
      return WebClient.post([
        { name: "pageId", value: "6e2a1789-ef16-4f27-a296-74ef7ef5d96b" },
        { name: "host", value: "www.microsoft.com" },
        { name: "segments", value: "software-download%2cwindows11" },
        { name: "query", value: "" },
        { name: "action", value: "GetProductDownloadLinksBySku" },
        { name: "sessionId", value: sessionId },
        { name: "skuId", value: skuId },
        { name: "language", value: skuLanguage },
        { name: "sdVersion", value: "2" }
      ]).then(result => {
        let div = document.createElement("div");
        div.innerHTML = result;

        if (div.querySelector("#errorModalTitle")) {
          let title = div.querySelector("#errorModalTitle")?.textContent;
          let message = div.querySelector("#errorModalMessage")?.innerHTML;

          throw Object.assign(new Error(message), {
            title: title,
            message: message,
            hasError: true
          });
        }

        let headers = div.querySelectorAll("h2");
        let buttons = div.querySelectorAll("a.button");
        let expirationTime = div.querySelector("#expiration-time");

        let downloadLinks: { title: string, links: { text: string, url: string }[], expires: number } = {
          title: headers[headers.length - 1].textContent!,
          links: [],
          expires: expirationTime ? Date.parse(expirationTime!.textContent!) : Date.now()
        };

        for (let i = 0; i < buttons.length; i++) {
          downloadLinks.links.push({ text: buttons[i]!.textContent!, url: buttons[i].getAttribute("href")! })
        }

        localStorage.setItem(`${skuId}-${skuLanguage}`, JSON.stringify(downloadLinks));

        return downloadLinks;
      }
      );
    }
  },
  GetSkuInformationByKey(sessionId: string, key: string): Promise<{ info?: string, languages: { value: string, text: string }[]}> {
    return WebClient.post([
      { name: "pageId", value: "cd06bda8-ff9c-4a6e-912a-b92a21f42526" },
      { name: "host", value: "www.microsoft.com" },
      { name: "segments", value: "software-download%2cwindows11" },
      { name: "query", value: "" },
      { name: "action", value: "GetSkuInformationByKey" },
      { name: "key", value: key },
      { name: "sessionId", value: sessionId }
    ]).then(result => findLanguages(result));
  }
};