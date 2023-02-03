export const ControlsService = {
  getProductEditionLanguages(sessionId: string, productEditionId: string): Promise<{ key: string, text: string }[]> {
    return fetch("https://www.microsoft.com/en-us/api/controls/contentinclude/html" +
      "?pageId=a8f8f489-4c7f-463a-9ca6-5cff94d8d041" +
      "&host=www.microsoft.com" +
      "&segments=software-download%2cwindows11" +
      "&query=" +
      "&action=GetSkuInformationByProductEdition" +
      `&sessionId=${sessionId}` +
      `&productEditionId=${productEditionId}` +
      "&sdVersion=2", { method: "POST" })
      .then(res => res.text())
      .then(result => {
        let div = document.createElement("div");
        div.innerHTML = result;

        if (div.querySelector("#errorModalTitle")) {
          throw (div.querySelector("#errorModalMessage")?.textContent || "Unknown error");
        }

        let options = div.querySelectorAll("option");
        let productEditionLanguages: { key: string, text: string }[] = [];

        for (let i = 0; i < options.length; i++) {
          productEditionLanguages.push({
            key: options[i].value,
            text: options[i].text
          });
        }

        return productEditionLanguages;
      });
  },
  getDownloadLinks(sessionId: string, skuId: string, skuLanguage: string): Promise<{ title: string, links: { text: string, url: string }[] }> {
    return fetch("https://www.microsoft.com/en-us/api/controls/contentinclude/html" +
      "?pageId=6e2a1789-ef16-4f27-a296-74ef7ef5d96b" +
      "&host=www.microsoft.com" +
      "&segments=software-download%2cwindows11" +
      "&query=" +
      "&action=GetProductDownloadLinksBySku" +
      `&sessionId=${sessionId}` +
      `&skuId=${skuId}` +
      `&language=${skuLanguage}` +
      "&sdVersion=2", { method: "POST" })
      .then(res => res.text())
      .then(result => {
        let div = document.createElement("div");
        div.innerHTML = result;

        if (div.querySelector("#errorModalTitle")) {
          throw (div.querySelector("#errorModalMessage")?.textContent || "Unknown error");
        }

        let headers = div.querySelectorAll("h2");
        let buttons = div.querySelectorAll("a.button");
        let downloadLinks: { title: string, links: { text: string, url: string }[] } = { title: headers[headers.length - 1].textContent!, links: [] };

        for (let i = 0; i < buttons.length; i++) {
          downloadLinks.links.push({ text: buttons[i]!.textContent!, url: buttons[i].getAttribute("href")! })
        }

        return downloadLinks;
      });
  }
};