/**
 * 函数节流：适用于按钮点击、滚动事件等场景
 */
import type { RegionItem } from '@/types/region'
export function throttle<T extends (...args: RegionItem[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let last = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - last >= delay) {
      last = now
      fn(...args)
    }
  }
}
