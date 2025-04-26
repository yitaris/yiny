import { TouchableOpacity, Text, ActivityIndicator } from 'react-native'

type Props = {
  onPress: () => void
  isLoading: boolean
  title: string
}

export default function AuthButton({ onPress, isLoading, title }: Props) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: '#FDFCFA',
        width: 150,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignSelf: 'center',
      }}
      onPress={onPress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#121212" />
      ) : (
        <Text style={{
          color: '#121212',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 20,
        }}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  )
} 