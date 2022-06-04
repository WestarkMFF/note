/**
 * 封装 hasOwnProperty 函数
 * @param obj
 * @param key
 * @returns boolean
 */
export function hasOwn(obj: Record<string, any>, key: any): boolean {
  if (typeof obj != "object" || obj == null) return false

  return Object.prototype.hasOwnProperty.call(obj, key)
}

export function isArr(arr: any) {
  try {
    return Array.isArray(arr)
  } catch (e) {
    console.warn(`parse arr ${arr} wrong: ${e}`)
    return false
  }
}
