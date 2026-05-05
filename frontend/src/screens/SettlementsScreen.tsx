import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import apiClient from '../api/apiClient';

const SANS_FONT = Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif';

const THEME = {
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  glassBg: 'rgba(255, 255, 255, 0.1)',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
};

export default function SettlementsScreen({ route, navigation }: any) {
  const { tripId } = route.params;
  const [settlements, setSettlements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettlements();
  }, []);

  const fetchSettlements = async () => {
    try {
      const response = await apiClient.post(`/expenses/trip/${tripId}/settle`);
      setSettlements(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const renderSettlement = ({ item }: { item: any }) => (
    <LinearGradient colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.02)']} style={styles.card}>
      <View style={styles.avatarWrap}>
        <Text style={styles.avatarText}>{item.fromUserId?.charAt(0) || 'U'}</Text>
      </View>
      
      <View style={styles.middleCol}>
        <Text style={styles.paysText}>Owes</Text>
        <LinearGradient colors={['#11998e', '#38ef7d']} style={styles.line} start={{x: 0, y: 0}} end={{x: 1, y: 0}} />
      </View>

      <View style={styles.avatarWrap}>
        <Text style={styles.avatarText}>{item.toUserId?.charAt(0) || 'U'}</Text>
      </View>

      <View style={styles.amountCol}>
        <Text style={styles.amountValue}>${item.amount.toFixed(2)}</Text>
      </View>
    </LinearGradient>
  );

  return (
    <LinearGradient colors={['#141E30', '#243B55', '#0f2027']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonWrap}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settlements</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Min Cash Flow algorithm applied. These are the mathematically fewest transactions required to settle all debts.</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#38ef7d" style={{ marginTop: 50 }} />
      ) : settlements.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Everyone is fully settled up! 🎉</Text>
        </View>
      ) : (
        <FlatList
          data={settlements}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderSettlement}
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
  infoBox: { margin: 20, padding: 20, backgroundColor: 'rgba(17, 153, 142, 0.1)', borderRadius: 15, borderWidth: 1, borderColor: 'rgba(17, 153, 142, 0.3)' },
  infoText: { color: '#38ef7d', fontSize: 14, textAlign: 'center', fontWeight: '600', lineHeight: 22, fontFamily: SANS_FONT },
  card: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: THEME.glassBorder, borderLeftWidth: 5, borderLeftColor: '#38ef7d' },
  avatarWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: THEME.glassBg, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: THEME.glassBorder },
  avatarText: { color: THEME.textPrimary, fontWeight: '800', fontSize: 18, fontFamily: SANS_FONT },
  middleCol: { flex: 1, alignItems: 'center', paddingHorizontal: 10 },
  paysText: { fontSize: 10, color: THEME.textSecondary, marginBottom: 5, textTransform: 'uppercase', letterSpacing: 1, fontFamily: SANS_FONT },
  line: { width: '100%', height: 2, borderRadius: 1 },
  amountCol: { marginLeft: 15, alignItems: 'flex-end' },
  amountValue: { fontSize: 20, fontWeight: '900', color: '#38ef7d', fontFamily: SANS_FONT },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { fontSize: 20, color: THEME.textSecondary, fontWeight: '600', fontFamily: SANS_FONT },
});
