import { View, Text, StyleSheet, Image, FlatList, Pressable, Animated, TouchableOpacity } from 'react-native';
import { useAuth } from '@/context/AuthContext'
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Link } from 'expo-router';

export default function Home() {
  const { user, shift, logout, fetchShift } = useAuth();
  const router = useRouter();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownAnimation = useRef(new Animated.Value(0)).current;
  const [tasks, setTasks] = useState([
    { id: '1', text: 'Makineyi temizle', completed: false },
    { id: '2', text: 'Kahve stoklarını kontrol et', completed: false },
    { id: '3', text: 'Siparişleri hazırla', completed: false },
    { id: '4', text: 'Müşteri siparişlerini kontrol et', completed: false },
    { id: '5', text: 'Kapanış temizliğini yap', completed: false },
  ]);

  const toggleDropdown = () => {
    const toValue = isDropdownVisible ? 0 : 1;
    setIsDropdownVisible(!isDropdownVisible);
    Animated.spring(dropdownAnimation, {
      toValue,
      useNativeDriver: true,
      tension: 40,
      friction: 8,
    }).start();
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleFetchShift = async () => {
    if (!user?.id) return; // Eğer user veya id yoksa fonksiyonu çalıştırma.
    await fetchShift(user.id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Ana Sayfa</Text>
        <View>
          <Pressable onPress={toggleDropdown}>
            <Image source={{ uri: user?.avatar_url }} style={styles.avatar} />
          </Pressable>

          {isDropdownVisible && (
            <Animated.View
              style={[
                styles.dropdown,
                {
                  opacity: dropdownAnimation,
                  transform: [
                    {
                      translateY: dropdownAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Link
                href={'/(tabs)/profile'}
                style={styles.dropdownItem}
                onPress={() => {
                  toggleDropdown();
                }}
              >
                <View style={styles.iconTextContainer}>
                  <Ionicons name="person-outline" size={20} color="#fff" />
                  <Text style={styles.dropdownText}>Profil</Text>
                </View>
              </Link>


              <Link
                href={'/(tabs)/(pages)/home'}
                style={styles.dropdownItem}
                onPress={() => {
                  toggleDropdown();
                }}
              >
                <View style={styles.iconTextContainer}>
                  <Ionicons name="settings-outline" size={20} color="#fff" />
                  <Text style={styles.dropdownText}>Ayarlar</Text>
                </View>
              </Link>

              <Link
                href={'/(tabs)/signIn'}
                style={styles.dropdownItem}
                onPress={() => {
                  toggleDropdown();
                  logout();
                }}
              >
                <View style={styles.iconTextContainer}>
                  <Ionicons name="log-out-outline" size={20} color="#fff" />
                  <Text style={styles.dropdownText}>Çıkış Yap</Text>
                </View>
              </Link>
            </Animated.View>
          )}
        </View>
      </View>



      <View style={styles.section}>
        <View style={styles.shiftHeader}>
          <Text style={styles.sectionTitle}>Haftalık Vardiya Programı</Text>
          <TouchableOpacity onPress={handleFetchShift}>
            <Ionicons name="reload-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        {shift?.map((item, key) => (
          <View key={key} style={styles.shiftContainer}>
            <Text style={styles.shiftText}>{item.day}:</Text>
            <Text style={styles.shiftText}>{item.shift}</Text>
          </View>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Günlük Görevler</Text>
        <FlatList
          data={tasks}
          renderItem={({ item }) => (
            <Pressable
              style={styles.taskItem}
              onPress={() => toggleTask(item.id)}
            >
              <Ionicons
                name={item.completed ? "checkbox" : "square-outline"}
                size={24}
                color="#fff"
              />
              <Text style={[
                styles.taskText,
                item.completed && styles.completedTask
              ]}>
                {item.text}
              </Text>
            </Pressable>
          )}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 15,
  },
  section: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  shiftText: {
    fontSize: 18,
    color: '#fff',
  },
  shiftHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  shiftContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdown: {
    position: 'absolute',
    zIndex: 1000,
    top: 65,
    right: 0,
    backgroundColor: '#2e2e2e',
    borderRadius: 12,
    padding: 8,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    padding: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // İçeriği tamamen ortalar
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Dikey ortalama
    gap: 8, // İkon ve metin arasına boşluk koyar
  },
  dropdownText: {
    color: '#fff',
    fontSize: 16,
  },
});
