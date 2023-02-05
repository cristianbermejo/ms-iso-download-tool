export const ControlsService = {
  getLanguages(sessionId: string, productEditionId: string): Promise<{ key: string, text: string }[]> {
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
          let title = div.querySelector("#errorModalTitle")?.textContent;
          let message = div.querySelector("#errorModalMessage")?.innerHTML;

          throw Object.assign(new Error(message), {
            title: title,
            message: message,
            hasError: true
          });
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
  getDownloadLinks(sessionId: string, skuId: string, skuLanguage: string): Promise<{ title: string, links: { text: string, url: string }[], expires: number }> {
    let storedValue = JSON.parse(localStorage.getItem(`${skuId}-${skuLanguage}`) || "{}");
    if (storedValue && storedValue.expires && storedValue.expires > Date.now()) {
      return new Promise(resolve => resolve(storedValue));
    } else {
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
  }
};