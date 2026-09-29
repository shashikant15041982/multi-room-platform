import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('shashikant15041982@gmail.com');
  const [currentRoom, setCurrentRoom] = useState(null);
  const [rooms, setRooms] = useState({
    1: { id: 1, title: 'Room 1', status: 'active', ai: 'Claude', executions: [], emails: [] },
    2: { id: 2, title: 'Room 2', status: 'empty', ai: 'ChatGPT', executions: [], emails: [] },
    3: { id: 3, title: 'Room 3', status: 'empty', ai: 'DeepSeek', executions: [], emails: [] },
  });

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const savedSession = await AsyncStorage.getItem('mobileSession');
      if (savedSession) {
        const session = JSON.parse(savedSession);
        setEmail(session.email);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Load error:', error);
    }
  };

  const handleLogin = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter email');
      return;
    }
    try {
      await AsyncStorage.setItem('mobileSession', JSON.stringify({ email }));
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('mobileSession');
      setIsLoggedIn(false);
      setEmail('shashikant15041982@gmail.com');
      setCurrentRoom(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const runExecution = () => {
    if (!currentRoom) return;
    const room = rooms[currentRoom];
    const newExecution = {
      timestamp: new Date().toISOString(),
      jobs: Math.floor(Math.random() * 50) + 10,
      tokens: Math.floor(Math.random() * 5000) + 2000,
    };
    setRooms({
      ...rooms,
      [currentRoom]: {
        ...room,
        executions: [...room.executions, newExecution],
      },
    });
  };

  const sendEmail = () => {
    if (!currentRoom) return;
    const room = rooms[currentRoom];
    const newEmail = {
      timestamp: new Date().toISOString(),
      to: `recruiter${Math.floor(Math.random() * 100)}@example.com`,
    };
    setRooms({
      ...rooms,
      [currentRoom]: {
        ...room,
        emails: [...room.emails, newEmail],
      },
    });
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#667eea" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🚀 Multi-Room</Text>
        </View>
        <View style={styles.loginContainer}>
          <Text style={styles.loginTitle}>Sign In</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (currentRoom) {
    const room = rooms[currentRoom];
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#667eea" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🚀 {room.title}</Text>
        </View>
        <ScrollView style={styles.content}>
          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={() => setCurrentRoom(null)}
          >
            <Text style={styles.buttonText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.actionGrid}>
            <TouchableOpacity style={[styles.actionButton, styles.successButton]} onPress={runExecution}>
              <Text style={styles.actionButtonText}>▶ Execute</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.infoButton]} onPress={sendEmail}>
              <Text style={styles.actionButtonText}>✉ Email</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {room.executions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>No executions yet</Text>
            </View>
          ) : (
            room.executions.slice(-5).reverse().map((exec, idx) => (
              <View key={idx} style={styles.historyItem}>
                <Text style={styles.historyTime}>
                  {new Date(exec.timestamp).toLocaleTimeString()}
                </Text>
                <Text style={styles.historyText}>✓ Found {exec.jobs} jobs</Text>
                <Text style={styles.badge}>{exec.tokens} tokens</Text>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚀 Multi-Room</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.userInfo}>
          <Text style={styles.userEmail}>{email}</Text>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Active</Text>
            <Text style={styles.statValue}>
              {Object.values(rooms).filter(r => r.status === 'active').length}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Executions</Text>
            <Text style={styles.statValue}>
              {Object.values(rooms).reduce((sum, r) => sum + r.executions.length, 0)}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Rooms</Text>
        {Object.values(rooms).map(room => (
          <TouchableOpacity
            key={room.id}
            style={styles.roomCard}
            onPress={() => setCurrentRoom(room.id)}
          >
            <View>
              <Text style={styles.roomTitle}>{room.title}</Text>
              <Text style={styles.roomInfo}>
                AI: {room.ai} • Executions: {room.executions.length}
              </Text>
            </View>
            <Text style={styles.roomBadge}>{room.status}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#667eea',
    paddingVertical: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  button: {
    backgroundColor: '#667eea',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#667eea',
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  logoutBtn: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logoutText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#667eea',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  statLabel: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
  },
  statValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 10,
    marginTop: 15,
  },
  roomCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  roomTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
    marginBottom: 5,
  },
  roomInfo: {
    fontSize: 12,
    color: '#999',
  },
  roomBadge: {
    backgroundColor: '#10b981',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '600',
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 15,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  successButton: {
    backgroundColor: '#10b981',
  },
  infoButton: {
    backgroundColor: '#3b82f6',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  historyItem: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  historyTime: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  historyText: {
    fontSize: 14,
    color: '#333',
  },
  badge: {
    backgroundColor: '#10b981',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyText: {
    color: '#999',
  },
});
