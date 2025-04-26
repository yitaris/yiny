import React, { useState, useEffect } from "react";
import { useAuth } from '@/context/AuthContext';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ScrollView, TextInput, useWindowDimensions, } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Product() {
    const { user, product, fetchProduct, setInventory, } = useAuth();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [date, setDate] = useState("");
    const [quantity, setQuantity] = useState(0);

    const { width } = useWindowDimensions();
    const numColumns = width > 1200 ? 4 : width > 800 ? 3 : 2; // 1200px üzeri 4 ürün, 800px üzeri 3 ürün, altında 2 ürün
    const itemWidth = (width - 40 - (numColumns - 1) * 10) / numColumns; // Padding ve margin hesaplanarak width belirlenir

    const handleSetInventory = async (
        branchId,
        productName,
        productImageUrl,
        productQuantity,
        productExpiryDate,
    ) => {
        if (branchId && productName && productImageUrl && productQuantity && productExpiryDate) {
            const formattedInventory = {
                branch_id: branchId,
                name: productName,
                image_url: productImageUrl,
                quantity: Number(productQuantity), // integer olmalı
                expiry_date: new Date(productExpiryDate).toISOString().split("T")[0] // YYYY-MM-DD formatı
            };
            await setInventory(formattedInventory);
            setModalVisible(false);
        }
    }

    const handleFetchProduct = async () => {
        try {
            if (product <= 0) {
                await fetchProduct();
            }
        } catch (error) {
            console.error("Ürünleri getirirken hata oluştu:", error);
        }
    };

    const handleOpenModal = (item) => {
        setSelectedProduct(item);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedProduct(null);
    };

    const filteredProducts = product?.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.main}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Ürünler</Text>
                <TouchableOpacity onPress={handleFetchProduct}>
                    <Ionicons name="reload-outline" size={30} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Arama Barı */}
            <TextInput
                style={styles.searchInput}
                placeholder="Ürün Ara..."
                placeholderTextColor="#B0B0B0"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <ScrollView contentContainerStyle={[styles.productList, { justifyContent: numColumns === 2 ? "space-between" : "center" }]}>
                {filteredProducts?.length > 0 ? (
                    filteredProducts.map((item, index) => (
                        <TouchableOpacity key={index} style={[styles.productContainer, { width: itemWidth }]} onPress={() => handleOpenModal(item)}>
                            <Image source={{ uri: item.image_url }} style={styles.productImage} />
                            <Text style={styles.productText}>{item.name}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.emptyText}>Yenileyin</Text>
                )}
            </ScrollView>

            {/* Modal */}
            <Modal visible={modalVisible} animationType="slide" onRequestClose={handleCloseModal}>
                <View style={styles.modalContainer}>
                    {selectedProduct && (
                        <View>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
                                <TouchableOpacity onPress={handleCloseModal}>
                                    <Ionicons name="close-outline" size={35} color="white" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.modalBody}>
                                <Image source={{ uri: selectedProduct.image_url }} style={styles.modalImage} />
                                <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>SKT TARİHİ</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholderTextColor={'white'}
                                        onChangeText={setDate}
                                        value={date}
                                        placeholder="YYYY-MM-DD"
                                        textAlign="center"
                                        cursorColor={'transparent'}
                                    />
                                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>ADET</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholderTextColor={'white'}
                                        onChangeText={setQuantity}
                                        value={quantity}
                                        placeholder="0"
                                        keyboardType="numeric"
                                        textAlign="center"
                                        cursorColor={'transparent'}
                                    />
                                    <TouchableOpacity style={styles.button} onPress={() => handleSetInventory(user?.branch_id, selectedProduct.name, selectedProduct.image_url, quantity, date)}>
                                        <Text style={{ color: '#fff' }}>Kaydet</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                    )}
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    main: { flex: 1, backgroundColor: "#121212", paddingHorizontal: 20, paddingTop: 50 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 30 },
    headerText: { color: "#fff", fontSize: 32, fontWeight: "bold" },
    input: { color: '#fff', borderWidth: 1, borderColor: '#fff', borderRadius: 10, height: 40, width: 150, padding: 10, },
    button: { backgroundColor: 'green', padding: 10, borderRadius: 10, height: 40, width: '100%', alignItems: 'center', marginTop: 10 },
    searchInput: {
        backgroundColor: "#1E1E1E",
        color: "#fff",
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 20,
    },
    productList: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    productContainer: {
        width: "30%",
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    productImage: { width: '100%', height: 150, borderRadius: 8 },
    productText: { color: "#fff", marginTop: 10, fontSize: 16, fontWeight: 'bold', textAlign: "center" },
    emptyText: { color: "#B0B0B0", textAlign: "center", marginTop: 20 },
    modalContainer: { flex: 1, backgroundColor: "#121212", padding: 30 },
    modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    modalTitle: { color: "#fff", fontSize: 28, fontWeight: "bold" },
    modalBody: { flexDirection: "row", marginTop: 20, gap: 20 },
    modalImage: { width: 250, height: 250, borderRadius: 10 },
});