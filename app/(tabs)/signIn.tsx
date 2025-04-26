import { View, Text, ScrollView, Image, StyleSheet } from 'react-native'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { router } from 'expo-router'
import AuthInput from '@/components/AuthInput'
import AuthButton from '@/components/AuthButton'
import NotificationContainer from '@/components/NotificationContainer'
import { ubgida_light} from '@/assets'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const [notification, setNotification] = useState({ visible: false, message: '' })

  const handleSignIn = async () => {
    if (!email || !password) {
      setNotification({ visible: true, message: 'Lütfen tüm alanları doldurun' })
      return
    }

    if (!email.includes('@')) {
      setNotification({ visible: true, message: 'Lütfen geçerli bir email adresi girin' })
      return
    }

    setIsLoading(true)
    try {
      await login(email, password)
      router.replace('/(tabs)/(pages)/home')
    } catch (error: any) {
      setNotification({ visible: true, message: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      {/* Notification */}
      <NotificationContainer
        visible={notification.visible}
        message={notification.message}
        onHide={() => setNotification({ visible: false, message: '' })}
      />

      {/* ScrollView */}
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{}}>
          {/* Image */}
          <Image 
            source={ubgida_light}
            resizeMode="contain"    
            style={styles.image}
          />
          <Text style={styles.headerText}>Hoşgeldiniz</Text>
          {/* Input Container */}
          <View style={styles.inputContainer}>
            <AuthInput
              label="E-posta"
              value={email}
              onChangeText={setEmail}
              placeholder="E-posta adresiniz"
              icon="mail-outline"
              keyboardType="email-address"
              editable={!isLoading}
            />
            <AuthInput
              label="Şifre"
              value={password}
              onChangeText={setPassword}
              placeholder="Şifreniz"
              icon="lock-closed-outline"
              secureTextEntry
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              editable={!isLoading}
            />
            <AuthButton
              onPress={handleSignIn}
              isLoading={isLoading}
              title="Giriş Yap"
            />
          </View>
        </View>
      </ScrollView>

      {/* Copyright */}
      <View style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
        <Text style={{color: 'white', textAlign: 'center', fontSize: 12}}>
          © 2024 Ub Gıda - Tüm hakları saklıdır
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  headerText: {
    color: 'white',
    width: '80%',
    marginBottom: 20,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
  inputContainer: {
    flex: 1,
    paddingVertical: 10,
    marginBottom: 10,
    width: '80%',
    alignSelf: 'center',
  },
  button: {
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  }
});