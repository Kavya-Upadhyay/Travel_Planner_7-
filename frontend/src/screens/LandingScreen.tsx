import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Extremely vibrant and premium theme with gradients
const THEME = {
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  glassBg: 'rgba(255, 255, 255, 0.1)',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
};

const SANS_FONT = Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif';

const FadeInSlideUp = ({ children, delay = 0, style }: any) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 800, useNativeDriver: true }),
      ]),
    ]).start();
  }, [delay]);

  return <Animated.View style={[style, { opacity: fadeAnim, transform: [{ translateY }] }]}>{children}</Animated.View>;
};

export default function LandingScreen({ navigation }: any) {
  return (
    <LinearGradient colors={['#141E30', '#243B55', '#0f2027']} style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.logo}>TimeToSplit</Text>
        <View style={styles.navLinks}>
          {Platform.OS === 'web' && width > 768 && (
            <>
              <Text style={styles.navItem}>About</Text>
              <Text style={styles.navItem}>Features</Text>
              <Text style={styles.navItem}>Pricing</Text>
            </>
          )}
          <TouchableOpacity onPress={() => navigation.navigate('Auth')}>
            <LinearGradient colors={['#00c6ff', '#0072ff']} style={styles.navLoginBg} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
              <Text style={styles.navLogin}>Log in</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <FadeInSlideUp delay={0}>
            <Text style={styles.heroTitle}>Your journey.</Text>
          </FadeInSlideUp>
          <FadeInSlideUp delay={200}>
            <Text style={styles.heroTitleAccent}>Perfectly synced.</Text>
          </FadeInSlideUp>
          <FadeInSlideUp delay={400}>
            <Text style={styles.heroSubtitle}>
              Experience visually stunning trip planning. Track itineraries, vote on plans, and settle debts instantly with breathtaking algorithmic precision.
            </Text>
          </FadeInSlideUp>
          <FadeInSlideUp delay={600}>
            <TouchableOpacity onPress={() => navigation.navigate('Auth')} activeOpacity={0.8}>
              <LinearGradient colors={['#f12711', '#f5af19']} style={styles.pillButtonPrimary} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
                <Text style={styles.pillButtonTextPrimary}>Start Exploring</Text>
              </LinearGradient>
            </TouchableOpacity>
          </FadeInSlideUp>
        </View>

        {/* Dynamic Image / Graphic Placeholder */}
        <FadeInSlideUp delay={800} style={styles.graphicSection}>
          <LinearGradient colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']} style={styles.giantImagePlaceholder}>
            <Text style={styles.graphicText}>Stunning Visual Dashboard</Text>
          </LinearGradient>
        </FadeInSlideUp>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          {[
            { num: "1.2M+", label: "Trips Organized" },
            { num: "$40M+", label: "Debts Settled" },
            { num: "O(N log N)", label: "Min Cash Flow Engine" }
          ].map((stat, idx) => (
            <FadeInSlideUp key={idx} delay={200 + (idx * 200)} style={styles.statBox}>
              <Text style={styles.statNumber}>{stat.num}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </FadeInSlideUp>
          ))}
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionHeader}>Engineered for excellence.</Text>
          <View style={styles.featuresGrid}>
            {[
              { title: "Real-time sync", desc: "Collaborate on itineraries instantly with WebSockets. Drag and drop days." },
              { title: "Min-Cash Flow", desc: "A greedy algorithm ensures your group makes the absolute minimum number of transactions." },
              { title: "Smart Vault", desc: "Keep passports and bookings securely in one centralized digital space." },
              { title: "Democratic Planning", desc: "Vote on destinations and activities with our built-in polling engine." }
            ].map((feature, idx) => (
              <FadeInSlideUp key={idx} delay={200 * idx} style={styles.featureCardWrap}>
                <LinearGradient colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.03)']} style={styles.featureCard}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDesc}>{feature.desc}</Text>
                </LinearGradient>
              </FadeInSlideUp>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLogo}>TimeToSplit</Text>
          <Text style={styles.footerText}>© 2026 TimeToSplit. Built with precision.</Text>
          <View style={styles.footerLinks}>
            <Text style={styles.footerLink}>Privacy</Text>
            <Text style={styles.footerLink}>Terms</Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navbar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: width > 768 ? 80 : 30, paddingVertical: 35, zIndex: 100,
  },
  logo: { fontSize: 26, fontWeight: '900', color: THEME.textPrimary, letterSpacing: -1, fontFamily: SANS_FONT },
  navLinks: { flexDirection: 'row', alignItems: 'center' },
  navItem: { color: THEME.textPrimary, marginHorizontal: 20, fontSize: 16, fontWeight: '600', fontFamily: SANS_FONT },
  navLoginBg: { borderRadius: 50, paddingHorizontal: 28, paddingVertical: 12, marginLeft: 20 },
  navLogin: { color: THEME.textPrimary, fontSize: 16, fontWeight: '800', fontFamily: SANS_FONT },
  scrollContent: { flexGrow: 1 },
  heroSection: { paddingHorizontal: width > 768 ? '15%' : 30, paddingTop: width > 768 ? 120 : 60, paddingBottom: 60, alignItems: 'flex-start' },
  heroTitle: { fontSize: width > 768 ? 110 : 60, fontWeight: '900', color: THEME.textPrimary, letterSpacing: -3, lineHeight: width > 768 ? 120 : 70, fontFamily: SANS_FONT },
  heroTitleAccent: { fontSize: width > 768 ? 110 : 60, fontWeight: '900', color: '#f5af19', letterSpacing: -2, lineHeight: width > 768 ? 120 : 70, marginBottom: 40, fontFamily: SANS_FONT },
  heroSubtitle: { fontSize: width > 768 ? 22 : 16, color: THEME.textSecondary, maxWidth: 650, lineHeight: 34, marginBottom: 50, fontWeight: '500', fontFamily: SANS_FONT },
  pillButtonPrimary: { paddingHorizontal: 50, paddingVertical: 20, borderRadius: 50, shadowColor: '#f12711', shadowOpacity: 0.5, shadowOffset: { width: 0, height: 10 }, shadowRadius: 20, elevation: 10 },
  pillButtonTextPrimary: { color: THEME.textPrimary, fontSize: 20, fontWeight: '800', letterSpacing: 0.5, fontFamily: SANS_FONT },
  graphicSection: { paddingHorizontal: width > 768 ? '15%' : 30, marginBottom: 120 },
  giantImagePlaceholder: { width: '100%', height: 600, borderRadius: 40, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: THEME.glassBorder, shadowColor: '#000', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 30 }, shadowRadius: 50 },
  graphicText: { fontSize: 28, fontWeight: '800', color: THEME.textPrimary, fontFamily: SANS_FONT },
  statsSection: { flexDirection: width > 768 ? 'row' : 'column', justifyContent: 'space-evenly', paddingVertical: 100, paddingHorizontal: 40, backgroundColor: 'rgba(0,0,0,0.2)' },
  statBox: { alignItems: width > 768 ? 'center' : 'flex-start', marginVertical: width > 768 ? 0 : 30 },
  statNumber: { fontSize: width > 768 ? 70 : 50, fontWeight: '900', color: '#00c6ff', letterSpacing: -2, fontFamily: SANS_FONT },
  statLabel: { fontSize: 16, color: THEME.textPrimary, marginTop: 15, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', fontFamily: SANS_FONT },
  featuresSection: { paddingHorizontal: width > 768 ? '15%' : 30, paddingVertical: 140 },
  sectionHeader: { fontSize: width > 768 ? 60 : 45, fontWeight: '900', color: THEME.textPrimary, marginBottom: 80, letterSpacing: -2, fontFamily: SANS_FONT },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  featureCardWrap: { width: width > 768 ? '47%' : '100%', marginBottom: 40 },
  featureCard: { padding: 40, borderRadius: 30, borderWidth: 1, borderColor: THEME.glassBorder },
  featureTitle: { fontSize: 28, fontWeight: '800', color: THEME.textPrimary, marginBottom: 20, letterSpacing: -1, fontFamily: SANS_FONT },
  featureDesc: { fontSize: 18, color: THEME.textSecondary, lineHeight: 28, fontWeight: '500', fontFamily: SANS_FONT },
  footer: { paddingHorizontal: width > 768 ? 80 : 30, paddingVertical: 60, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: width > 768 ? 'row' : 'column', justifyContent: 'space-between', alignItems: width > 768 ? 'center' : 'flex-start' },
  footerLogo: { fontSize: 28, fontWeight: '900', color: THEME.textPrimary, letterSpacing: -1, marginBottom: width > 768 ? 0 : 20, fontFamily: SANS_FONT },
  footerText: { color: THEME.textSecondary, fontSize: 16, fontWeight: '500', marginBottom: width > 768 ? 0 : 20, fontFamily: SANS_FONT },
  footerLinks: { flexDirection: 'row' },
  footerLink: { color: THEME.textPrimary, marginLeft: width > 768 ? 40 : 0, marginRight: width > 768 ? 0 : 30, fontSize: 16, fontWeight: '700', fontFamily: SANS_FONT },
});
