export const useQueryParam = () => {
  // クエリパラメータを追加して更新する
  const setQueryParam = (key: string, value: string): void => {
    const url = new URL(window.location.href)
    url.searchParams.set(key, value)
    window.history.pushState({}, '', url)
  }

  const getQueryParam = (key: string) => {
    const params = new URLSearchParams(window.location.search)
    const value = params.get(key)
    return value
  }

  return {
    setQueryParam,
    getQueryParam
  }
}
