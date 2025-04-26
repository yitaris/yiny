import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

type Props = {
  label: string
  value: string
  onChangeText: (text: string) => void
  placeholder: string
  icon: keyof typeof Ionicons.glyphMap
  secureTextEntry?: boolean
  showPassword?: boolean
  onTogglePassword?: () => void
  keyboardType?: 'email-address' | 'default'
  editable?: boolean
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
}

export default function AuthInput({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  secureTextEntry,
  showPassword,
  onTogglePassword,
  keyboardType = 'default',
  editable = true,
  autoCapitalize = 'none'
}: Props) {
  return (
    <View style={{ marginBottom: 40 }}>
      <Text 
        style={{
          position: 'absolute',
          top: -10,
          left: 10,
          backgroundColor: '#121212',
          paddingHorizontal: 5,
          zIndex: 10,
          color: 'white',
          fontSize: 16,
          marginBottom: 8,
          fontWeight: '500',
          marginLeft: 4
        }}>
        {label}
      </Text>
      <View 
        style={{
          borderColor: 'rgba(255,255,255,0.5)',
          borderWidth: 1,
          borderRadius: 10,
          padding: 10,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'transparent',
          paddingHorizontal: 16
        }}>
        <TextInput
          style={{
            flex: 1,
            paddingVertical: 16,
            paddingHorizontal: 12,
            color: 'white'
          }}
          placeholder={placeholder}
          placeholderTextColor="#6b7280"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          editable={editable}
          autoCapitalize={autoCapitalize}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={onTogglePassword}>
            <Ionicons 
              name={showPassword ? "eye-off-outline" : "eye-outline"} 
              size={20} 
              color="#9ca3af" 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
} 