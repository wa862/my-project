/**
 * 函数防抖
 * 在触发事件后一段时间内不再触发回调函数（如输入框连续输入）
 */
import type { RegionItem } from '@/types/region'
export function debounce<T extends (...args: RegionItem[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: number | null = null
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = window.setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
