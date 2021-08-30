import "react-native-gesture-handler";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Alert,
  ScrollView,
  BackHandler,
} from "react-native";

// importing components
import { Camera as CameraIcon, Folder } from "./components/Icons";
// importing services
import { H1, H3 } from "./components/Typography";
import {
  isServiceAvailable,
  getRecognizedClasses,
  getFlowerImagePrediction,
} from "./services/plantRecog";

const { width } = Dimensions.get("screen");

let camera: Camera;

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [hasPermissionCamera, setHasPermissionCamera] = useState(false);
  const [hasPermissionPicker, setHasPermissionPicker] = useState(false);

  const [predicted, setPredicted] = useState({
    name: "PlantRecog",
    score: null,
  });
  const [allPredicted, setAllPredicted] = useState([
    {
      name: "",
      score: null,
    },
  ]);
  const [recognized, setRecognized] = useState([]);

  // do all permission tasks and initial server requests
  useEffect(() => {
    (async () => {
      await SplashScreen.preventAutoHideAsync();
      const [isPlantServiceUp, cameraPer, pickerPer, recogPayload] =
        await Promise.all([
          isServiceAvailable(),
          Camera.requestPermissionsAsync(),
          ImagePicker.requestMediaLibraryPermissionsAsync(),
          getRecognizedClasses(),
        ]);
      if (!isPlantServiceUp) {
        Alert.alert(
          "Oh! Snap",
          "The service is currently unavailable, please check later!",
          [{ text: "Close App", onPress: () => BackHandler.exitApp() }]
        );
      }
      setHasPermissionCamera(cameraPer.status === "granted");
      setHasPermissionPicker(pickerPer.status === "granted");
      setAppIsReady(true);
      setRecognized(recogPayload.recognized);
    })();
  }, []);

  // to avoid flicker remove the splash, when actual app renders after appIsReady changes to "true"
  const onLayout = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // if app is not ready then render nothing
  if (!appIsReady) {
    return null;
  }

  const takePictureAsync = async () => {
    if (!hasPermissionCamera) {
      const { status } = await Camera.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Oh! Snap", "App does not have permission for the Camera!");
      } else {
        setHasPermissionCamera(true);
      }
    }

    const photo = await camera.takePictureAsync({
      quality: 0,
    });

    recognizeImage(photo.uri);
  };

  const pickImage = async () => {
    if (!hasPermissionPicker) {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Oh! Snap",
          "Not having enough permission to open gallery!"
        );
      } else {
        setHasPermissionPicker(true);
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0,
    });

    if (!result.cancelled) {
      recognizeImage(result.uri);
    }
  };

  const recognizeImage = async (image: string) => {
    try {
      setPredicted({
        name: "Processing Image...",
        score: null,
      });
      const payload: any = await getFlowerImagePrediction(image);
      if (payload.predictions !== null) {
        setPredicted(payload.predictions[0]);
        setAllPredicted(payload.predictions);
      } else {
        return Alert.alert(
          "Ops",
          "Looks like something bad happened, please try again!"
        );
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <View style={styles.container} onLayout={onLayout}>
      <StatusBar hidden />
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        ref={(r) => (camera = r)}
        ratio="1:1"
      >
        <TouchableOpacity
          style={styles.mainCameraButton}
          onPress={takePictureAsync}
        >
          <CameraIcon />
        </TouchableOpacity>
        <TouchableOpacity style={styles.mainGalleryButton} onPress={pickImage}>
          <Folder />
        </TouchableOpacity>
      </Camera>
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}
      >
        <H1 text={predicted.name.toUpperCase()} />
        {allPredicted[0].score === null ? (
          <H3 text="Know plants with just a click. How we do it? We run our Tensorflow based image classification model as an API service using Nodejs." />
        ) : (
          allPredicted.map((d) => {
            return <H3 key={d.name} text={d.name + ": " + d.score} />;
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  camera: {
    height: width,
    width,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
  },
  mainCameraButton: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: `rgba(249, 249, 249, 0.8)`,
    position: "absolute",
    bottom: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: {
      width: 8,
      height: 8,
    },
    shadowColor: "black",
    shadowRadius: 8,
  },
  mainGalleryButton: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: `rgba(249, 249, 249, 0.8)`,
    position: "absolute",
    bottom: 10,
    right: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: {
      width: 8,
      height: 8,
    },
    shadowColor: "black",
    shadowRadius: 8,
  },
  scrollViewContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignContent: "flex-start",
    padding: 8,
    width,
  },
});
