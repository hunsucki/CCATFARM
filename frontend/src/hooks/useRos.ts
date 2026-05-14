import { useEffect, useRef, useState, useCallback } from 'react'

// CDN으로 로드된 ROSLIB은 window.ROSLIB으로 접근
// npm 패키지 import 대신 전역 객체 사용
declare const ROSLIB: typeof import('roslib')

export type RosStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

export interface UseRosReturn {
  ros: InstanceType<typeof ROSLIB.Ros> | null
  status: RosStatus
  connect: () => void
  disconnect: () => void
}

const ROS_URL = import.meta.env.VITE_ROS_URL ?? 'ws://192.168.0.141:9090'

export function useRos(): UseRosReturn {
  const rosRef = useRef<InstanceType<typeof ROSLIB.Ros> | null>(null)
  const [status, setStatus] = useState<RosStatus>('disconnected')

  const connect = useCallback(() => {
    if (rosRef.current) {
      rosRef.current.close()
    }

    setStatus('connecting')

    const ros = new ROSLIB.Ros({ url: ROS_URL })
    rosRef.current = ros

    ros.on('connection', () => {
      console.log('[ROS] Connected to', ROS_URL)
      setStatus('connected')
    })

    ros.on('error', (error: unknown) => {
      console.error('[ROS] Connection error:', error)
      setStatus('error')
    })

    ros.on('close', () => {
      console.log('[ROS] Connection closed')
      setStatus('disconnected')
    })
  }, [])

  const disconnect = useCallback(() => {
    rosRef.current?.close()
    rosRef.current = null
    setStatus('disconnected')
  }, [])

  useEffect(() => {
    connect()
    return () => {
      rosRef.current?.close()
      rosRef.current = null
    }
  }, [connect])

  return { ros: rosRef.current, status, connect, disconnect }
}
