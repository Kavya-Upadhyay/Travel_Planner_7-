import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import apiClient from '../api/apiClient';
import { logout } from '../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SANS_FONT = Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif';

const THEME = {
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  glassBg: 'rgba(255, 255, 255, 0.1)',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
};

export default function DashboardScreen({ navigation }: any) {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await apiClient.get('/trips');
      setTrips(response.data);
    } catch (error) {
      console.log('Error fetching trips', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    dispatch(logout());
  };

  const renderTrip = ({ item }: { item: any }) => (
    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('TripDetails', { tripId: item.id })}>
      <LinearGradient colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']} style={styles.tripCard}>
        <Text style={styles.tripTitle}>{item.title}</Text>
        <Text style={styles.tripDestination}>{item.destination}</Text>
        <View style={styles.tripFooter}>
          <Text style={styles.tripDates}>{item.startDate} to {item.endDate}</Text>
          <Text style={styles.arrow}>→</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#141E30', '#243B55', '#0f2027']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Journeys</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#00c6ff" style={{ marginTop: 50 }} />
      ) : trips.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>You haven't planned any trips yet.</Text>
        </View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          renderItem={renderTrip}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        />
      )}

      <TouchableOpacity activeOpacity={0.8} style={styles.fabWrap}>
        <LinearGradient colors={['#f12711', '#f5af19']} style={styles.fab} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
          <Text style={styles.fabText}>+</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60 },
  title: { fontSize: 36, fontWeight: '900', color: THEME.textPrimary, letterSpacing: -1, fontFamily: SANS_FONT },
  logoutButton: { backgroundColor: 'rgba(255,0,0,0.2)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,0,0,0.3)' },
  logoutText: { color: '#ff4d4d', fontWeight: 'bold', fontFamily: SANS_FONT },
  tripCard: { padding: 25, borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: THEME.glassBorder, shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 10 }, shadowRadius: 15, elevation: 5 },
  tripTitle: { fontSize: 24, fontWeight: '800', color: THEME.textPrimary, marginBottom: 5, fontFamily: SANS_FONT },
  tripDestination: { fontSize: 16, color: THEME.textSecondary, marginBottom: 20, fontFamily: SANS_FONT },
  tripFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tripDates: { fontSize: 14, color: '#00c6ff', fontWeight: '700', fontFamily: SANS_FONT },
  arrow: { color: '#00c6ff', fontSize: 20, fontWeight: 'bold' },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { fontSize: 18, color: THEME.textSecondary, fontFamily: SANS_FONT },
  fabWrap: { position: 'absolute', bottom: 40, right: 30, shadowColor: '#f12711', shadowOpacity: 0.5, shadowOffset: { width: 0, height: 10 }, shadowRadius: 20, elevation: 10 },
  fab: { width: 65, height: 65, borderRadius: 32.5, justifyContent: 'center', alignItems: 'center' },
  fabText: { color: THEME.textPrimary, fontSize: 35, fontWeight: '300', marginTop: -2 },
});
