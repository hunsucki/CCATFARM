import { useEffect, useState } from 'react'
import { useRos } from './useRos'

declare const ROSLIB: typeof import('roslib')

/**
 * /camera/camera/color/image_raw/compressed 구독
 * base64 인코딩된 JPEG 이미지를 반환
 */
export function useCamera(): string | null {
  const { ros, status } = useRos()
  const [imageSrc, setImageSrc] = useState<string | null>(null)

  useEffect(() => {
    if (!ros || status !== 'connected') return

    const topic = new ROSLIB.Topic({
      ros,
      name: '/camera/camera/color/image_raw/compressed',
      messageType: 'sensor_msgs/msg/CompressedImage',
    })

    topic.subscribe((msg: any) => {
      // rosbridge는 data를 base64 문자열로 전달
      if (msg.data) {
        setImageSrc(`data:image/jpeg;base64,${msg.data}`)
      }
    })

    return () => topic.unsubscribe()
  }, [ros, status])

  return imageSrc
}
