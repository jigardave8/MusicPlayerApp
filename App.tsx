import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, SafeAreaView, 
  Image, FlatList, Modal, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import * as DocumentPicker from 'expo-document-picker';

interface Song {
  id: string;
  title: string;
  artist: string;
  uri: string;
  coverUrl: string;
}

const INITIAL_PLAYLIST: Song[] = [
  {
    id: '1',
    title: 'Neon Skyline',
    artist: 'The Midnight Echo',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Cyber Sunset',
    artist: 'Lazerhawk',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Midnight City Lights',
    artist: 'Retro Wave',
    uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=600&auto=format&fit=crop'
  }
];

export default function App() {
  const [playlist, setPlaylist] = useState<Song[]>(INITIAL_PLAYLIST);
  const [currentSong, setCurrentSong] = useState<Song>(INITIAL_PLAYLIST[0]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // The modern Expo-Audio player hook
  const player = useAudioPlayer(currentSong.uri);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    // Configure iOS AudioSession (playsInSilentMode = audio works even if hardware mute switch is on)
    setAudioModeAsync({
      playsInSilentMode: true,
    });
  }, []);

  // Play a chosen song
  const playSong = (song: Song) => {
    setCurrentSong(song);
    player.replace(song.uri);
    player.play();
  };

  // Toggle Play / Pause
  const togglePlayPause = () => {
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  // Import local audio files using native iOS UIDocumentPickerViewController
  const importLocalSong = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*', // Filters for audio files in Files app / iCloud Drive
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        
        const newTrack: Song = {
          id: Date.now().toString(),
          title: file.name.replace(/\.[^/.]+$/, ""), // Strip file extension
          artist: 'Local Import',
          uri: file.uri, // Local file:// URI
          coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop'
        };

        setPlaylist([newTrack, ...playlist]);
        playSong(newTrack);
      }
    } catch (err) {
      Alert.alert('Import Failed', 'Could not access file.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Mini Player Header (Tap to expand full screen modal) */}
      <TouchableOpacity style={styles.playerHeader} onPress={() => setIsModalOpen(true)}>
        <Image source={{ uri: currentSong.coverUrl }} style={styles.mainArt} />
        <View style={styles.headerInfo}>
          <Text style={styles.mainTitle} numberOfLines={1}>{currentSong.title}</Text>
          <Text style={styles.mainArtist}>{currentSong.artist}</Text>
        </View>
        <TouchableOpacity style={styles.miniPlayBtn} onPress={togglePlayPause}>
          <Ionicons name={status.playing ? "pause" : "play"} size={24} color="#000" />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Queue Header & Import Button */}
      <View style={styles.queueHeader}>
        <Text style={styles.sectionTitle}>Up Next in Queue</Text>
        <TouchableOpacity style={styles.importBtn} onPress={importLocalSong}>
          <Ionicons name="add" size={18} color="#FFF" />
          <Text style={styles.importText}>Import File</Text>
        </TouchableOpacity>
      </View>

      {/* Playlist List (UITableView) */}
      <FlatList
        data={playlist}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => {
          const isSelected = item.id === currentSong.id;
          return (
            <TouchableOpacity 
              style={[styles.songRow, isSelected && styles.selectedSongRow]} 
              onPress={() => playSong(item)}
            >
              <Image source={{ uri: item.coverUrl }} style={styles.thumbnail} />
              <View style={styles.songRowText}>
                <Text style={[styles.rowTitle, isSelected && styles.activeText]}>
                  {item.title}
                </Text>
                <Text style={styles.rowArtist}>{item.artist}</Text>
              </View>
              {isSelected && status.playing ? (
                <Ionicons name="volume-high" size={20} color="#1DB954" />
              ) : null}
            </TouchableOpacity>
          );
        }}
      />

      {/* Apple Music Full-Screen Modal */}
      <Modal visible={isModalOpen} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          
          <TouchableOpacity style={styles.closeBtn} onPress={() => setIsModalOpen(false)}>
            <Ionicons name="chevron-down" size={32} color="#FFF" />
          </TouchableOpacity>

          <Image source={{ uri: currentSong.coverUrl }} style={styles.modalAlbumArt} />

          <View style={styles.modalInfoContainer}>
            <Text style={styles.modalTitle}>{currentSong.title}</Text>
            <Text style={styles.modalArtist}>{currentSong.artist}</Text>
          </View>

          {/* Fake Progress */}
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: status.playing ? '60%' : '15%' }]} />
          </View>

          {/* Full Screen Controls */}
          <View style={styles.modalControls}>
            <TouchableOpacity>
              <Ionicons name="play-skip-back" size={40} color="#FFF" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.modalPlayBtn} onPress={togglePlayPause}>
              <Ionicons 
                name={status.playing ? "pause" : "play"} 
                size={40} 
                color="#000" 
                style={{ marginLeft: status.playing ? 0 : 4 }} 
              />
            </TouchableOpacity>

            <TouchableOpacity>
              <Ionicons name="play-skip-forward" size={40} color="#FFF" />
            </TouchableOpacity>
          </View>

        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
  },
  mainArt: {
    width: 55,
    height: 55,
    borderRadius: 8,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 14,
  },
  mainTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  mainArtist: {
    color: '#8E8E93',
    fontSize: 13,
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
  queueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 26,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  importBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  importText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 6,
  },
  selectedSongRow: {
    backgroundColor: '#1E1E1E',
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
    color: '#1DB954',
    fontWeight: '700',
  },
  rowArtist: {
    color: '#8E8E93',
    fontSize: 13,
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  closeBtn: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  modalAlbumArt: {
    width: 320,
    height: 320,
    borderRadius: 16,
    marginBottom: 40,
  },
  modalInfoContainer: {
    width: '100%',
    marginBottom: 30,
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: 'bold',
  },
  modalArtist: {
    color: '#8E8E93',
    fontSize: 18,
    marginTop: 4,
  },
  progressBarBackground: {
    width: '100%',
    height: 5,
    backgroundColor: '#333',
    borderRadius: 2.5,
    marginBottom: 40,
  },
  progressBarFill: {
    height: 5,
    backgroundColor: '#FFF',
    borderRadius: 2.5,
  },
  modalControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '70%',
  },
  modalPlayBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  }
});