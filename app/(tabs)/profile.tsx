import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
  const { user, session } = useAuth();

  return (
    <View style={styles.container}>
      {/* Profil Fotoğrafı */}
      <View style={styles.profileHeader}>
        <Image 
          source={{ uri: user?.avatar_url || '' }} 
          style={styles.avatar} 
        />
        <Text style={styles.name}>{user?.name || "Barista"}</Text>
        <Text style={styles.role}>☕ {user?.title}</Text>
      </View>

      {/* Kullanıcı Bilgileri */}
      {user && session && (
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color="#bbb" />
            <Text style={styles.infoText}>{session?.user?.email || "Görünen bir E-posta bulamadık"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#bbb" />
            <Text style={styles.infoText}>{session?.user?.created_at}</Text>
          </View>
        </View>
      )}

      {/* Butonlar */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editText}>Profili Düzenle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#ffcc00',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  role: {
    fontSize: 16,
    color: '#ffcc00',
    fontStyle: 'italic',
  },
  infoContainer: {
    marginTop: 30,
    width: '100%',
    paddingHorizontal: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    color: '#bbb',
    fontSize: 16,
    marginLeft: 10,
  },
  buttonContainer: {
    marginTop: 40,
    width: '100%',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#ffcc00',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center',
  },
  editText: {
    color: '#1E1E1E',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});