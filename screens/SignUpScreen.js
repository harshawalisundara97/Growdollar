import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);
  const { signup } = useAuth();

  const emojiScale = useSharedValue(0);
  const emojiOpacity = useSharedValue(0);
  const slide0 = useSharedValue(40); const op0 = useSharedValue(0);
  const slide1 = useSharedValue(40); const op1 = useSharedValue(0);
  const slide2 = useSharedValue(40); const op2 = useSharedValue(0);
  const slide3 = useSharedValue(40); const op3 = useSharedValue(0);
  const slide4 = useSharedValue(40); const op4 = useSharedValue(0);
  const btnScale = useSharedValue(1);

  useEffect(() => {
    emojiScale.value = withSpring(1, { damping: 8, stiffness: 100 });
    emojiOpacity.value = withTiming(1, { duration: 300 });
    slide0.value = withDelay(80, withTiming(0, { duration: 350 }));
    op0.value = withDelay(80, withTiming(1, { duration: 350 }));
    slide1.value = withDelay(150, withTiming(0, { duration: 350 }));
    op1.value = withDelay(150, withTiming(1, { duration: 350 }));
    slide2.value = withDelay(220, withTiming(0, { duration: 350 }));
    op2.value = withDelay(220, withTiming(1, { duration: 350 }));
    slide3.value = withDelay(290, withTiming(0, { duration: 350 }));
    op3.value = withDelay(290, withTiming(1, { duration: 350 }));
    slide4.value = withDelay(360, withTiming(0, { duration: 350 }));
    op4.value = withDelay(360, withTiming(1, { duration: 350 }));
  }, []);

  const emojiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
    opacity: emojiOpacity.value,
  }));
  const block0Style = useAnimatedStyle(() => ({ opacity: op0.value, transform: [{ translateY: slide0.value }] }));
  const block1Style = useAnimatedStyle(() => ({ opacity: op1.value, transform: [{ translateY: slide1.value }] }));
  const block2Style = useAnimatedStyle(() => ({ opacity: op2.value, transform: [{ translateY: slide2.value }] }));
  const block3Style = useAnimatedStyle(() => ({ opacity: op3.value, transform: [{ translateY: slide3.value }] }));
  const block4Style = useAnimatedStyle(() => ({ opacity: op4.value, transform: [{ translateY: slide4.value }] }));
  const btnAnimStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnScale.value }] }));

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    if (password.trim() !== confirmPassword.trim()) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setIsLoading(true);
    const result = await signup(name.trim(), email.trim(), password);
    setIsLoading(false);
    if (!result.success) {
      Alert.alert('Signup Failed', result.error);
    }
  };

  return (
    <LinearGradient
      colors={['#E8F5E9', '#F1F8E9', '#FFFFFF']}
      start={[0, 0]}
      end={[0, 1]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Animated.Text style={[styles.emoji, emojiStyle]}>🌿</Animated.Text>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Start your plant growing journey today
              </Text>
            </View>

            <View style={styles.form}>
              <Animated.View style={block0Style}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={[styles.input, nameFocused && styles.inputFocused]}
                    placeholder="Enter your name"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    onFocus={() => setNameFocused(true)}
                    onBlur={() => setNameFocused(false)}
                  />
                </View>
              </Animated.View>

              <Animated.View style={block1Style}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={[styles.input, emailFocused && styles.inputFocused]}
                    placeholder="Enter your email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                  />
                </View>
              </Animated.View>

              <Animated.View style={block2Style}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={[styles.input, passwordFocused && styles.inputFocused]}
                    placeholder="Create a password (min 6 characters)"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                </View>
              </Animated.View>

              <Animated.View style={block3Style}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <TextInput
                    style={[styles.input, confirmFocused && styles.inputFocused]}
                    placeholder="Confirm your password"
                    placeholderTextColor="#999"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    onFocus={() => setConfirmFocused(true)}
                    onBlur={() => setConfirmFocused(false)}
                  />
                </View>
              </Animated.View>

              <Animated.View style={block4Style}>
                <Animated.View style={btnAnimStyle}>
                  <Pressable
                    style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
                    onPress={handleSignup}
                    disabled={isLoading}
                    onPressIn={() => {
                      btnScale.value = withSpring(0.96, { damping: 15, stiffness: 200 });
                    }}
                    onPressOut={() => {
                      btnScale.value = withSpring(1, { damping: 15, stiffness: 200 });
                    }}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.signupButtonText}>Create Account</Text>
                    )}
                  </Pressable>
                </Animated.View>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                <Pressable
                  style={styles.loginButton}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.loginButtonText}>
                    Already have an account?{' '}
                    <Text style={styles.loginLink}>Sign In</Text>
                  </Text>
                </Pressable>
              </Animated.View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#333',
  },
  inputFocused: {
    borderColor: '#4CAF50',
    elevation: 3,
    shadowColor: '#4CAF50',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  signupButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  signupButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#999',
    fontSize: 14,
  },
  loginButton: {
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
});
