export const useImagePath = () => {
  const getImagePath = (fileName: string) => {
    return new URL(`../assets/images/${fileName}`, import.meta.url).href
  }
  return { getImagePath }
}
