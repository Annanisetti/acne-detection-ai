import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

export default function App() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showDirectory, setShowDirectory] = useState(false);
  const [showAcneDetector, setShowAcneDetector] = useState(false);

  const handleLogin = () => {
    console.log('Login successful');
    setShowLoginForm(false);
    setShowSignUpForm(false);
    setShowDirectory(true);
  };

  const handleSignUp = () => {
    console.log('Sign up successful');
    setShowLoginForm(false);
    setShowSignUpForm(false);
    setShowDirectory(true);
  };

  const handleHome = () => {
    setShowLoginForm(false);
    setShowSignUpForm(false);
    setShowDirectory(false);
    setShowAcneDetector(false); // Reset Acne Detector screen visibility
  };

  const handleAcneDetector = () => {
    setShowLoginForm(false);
    setShowSignUpForm(false);
    setShowDirectory(false);
    setShowAcneDetector(true);
  };

  const handleDirectoryBack = () => {
    setShowAcneDetector(false); // Hide Acne Detector screen
    setShowDirectory(true); // Show Directory screen
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Derm Detector</Text>
      </View>

      {!showDirectory && !showAcneDetector && (
  <View style={styles.content}>
    <Text>Add Logo Here Now</Text>
  </View>
)}

      {showLoginForm && (
        <View style={styles.loginContainer}>
          <Text>Enter Username:</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
          <Text>Enter Password:</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
          <Button title="Login" onPress={handleLogin} />
          <Button title="Home" onPress={handleHome} />
        </View>
      )}

      {showSignUpForm && (
        <View style={styles.loginContainer}>
          <Text>Enter Username:</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
          <Text>Enter Password:</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
          <Button title="Sign Up" onPress={handleSignUp} />
          <Button title="Home" onPress={handleHome} />
        </View>
      )}

      {showDirectory && (
        <View style={styles.directoryContainer}>
          <Text style={styles.directoryText}>Directory</Text>
          <View style={styles.buttonGroup}>
            <Button title="Acne Detector" onPress={handleAcneDetector} />
          </View>
          <View style={styles.buttonGroup}>
            <Button title="Insights" onPress={() => console.log('Insights')} />
          </View>
          <View style={styles.buttonGroup}>
            <Button title="Journal" onPress={() => console.log('Journal')} />
          </View>
          <View style={styles.buttonGroup}>
            <Button title="Discussion" onPress={() => console.log('Discussion')} />
          </View>
        </View>
      )}

      {showAcneDetector && (
        <View style={styles.acneDetectorContainer}>
          <Text style={styles.acneDetectorText}>Acne Detector Screen</Text>
          <View style={styles.buttonGroup}>
            <Button title="Upload Image" onPress={() => console.log('Upload Image')} />
          </View>
          <View style={styles.buttonGroup}>
            <Button title="Take Photo" onPress={() => console.log('Take Photo')} />
          </View>
          <View style={styles.buttonGroup}>
            <Button title="Directory" onPress={handleDirectoryBack} />
          </View>
        </View>
      )}

      {!showLoginForm && !showSignUpForm && !showDirectory && !showAcneDetector &&(
        <View style={styles.buttonContainer}>
          <Button title="Login" onPress={() => setShowLoginForm(true)} />
          <Button title="Sign Up" onPress={() => setShowSignUpForm(true)} />
        </View>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#f0f0f0',
    paddingTop: 30,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    marginVertical: 20,
  },
  loginContainer: {
    padding: 20,
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  directoryContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  directoryText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  acneDetectorContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  acneDetectorText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonGroup: {
    marginVertical: 10, // Adjust margin between buttons
    width: '70%',
    maxHeight: 40,
  },
});
