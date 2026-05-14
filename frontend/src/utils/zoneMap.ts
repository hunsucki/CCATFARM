/**
 * 맵 좌표 기반 Zone 판별
 * 로봇의 /amcl_pose 위치(x, y)를 받아 어느 Zone에 있는지 반환
 *
 * Zone 영역은 실제 SLAM 맵 좌표에 맞춰 조정 필요
 * 현재는 예시 좌표 범위 (단위: meter)
 */

export interface ZoneBounds {
  name: string
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  color: string
}

// 실제 스마트팜 맵 좌표에 맞게 수정하세요
export const ZONES: ZoneBounds[] = [
  { name: 'Zone A', xMin: 0,   xMax: 3,   yMin: 0,   yMax: 4,   color: '#22c55e' },
  { name: 'Zone B', xMin: 3,   xMax: 6,   yMin: 0,   yMax: 4,   color: '#3b82f6' },
  { name: 'Zone C', xMin: 6,   xMax: 9,   yMin: 0,   yMax: 4,   color: '#f59e0b' },
  { name: 'Zone D', xMin: 0,   xMax: 4.5, yMin: 4,   yMax: 8,   color: '#8b5cf6' },
  { name: 'Zone E', xMin: 4.5, xMax: 9,   yMin: 4,   yMax: 8,   color: '#ef4444' },
]

export function getZoneFromPose(x: number, y: number): ZoneBounds | null {
  for (const zone of ZONES) {
    if (x >= zone.xMin && x < zone.xMax && y >= zone.yMin && y < zone.yMax) {
      return zone
    }
  }
  return null // 맵 밖이거나 스테이션 등
}

export function getZoneName(x: number, y: number): string {
  const zone = getZoneFromPose(x, y)
  return zone ? zone.name : 'Unknown'
}
