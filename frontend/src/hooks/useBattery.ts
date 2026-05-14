import { useEffect, useState } from 'react'
import { useRos } from './useRos'

declare const ROSLIB: typeof import('roslib')

export interface BatteryData {
  percentage: number   // 0~100
  voltage: number      // V
  current: number      // A
  isCharging: boolean
}

export function useBattery(): BatteryData | null {
  const { ros, status } = useRos()
  const [battery, setBattery] = useState<BatteryData | null>(null)

  useEffect(() => {
    if (!ros || status !== 'connected') return

    const topic = new ROSLIB.Topic({
      ros,
      name: '/battery_state',
      messageType: 'sensor_msgs/msg/BatteryState',
    })

    topic.subscribe((msg: any) => {
      setBattery({
        percentage: Math.round((msg.percentage ?? 0) * 100),
        voltage: msg.voltage ?? 0,
        current: msg.current ?? 0,
        // power_supply_status: 1=charging
        isCharging: msg.power_supply_status === 1,
      })
    })

    return () => topic.unsubscribe()
  }, [ros, status])

  return battery
}
