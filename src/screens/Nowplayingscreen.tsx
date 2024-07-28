import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';

const API_KEY = '0c7e68cf8809f7116ec6f57671c3fd41';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const INITIAL_PAGE = 1;

const NowPlayingScreen = ({navigation}: any) => {
  const [movies, setMovies] = useState<any[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(INITIAL_PAGE);
  const [hasMore, setHasMore] = useState<boolean>(true); // Flag to check if more data is available

  useEffect(() => {
    const fetchMovies = async (page: number) => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.results.length > 0) {
          setMovies(prevMovies => [...prevMovies, ...data.results]);
          setFilteredMovies(prevMovies => [...prevMovies, ...data.results]);
          setHasMore(data.page < data.total_pages);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        setError(`Failed to fetch movies: ${(err as Error).message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies(currentPage);
  }, [currentPage]);

  const handleMoviePress = (movie: any) => {
    setSelectedMovie(movie);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMovie(null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filtered = movies.filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies(movies);
    }
  };

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  }, [loading, hasMore]);

  if (loading && currentPage === INITIAL_PAGE) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.centered} />
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Now Playing Movies</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search movies..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredMovies}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => handleMoviePress(item)}
            style={styles.movieContainer}>
            <Image
              source={{uri: `${IMAGE_BASE_URL}${item.poster_path}`}}
              style={styles.poster}
              resizeMode="cover"
            />
            <View style={styles.infoContainer}>
              <Text style={styles.movieTitle}>{item.title}</Text>
              <Text style={styles.movieOverview}>{item.overview}</Text>
              <Text style={styles.movieReleaseDate}>
                Release Date: {item.release_date}
              </Text>
              <Text style={styles.movieRating}>
                Rating: {item.vote_average}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          loading && hasMore ? (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              style={styles.centered}
            />
          ) : null
        }
      />
      {selectedMovie && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <View style={styles.modalImageContainer}>
                <Image
                  source={{
                    uri: `${IMAGE_BASE_URL}${selectedMovie.poster_path}`,
                  }}
                  style={styles.modalPoster}
                />
                <Pressable
                  style={styles.modalPlayButton}
                  onPress={() => console.log('Play pressed')}>
                  <Text style={styles.modalPlayButtonText}>▶</Text>
                </Pressable>
              </View>
              <Text style={styles.modalTitle}>{selectedMovie.title}</Text>
              <Text style={styles.modalReleaseDate}>
                Release Date: {selectedMovie.release_date}
              </Text>
              <Text style={styles.modalRating}>
                Rating: {selectedMovie.vote_average}
              </Text>
              <Text style={styles.modalOverview}>{selectedMovie.overview}</Text>
              <Pressable style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const {width} = Dimensions.get('window');
const posterWidth = width * 0.4; // Adjust poster width
const modalPosterHeight = width * 0.6; // Adjust modal poster height

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  movieContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 1,
    position: 'relative',
  },
  poster: {
    width: posterWidth,
    height: posterWidth * 1.5, // Maintain aspect ratio of posters
    borderRadius: 5,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  movieOverview: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  movieReleaseDate: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  movieRating: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  playButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
    padding: 10,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 600,
  },
  modalImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  modalPoster: {
    width: '100%',
    height: modalPosterHeight,
    borderRadius: 5,
  },
  modalPlayButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -25}, {translateY: -25}],
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
    padding: 15,
  },
  modalPlayButtonText: {
    color: '#fff',
    fontSize: 36,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalReleaseDate: {
    fontSize: 16,
    color: '#888',
  },
  modalRating: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 5,
  },
  modalOverview: {
    fontSize: 16,
    color: '#555',
    marginVertical: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default NowPlayingScreen;
