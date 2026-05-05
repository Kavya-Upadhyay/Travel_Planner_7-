import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import apiClient from '../api/apiClient';

const SANS_FONT = Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif';

const THEME = {
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  glassBg: 'rgba(255, 255, 255, 0.1)',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
};

export default function ItineraryScreen({ route, navigation }: any) {
  const { tripId } = route.params;
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');

  useEffect(() => {
    fetchItinerary();
  }, []);

  const fetchItinerary = async () => {
    try {
      const response = await apiClient.get(`/itinerary/trip/${tripId}`);
      setActivities(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async () => {
    try {
      await apiClient.post(`/itinerary/trip/${tripId}`, {
        title, description, startTime, endTime: startTime
      });
      fetchItinerary();
      setTitle(''); setDescription(''); setStartTime('');
    } catch (error) {
      console.log(error);
    }
  };

  const renderActivity = ({ item }: { item: any }) => (
    <LinearGradient colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.02)']} style={styles.card}>
      <Text style={styles.timeLabel}>{new Date(item.startTime).toLocaleString()}</Text>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDesc}>{item.description}</Text>
    </LinearGradient>
  );

  return (
    <LinearGradient colors={['#141E30', '#243B55', '#0f2027']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonWrap}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Itinerary</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.formContainer}>
        <TextInput style={styles.input} placeholder="Activity Title" placeholderTextColor={THEME.textSecondary} value={title} onChangeText={setTitle} />
        <TextInput style={styles.input} placeholder="Description" placeholderTextColor={THEME.textSecondary} value={description} onChangeText={setDescription} />
        <TextInput style={styles.input} placeholder="Start Time (e.g., 2026-06-01T10:00:00)" placeholderTextColor={THEME.textSecondary} value={startTime} onChangeText={setStartTime} />
        <TouchableOpacity onPress={addActivity} activeOpacity={0.8}>
          <LinearGradient colors={['#8E2DE2', '#4A00E0']} style={styles.addButton} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
            <Text style={styles.addButtonText}>Add Activity</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#8E2DE2" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id}
          renderItem={renderActivity}
          contentContainerStyle={{ padding: 20 }}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 60 },
  backButtonWrap: { paddingHorizontal: 15, paddingVertical: 8, backgroundColor: THEME.glassBg, borderRadius: 20 },
  backButton: { fontSize: 18, color: THEME.textPrimary, fontWeight: '900', fontFamily: SANS_FONT },
  title: { fontSize: 26, fontWeight: '900', color: THEME.textPrimary, fontFamily: SANS_FONT },
  formContainer: { padding: 20, backgroundColor: 'rgba(0,0,0,0.3)', marginHorizontal: 20, borderRadius: 25, marginBottom: 20, borderWidth: 1, borderColor: THEME.glassBorder },
  input: { backgroundColor: THEME.glassBg, color: THEME.textPrimary, padding: 15, borderRadius: 15, marginBottom: 15, borderWidth: 1, borderColor: THEME.glassBorder, fontSize: 14, fontFamily: SANS_FONT },
  addButton: { padding: 15, borderRadius: 15, alignItems: 'center', shadowColor: '#8E2DE2', shadowOpacity: 0.5, shadowOffset: { width: 0, height: 5 }, shadowRadius: 10, elevation: 5 },
  addButtonText: { color: THEME.textPrimary, fontWeight: '800', fontSize: 16, fontFamily: SANS_FONT },
  card: { padding: 25, borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: THEME.glassBorder, borderLeftWidth: 5, borderLeftColor: '#8E2DE2' },
  timeLabel: { fontSize: 12, color: '#00c6ff', fontWeight: '800', marginBottom: 5, fontFamily: SANS_FONT },
  cardTitle: { fontSize: 22, fontWeight: '800', color: THEME.textPrimary, marginBottom: 8, fontFamily: SANS_FONT },
  cardDesc: { fontSize: 16, color: THEME.textSecondary, fontFamily: SANS_FONT },
});
