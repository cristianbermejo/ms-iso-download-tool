export const WebClient = {
  post(params: { name: string, value: string }[]): Promise<string> {
    return fetch(process.env.REACT_APP_CONTROLS_BASE_URL + (params.length > 0 ? "?" +
      params.map(param => param.name + "=" + param.value).join("&") : ""),
      { method: "POST" })
      .then(res => res.text());
  }
}