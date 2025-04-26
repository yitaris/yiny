import React, { useEffect, useRef } from 'react'
import { View, Text, Animated, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface NotificationProps {
  visible: boolean
  message: string
  onHide: () => void
}

export default function NotificationContainer({ visible, message, onHide }: NotificationProps) {
  const slideAnim = useRef(new Animated.Value(-100)).current

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start(() => onHide())
    }
  }, [visible])

  if (!visible) return null

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.notificationView}>
        <Ionicons name="warning" size={24} color="white" />
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  notificationView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  message: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '500',
  },
}) 