// src/api/regionBaidu.ts
import type { RegionItem } from '@/types/region'

// 声明百度地图全局对象（如你未安装 @types/bmapgl）
declare const BMapGL: {
  DistrictSearch: new (options: {
    onSearchComplete: (results: {
      getDistrictList: () => Array<{ districtList: Array<{ name: string; code: string }> }>
    }) => void
  }) => {
    search: (keyword: string) => void
  }
}

/**
 * 获取省市区数据（需确保页面已加载百度地图 WebGL API）
 */
export const getBaiduDistrict = async (
  level: 'province' | 'city' | 'district',
  keyword: string,
): Promise<RegionItem[]> => {
  return new Promise((resolve) => {
    const district = new BMapGL.DistrictSearch({
      onSearchComplete: (results) => {
        const list = results.getDistrictList?.()[0]?.districtList || []
        const mapped: RegionItem[] = list.map((item) => ({
          name: item.name,
          code: item.code,
        }))
        resolve(mapped)
      },
    })
    district.search(keyword)
  })
}
