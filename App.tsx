import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image } from 'react-native';
// Built-in icons in Expo (similar to SF Symbols)
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  // @State for play/pause toggle
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Top Bar (HStack) */}
      <View style={styles.navBar}>
        <Ionicons name="chevron-down" size={30} color="#FFFFFF" />
        <Text style={styles.navTitle}>NOW PLAYING</Text>
        <Ionicons name="ellipsis-horizontal" size={24} color="#FFFFFF" />
      </View>

      {/* Album Cover */}
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800&auto=format&fit=crop' }} 
        style={styles.albumArt} 
      />

      {/* Song Title & Artist (VStack) */}
      <View style={styles.songInfoContainer}>
        <Text style={styles.songTitle}>Neon Skyline</Text>
        <Text style={styles.artistName}>The Midnight Echo</Text>
      </View>

      {/* Scrub Bar / Timeline */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View style={styles.progressBarFill} />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>1:42</Text>
          <Text style={styles.timeText}>-2:18</Text>
        </View>
      </View>

      {/* Playback Controls (HStack) */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity>
          <Ionicons name="play-skip-back" size={38} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Play/Pause Button */}
        <TouchableOpacity style={styles.playButton} onPress={togglePlay}>
          <Ionicons 
            name={isPlaying ? "pause" : "play"} 
            size={38} 
            color="#000000" 
            style={{ marginLeft: isPlaying ? 0 : 3 }}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="play-skip-forward" size={38} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

// Flexbox layout and styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D', // Deep black/slate
    alignItems: 'center',
  },
  navBar: {
    flexDirection: 'row', // HStack
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
    marginTop: 10,
    marginBottom: 30,
  },
  navTitle: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  albumArt: {
    width: 320,
    height: 320,
    borderRadius: 20,
    marginBottom: 40,
  },
  songInfoContainer: {
    width: '100%',
    paddingHorizontal: 32,
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  songTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  artistName: {
    color: '#8E8E93',
    fontSize: 18,
  },
  progressContainer: {
    width: '100%',
    paddingHorizontal: 32,
    marginBottom: 35,
  },
  progressBarBackground: {
    height: 5,
    backgroundColor: '#2C2C2E',
    borderRadius: 2.5,
    marginBottom: 8,
  },
  progressBarFill: {
    height: 5,
    backgroundColor: '#FF2D55', // Apple Music Pink
    borderRadius: 2.5,
    width: '45%',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: '#8E8E93',
    fontSize: 12,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '65%',
  },
  playButton: {
    width: 76,
    height: 76,
    backgroundColor: '#FFFFFF',
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
  }
});