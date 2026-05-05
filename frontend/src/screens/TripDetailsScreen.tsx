import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SANS_FONT = Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif';
const THEME = {
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
};

export default function TripDetailsScreen({ route, navigation }: any) {
  const { tripId } = route.params;

  return (
    <LinearGradient colors={['#141E30', '#243B55', '#0f2027']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonWrap}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Trip Hub</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.grid}>
        <TouchableOpacity activeOpacity={0.8} style={styles.cardWrap} onPress={() => navigation.navigate('Itinerary', { tripId })}>
          <LinearGradient colors={['#8E2DE2', '#4A00E0']} style={styles.card} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
            <Text style={styles.cardIcon}>⏱️</Text>
            <Text style={styles.cardTitle}>Itinerary</Text>
            <Text style={styles.cardDesc}>Plan your timeline</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8} style={styles.cardWrap} onPress={() => navigation.navigate('Expenses', { tripId })}>
          <LinearGradient colors={['#ff4b1f', '#ff9068']} style={styles.card} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
            <Text style={styles.cardIcon}>💸</Text>
            <Text style={styles.cardTitle}>Expenses</Text>
            <Text style={styles.cardDesc}>Track group spending</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8} style={styles.cardWrap} onPress={() => navigation.navigate('Settlements', { tripId })}>
          <LinearGradient colors={['#11998e', '#38ef7d']} style={styles.card} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
            <Text style={styles.cardIcon}>⚖️</Text>
            <Text style={styles.cardTitle}>Settlements</Text>
            <Text style={styles.cardDesc}>Algorithm optimized</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8} style={styles.cardWrap}>
          <LinearGradient colors={['#ee0979', '#ff6a00']} style={styles.card} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
            <Text style={styles.cardIcon}>🗳️</Text>
            <Text style={styles.cardTitle}>Polls</Text>
            <Text style={styles.cardDesc}>Vote on destinations</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 60, marginBottom: 20 },
  backButtonWrap: { padding: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20 },
  backButton: { fontSize: 14, color: THEME.textPrimary, fontWeight: '700', fontFamily: SANS_FONT },
  title: { fontSize: 26, fontWeight: '900', color: THEME.textPrimary, fontFamily: SANS_FONT },
  grid: { padding: 20, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cardWrap: { width: '47%', aspectRatio: 0.9, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 10 }, shadowRadius: 20, elevation: 10 },
  card: { flex: 1, borderRadius: 25, padding: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: THEME.glassBorder },
  cardIcon: { fontSize: 40, marginBottom: 15 },
  cardTitle: { fontSize: 20, fontWeight: '900', color: THEME.textPrimary, marginBottom: 5, fontFamily: SANS_FONT },
  cardDesc: { fontSize: 12, color: THEME.textSecondary, textAlign: 'center', fontWeight: '500', fontFamily: SANS_FONT },
});
