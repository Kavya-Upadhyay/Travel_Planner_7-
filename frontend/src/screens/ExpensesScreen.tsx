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

export default function ExpensesScreen({ route, navigation }: any) {
  const { tripId } = route.params;
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await apiClient.get(`/expenses/trip/${tripId}`);
      setExpenses(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async () => {
    try {
      await apiClient.post(`/expenses`, {
        tripId, description, amount: parseFloat(amount),
        currency: 'USD', date: new Date().toISOString(),
        paidById: 'USER_ID', // Requires actual user context in prod
        splitType: 'EQUAL', splits: []
      });
      fetchExpenses();
      setDescription(''); setAmount('');
    } catch (error) {
      console.log(error);
    }
  };

  const renderExpense = ({ item }: { item: any }) => (
    <LinearGradient colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.02)']} style={styles.card}>
      <View style={styles.cardLeft}>
        <Text style={styles.cardTitle}>{item.description}</Text>
        <Text style={styles.cardSubtitle}>Paid by: User</Text>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.amountText}>${item.amount.toFixed(2)}</Text>
        <Text style={styles.currencyText}>{item.currency}</Text>
      </View>
    </LinearGradient>
  );

  return (
    <LinearGradient colors={['#141E30', '#243B55', '#0f2027']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonWrap}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Expenses</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.formContainer}>
        <TextInput style={styles.input} placeholder="Expense Description" placeholderTextColor={THEME.textSecondary} value={description} onChangeText={setDescription} />
        <TextInput style={styles.input} placeholder="Amount (USD)" placeholderTextColor={THEME.textSecondary} keyboardType="numeric" value={amount} onChangeText={setAmount} />
        <TouchableOpacity onPress={addExpense} activeOpacity={0.8}>
          <LinearGradient colors={['#ff4b1f', '#ff9068']} style={styles.addButton} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
            <Text style={styles.addButtonText}>Record Expense</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ff4b1f" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={renderExpense}
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
  addButton: { padding: 15, borderRadius: 15, alignItems: 'center', shadowColor: '#ff4b1f', shadowOpacity: 0.5, shadowOffset: { width: 0, height: 5 }, shadowRadius: 10, elevation: 5 },
  addButtonText: { color: THEME.textPrimary, fontWeight: '800', fontSize: 16, fontFamily: SANS_FONT },
  card: { padding: 25, borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: THEME.glassBorder, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderLeftWidth: 5, borderLeftColor: '#ff4b1f' },
  cardLeft: { flex: 1 },
  cardTitle: { fontSize: 20, fontWeight: '800', color: THEME.textPrimary, marginBottom: 5, fontFamily: SANS_FONT },
  cardSubtitle: { fontSize: 14, color: THEME.textSecondary, fontFamily: SANS_FONT },
  cardRight: { alignItems: 'flex-end', marginLeft: 15 },
  amountText: { fontSize: 24, fontWeight: '900', color: '#ff9068', fontFamily: SANS_FONT },
  currencyText: { fontSize: 12, color: THEME.textSecondary, fontWeight: '700', fontFamily: SANS_FONT },
});
