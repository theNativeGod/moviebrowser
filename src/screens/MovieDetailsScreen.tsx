import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const API_KEY = '0c7e68cf8809f7116ec6f57671c3fd41';
const URL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const MovieDetailsScreen = ({navigation}: any) => {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(URL);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setMovies(data.results);
      } catch (err) {
        setError(`Failed to fetch movies: ${(err as Error).message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
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

  const handleMoviePress = (movieId: number) => {
    navigation.navigate('MovieDetails', {movieId});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Popular Movies</Text>
      <FlatList
        data={movies}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handleMoviePress(item.id)}>
            <View style={styles.movieContainer}>
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
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const {width} = Dimensions.get('window');
const posterWidth = width * 0.4; // Adjust poster width

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
});

export default MovieDetailsScreen;
