import React, { useState, useEffect } from 'react';
import { StatusBar, TextInput } from 'react-native'; // Import TextInput from react-native
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library'; 
import { enableLegacyWebImplementation } from 'react-native-gesture-handler';

export default function App() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showDirectory, setShowDirectory] = useState(false);
  const [showAcneDetector, setShowAcneDetector] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [journalEntries, setJournalEntries] = useState(0); // New state variable

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access camera roll is required!');
      }
    })();
  }, []);

  const handleLogin = async () => {
    try {
      console.log('Login successful');
      setShowLoginForm(false);
      setShowSignUpForm(false);
      setShowDirectory(true);

      const apiUrl = 'YOUR_LOGIN_API_URL';

      // Check if username and password are not empty
      if (username && password) {
        // Send username and password to the backend
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        // Handle response from the backend
        if (response.ok) {
          const responseData = await response.json();
          console.log('Login response from backend:', responseData);
        } else {
          console.error('Login failed');
        }
      } else {
        console.error('Username or password is missing');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleSignUp = async () => {
    try {
      console.log('Sign up successful');
      setShowLoginForm(false);
      setShowSignUpForm(false);
      setShowDirectory(true);

      const apiUrl = 'YOUR_SIGNUP_API_URL';

      // Check if username and password are not empty
      if (username && password) {
        // Send username and password to the backend
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        // Handle response from the backend
        if (response.ok) {
          const responseData = await response.json();
          console.log('Signup response from backend:', responseData);
        } else {
          console.error('Signup failed');
        }
      } else {
        console.error('Username or password is missing');
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  const handleHome = () => {
    setShowLoginForm(false);
    setShowSignUpForm(false);
    setShowDirectory(false);
    setShowAcneDetector(false);
    setShowJournal(false);
    setShowInsights(false);
    setShowDiscussion(false);
  };

  const handleAcneDetector = () => {
    setShowLoginForm(false);
    setShowSignUpForm(false);
    setShowDirectory(false);
    setShowAcneDetector(true);
    setShowJournal(false);
    setShowInsights(false);
    setShowDiscussion(false);
  };

  const handleDirectoryBack = () => {
    setShowAcneDetector(false);
    setShowDirectory(true);
    setShowJournal(false);
    setShowInsights(false);
    setShowDiscussion(false);
  };

  const handleJournal = () => {
    setShowAcneDetector(false);
    setShowDirectory(false);
    setShowJournal(true);
    setShowInsights(false);
    setShowDiscussion(false);
  };

  const handleInsights = () => {
    setShowLoginForm(false);
    setShowSignUpForm(false);
    setShowDirectory(false);
    setShowAcneDetector(false);
    setShowJournal(false);
    setShowInsights(true);
    setShowDiscussion(false);
  };

  const handleDiscussion = () => {
    setShowLoginForm(false);
    setShowSignUpForm(false);
    setShowDirectory(false);
    setShowAcneDetector(false);
    setShowJournal(false);
    setShowInsights(false);
    setShowDiscussion(true);
  };

  const handleImageUpload = async () => {
    try {
      const pickerResult = await ImagePicker.launchImageLibraryAsync();
      if (!pickerResult.cancelled && pickerResult.assets.length > 0) {
        const uri = pickerResult.assets[0].uri;
        setSelectedImage(uri); // Set the selected image URI state
        setImageUploaded(true); // Set image uploaded state to true
      }
    } catch (error) {
      console.log('Error picking image: ', error);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access camera is required!');
        return;
      }
      
      const pickerResult = await ImagePicker.launchCameraAsync();
      if (!pickerResult.cancelled) {
        const uri = pickerResult.assets[0].uri;
        setSelectedImage(uri); // Set the selected image URI state
        setImageUploaded(true); // Set image uploaded state to true
        if (uri) {
          await MediaLibrary.saveToLibraryAsync(uri);
          alert('Photo saved to library!');
        }
      }
    } catch (error) {
      console.log('Error taking photo: ', error);
    }
  };

  const handleDetectAcne = async() => {
    try {
      // Check if an image has been selected
      if (!selectedImage) {
        console.error('No image selected');
        return;
      }
      console.log('hello');
      const apiUrl = 'http://10.186.125.30:3000/api/acne-detection';
      console.log(apiUrl);
  
      // Create a new FormData object
      const formData = new FormData();
      // Append the selected image to the FormData object
      formData.append('image', {
        uri: selectedImage,
        name: 'image.jpg',
        type: 'image/jpeg',
      });
      console.log(formData);
      
      // Send the FormData object in the POST request
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });
      console.log(response);
      if (response.ok) {
        console.log('Acne detection request successful');
        // Handle response from the backend
        const responseData = await response.json();
        console.log('Acne detection response from backend:', responseData);
        // Show results screen and increment journalEntries
        journalEntries++;
        handleResult();
      } else {
        console.error('Acne detection request failed');
      }
    } catch (error) {
      console.error('Error during acne detection:', error);
    }
  };
  

  const handleResult = () => {
    setShowLoginForm(false);
    setShowSignUpForm(false);
    setShowDirectory(false);
    setShowAcneDetector(false);
    setShowJournal(false);
    setShowInsights(false);
    setShowDiscussion(false);
    setShowResults(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Derm Detector</Text>
      </View>

      {!showDirectory && !showAcneDetector && !showJournal && !showInsights && !showDiscussion && !showResults &&(
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
            <Button title="Acne Scanner" onPress={handleAcneDetector} />
          </View>
          <View style={styles.buttonGroup}>
            <Button title="Insights" onPress={handleInsights} />
          </View>
          <View style={styles.buttonGroup}>
            <Button title="Journal" onPress={handleJournal} />
          </View>
          <View style={styles.buttonGroup}>
            <Button title="Discussion" onPress={handleDiscussion} />
          </View>
        </View>
      )}

      {showAcneDetector && (
        <View style={styles.acneDetectorContainer}>
          <Text style={styles.acneDetectorText}>Acne Scanner</Text>
          <View style={styles.buttonGroup}>
            <Button title="Upload Image" onPress={handleImageUpload} />
          </View>
          {imageUploaded && (
            <View style={styles.buttonGroup}>
              <Button title="Detect Acne" onPress={handleDetectAcne} />
            </View>
          )}
          {selectedImage && <Image source={{ uri: selectedImage }} style={styles.uploadedImage} />}
          <View style={styles.buttonGroup}>
            <Button title="Take Photo" onPress={handleTakePhoto} />
          </View>
          <View style={styles.buttonGroup}>
            <Button title="Directory" onPress={handleDirectoryBack} />
          </View>
        </View>
      )}

{showJournal && (
    <View style={styles.journalContainer}>
      <Text style={styles.journalText}>Journal</Text>
      <Text>Here you can find your previous scans</Text>
      {journalEntries > 0 ? (
        // Display journal entries if journalEntries > 0
        <Text>Display journal entries here</Text>
      ) : (
        // Display "No scans found" message if journalEntries = 0
        <Text>No Scans Found!</Text>
      )}
      <View style={styles.buttonGroup}>
        <Button title="Directory" onPress={handleDirectoryBack} />
      </View>
    </View>
  )}

      {showInsights && (
        <View style={styles.insightsContainer}>
          <Text style={styles.insightsText}>Insights</Text>
          <Text>No insights available</Text>
          <View style={styles.buttonGroup}>
            <Button title="Directory" onPress={handleDirectoryBack} />
          </View>
        </View>
      )}

      {showDiscussion && (
        <View style={styles.discussionContainer}>
          <Text style={styles.discussionText}>Discussion</Text>
          <Text>No discussions available</Text>
          <View style={styles.buttonGroup}>
            <Button title="Directory" onPress={handleDirectoryBack} />
          </View>
        </View>
      )}

      {showResults && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>Results</Text>
          {selectedImage && <Image source={{ uri: selectedImage }} style={styles.uploadedImage} />}
          {/* You can display the results here */}
        </View>
      )}

      {!showLoginForm && !showSignUpForm && !showDirectory && !showAcneDetector && !showJournal && !showInsights && !showDiscussion && !showResults &&(
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
  journalContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  journalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  insightsContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  insightsText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  discussionContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  discussionText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonGroup: {
    marginVertical: 10,
    width: '70%',
    maxHeight: 40,
  },
  uploadedImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  resultsContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  resultsText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
