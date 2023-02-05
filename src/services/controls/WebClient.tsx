let baseURL: string = "https://www.microsoft.com/en-us/api/controls/contentinclude/html";

export const WebClient = {
  post(params: { name: string, value: string }[]): Promise<string> {
    return fetch(baseURL + (params.length > 0 ? "?" +
      params.map(param => param.name + "=" + param.value).join("&") : ""),
      { method: "POST" })
      .then(res => res.text());
  }
}