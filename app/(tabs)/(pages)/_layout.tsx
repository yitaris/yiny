import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // İkonlar için
import { Platform } from 'react-native';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Başlık çubuğunu gizle
        tabBarStyle: {
          backgroundColor: '#121212', // Tab Bar arkaplan rengi
          borderTopWidth: 0, // Üst kenarlığı kaldır
          paddingBottom: Platform.OS === 'ios' ? 20 : 0, // iOS için alt boşluk
        },
        tabBarActiveTintColor: '#ffffff', // Aktif sekme rengi
        tabBarInactiveTintColor: '#888888', // Pasif sekme rengi
      }}
    >
      {/* Home Sekmesi */}
      <Tabs.Screen
        name="home" // Ana sayfa için "index" kullanılır
        options={{
          title: 'Home', // Sekme başlığı
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />

      {/* Scan Sekmesi */}
      <Tabs.Screen
        name="scan" // scan.tsx dosyası
        options={{
          title: 'Scan', // Sekme başlığı
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="scan" color={color} size={size} />
          ),
        }}
      />

      {/* Product Sekmesi */}
      <Tabs.Screen
        name="product" // product.tsx dosyası
        options={{
          title: 'Product', // Sekme başlığı
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cube" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}