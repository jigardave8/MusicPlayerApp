import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// 1. Data Model (like a Swift Struct conforming to Identifiable)
interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  coverUrl: string;
}

const PLAYLIST: Song[] = [
  {
    id: '1',
    title: 'Neon Skyline',
    artist: 'The Midnight Echo',
    duration: '3:42',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Cyber Sunset',
    artist: 'Lazerhawk',
    duration: '4:15',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Midnight City Lights',
    artist: 'Retro Wave',
    duration: '2:58',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '4',
    title: 'Electric Horizon',
    artist: 'Dynatron',
    duration: '5:02',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop'
  }
];

export default function App() {
  // @State for the currently playing song
  const [currentSong, setCurrentSong] = useState<Song>(PLAYLIST[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  // 2. This is your cellForRowAt / SwiftUI List Row
  const renderSongItem = ({ item }: { item: Song }) => {
    const isSelected = item.id === currentSong.id;

    return (
      <TouchableOpacity 
        style={[styles.songRow, isSelected && styles.selectedSongRow]} 
        onPress={() => {
          setCurrentSong(item);
          setIsPlaying(true);
        }}
      >
        <Image source={{ uri: item.coverUrl }} style={styles.thumbnail} />
        <View style={styles.songRowText}>
          <Text style={[styles.rowTitle, isSelected && styles.activeText]}>
            {item.title}
          </Text>
          <Text style={styles.rowArtist}>{item.artist}</Text>
        </View>
        <Text style={styles.rowDuration}>{item.duration}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Mini Player Section (Top) */}
      <View style={styles.playerHeader}>
        <Image source={{ uri: currentSong.coverUrl }} style={styles.mainArt} />
        <View style={styles.headerInfo}>
          <Text style={styles.mainTitle} numberOfLines={1}>{currentSong.title}</Text>
          <Text style={styles.mainArtist}>{currentSong.artist}</Text>
        </View>
        <TouchableOpacity style={styles.miniPlayBtn} onPress={() => setIsPlaying(!isPlaying)}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={26} color="black" />
        </TouchableOpacity>
      </View>

      {/* Playlist Title */}
      <Text style={styles.sectionTitle}>Up Next in Queue</Text>

      {/* 3. The FlatList (UITableView) */}
      <FlatList
        data={PLAYLIST}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  playerHeader: {
    flexDirection: 'row', // HStack
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
  },
  mainArt: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  headerInfo: {
    flex: 1, // Takes remaining width between image and play button
    marginLeft: 14,
  },
  mainTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mainArtist: {
    color: '#A0A0A0',
    fontSize: 14,
    marginTop: 2,
  },
  miniPlayBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    marginHorizontal: 20,
    marginTop: 28,
    marginBottom: 12,
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  selectedSongRow: {
    backgroundColor: '#282828', // Highlights the active playing song
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 6,
  },
  songRowText: {
    flex: 1,
    marginLeft: 12,
  },
  rowTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  activeText: {
    color: '#1DB954', // Spotify Green for current playing
    fontWeight: '700',
  },
  rowArtist: {
    color: '#8E8E93',
    fontSize: 13,
    marginTop: 2,
  },
  rowDuration: {
    color: '#8E8E93',
    fontSize: 13,
  }
});