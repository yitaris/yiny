import React, { useState } from 'react';
import { Text, View, StyleSheet, Pressable, Modal, StatusBar, Image } from 'react-native';
import { useCameraPermissions, CameraView } from 'expo-camera';
import { useAuth } from '@/context/AuthContext'

interface Product {
  image_url: string;
  name: string;
  skt_at: string;
  id: string;
}

export default function Scanner() {
  const { user } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [productData, setProductData] = useState<Product | null>(null);
  
  const handleBarcodeScanned = async ({ data }: { data: any }) => {
    try {
      setScannedData(data);
      setModalVisible(true);
    } catch (error) {
      console.error("Ürün bulunamadı:", error);
    }
  };

  const handleAddProduct = async () => {
    setModalVisible(false);
    setScannedData(null);
  }

  const handleRetake = () => {
    setModalVisible(false);
    setScannedData(null);
  };

  return (
    <View style={styles.container}>
      {!isPermissionGranted ? (
        <Pressable onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Lütfen Kamera İzni Veriniz</Text>
        </Pressable>
      ) : (
        <>
          <StatusBar hidden />
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            onBarcodeScanned={scannedData ? undefined : handleBarcodeScanned}
          >
            {/* Barkod Okuma Çerçevesi */}
            <View style={styles.overlay}>
              <View style={styles.topBottomOverlay} />
              <View style={styles.middleContainer}>
                <View style={styles.sideOverlay} />
                <View style={styles.focusBox}>
                  <View style={styles.innerBorder} />
                </View>
                <View style={styles.sideOverlay} />
              </View>
              <View style={styles.topBottomOverlay} />
            </View>
          </CameraView>
        </>
      )}

      {/* Barkod Sonucu Modalı */}
      {scannedData && (
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {productData ? (
                <>
                  <Text style={styles.modalText}>Ürün Bilgileri</Text>
                  <Image 
                    source={{ uri: productData.image_url }} 
                    style={styles.productImage} 
                  />
                  <Text style={styles.productName}>{productData.name}</Text>
                  <Text style={styles.barcodeData}>Barkod: {scannedData}</Text>
                </>
              ) : (
                <Text style={styles.errorText}>Ürün bulunamadı!</Text>
              )}
              <View style={styles.buttonContainer}>
              <Pressable onPress={handleRetake} style={[styles.button, styles.retakeButton]}>
                <Text style={styles.buttonText}>Tekrar Tara</Text>
              </Pressable>
              <Pressable onPress={handleAddProduct} style={[styles.button, styles.addButton]}>
                <Text style={styles.buttonText}>Ürünü Ekle</Text>
              </Pressable>
              </View>
              
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    padding: 12,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
  },
  retakeButton: {
    backgroundColor: '#FF6B6B', // Soft kırmızı
  },
  addButton: {
    backgroundColor: '#4CAF50', // Soft yeşil
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBottomOverlay: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  middleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sideOverlay: {
    flex: 1,
    height: 250,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  focusBox: {
    width: 250,
    height: 250,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerBorder: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  barcodeData: {
    fontSize: 16,
    marginVertical: 10,
    color: 'black',
  },
  productImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 5,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    width: '100%',
  },
});
