import { useRef, useEffect, useState, useCallback } from 'react'
import { useRos } from '../hooks/useRos'

declare const ROSLIB: typeof import('roslib')

interface MapMeta {
  width: number
  height: number
  resolution: number
  origin: { x: number; y: number }
}

interface RosMapProps {
  robotPose?: { x: number; y: number } | null
}

// 색상 팔레트 — 깔끔한 느낌
const COLOR_FREE = [255, 255, 255]       // 흰색 (이동 가능)
const COLOR_OCCUPIED = [30, 41, 59]      // 진한 남색 (벽/장애물)
const COLOR_UNKNOWN = [226, 232, 240]    // 연한 회색 (미탐색)

export default function RosMap({ robotPose }: RosMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mapDataRef = useRef<ImageData | null>(null)
  const { ros, status } = useRos()
  const [mapMeta, setMapMeta] = useState<MapMeta | null>(null)
  const [connected, setConnected] = useState(false)

  const drawRobot = useCallback((ctx: CanvasRenderingContext2D, pose: { x: number; y: number }, meta: MapMeta) => {
    const px = (pose.x - meta.origin.x) / meta.resolution
    const py = meta.height - (pose.y - meta.origin.y) / meta.resolution

    // 외부 글로우
    ctx.beginPath()
    ctx.arc(px, py, 10, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(59, 91, 219, 0.2)'
    ctx.fill()

    // 중간 링
    ctx.beginPath()
    ctx.arc(px, py, 6, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(59, 91, 219, 0.4)'
    ctx.fill()

    // 코어 점
    ctx.beginPath()
    ctx.arc(px, py, 4, 0, Math.PI * 2)
    ctx.fillStyle = '#3b5bdb'
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 1.5
    ctx.stroke()
  }, [])

  useEffect(() => {
    if (!ros || status !== 'connected') {
      setConnected(false)
      return
    }
    setConnected(true)

    const mapTopic = new ROSLIB.Topic({
      ros,
      name: '/map',
      messageType: 'nav_msgs/msg/OccupancyGrid',
    })

    mapTopic.subscribe((message: any) => {
      const { info, data } = message
      const width: number = info.width
      const height: number = info.height
      const resolution: number = info.resolution
      const origin = { x: info.origin.position.x, y: info.origin.position.y }

      setMapMeta({ width, height, resolution, origin })

      const canvas = canvasRef.current
      if (!canvas) return

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      const imgData = ctx.createImageData(width, height)

      for (let i = 0; i < data.length; i++) {
        const val = data[i]
        const row = height - 1 - Math.floor(i / width)
        const col = i % width
        const idx = (row * width + col) * 4

        let r: number, g: number, b: number

        if (val === -1) {
          [r, g, b] = COLOR_UNKNOWN
        } else if (val === 0) {
          [r, g, b] = COLOR_FREE
        } else {
          // 장애물: 값이 클수록 진하게
          const t = val / 100
          r = Math.round(COLOR_FREE[0] + (COLOR_OCCUPIED[0] - COLOR_FREE[0]) * t)
          g = Math.round(COLOR_FREE[1] + (COLOR_OCCUPIED[1] - COLOR_FREE[1]) * t)
          b = Math.round(COLOR_FREE[2] + (COLOR_OCCUPIED[2] - COLOR_FREE[2]) * t)
        }

        imgData.data[idx] = r
        imgData.data[idx + 1] = g
        imgData.data[idx + 2] = b
        imgData.data[idx + 3] = 255
      }

      ctx.putImageData(imgData, 0, 0)
      mapDataRef.current = imgData

      // 로봇 위치 그리기
      if (robotPose) {
        drawRobot(ctx, robotPose, { width, height, resolution, origin })
      }
    })

    return () => mapTopic.unsubscribe()
  }, [ros, status, drawRobot])

  // 로봇 위치 업데이트 시 맵 위에 다시 그리기
  useEffect(() => {
    if (!robotPose || !mapMeta || !canvasRef.current || !mapDataRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!
    // 맵 다시 그리고 로봇 표시
    ctx.putImageData(mapDataRef.current, 0, 0)
    drawRobot(ctx, robotPose, mapMeta)
  }, [robotPose, mapMeta, drawRobot])

  return (
    <div className="ros-map-container">
      {!connected && (
        <div className="ros-map-placeholder">
          <div className="ros-map-icon">🗺️</div>
          <p>ROS 맵 대기 중</p>
          <p className="ros-map-hint">rosbridge 연결 후 /map 토픽 수신 시 표시됩니다</p>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="ros-map-canvas"
        style={{ display: connected ? 'block' : 'none' }}
      />
      {connected && robotPose && (
        <div className="ros-map-coords">
          📍 X: {robotPose.x.toFixed(2)} | Y: {robotPose.y.toFixed(2)}
        </div>
      )}
    </div>
  )
}
