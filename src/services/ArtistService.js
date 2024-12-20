import StorageService from './StorageService';

class ArtistService {
  static async getAllArtists() {
    try {
      const artists = await StorageService.getData('artists');
      return artists || [];
    } catch (error) {
      console.error('Erro ao buscar artistas:', error);
      return [];
    }
  }

  static async searchArtists(query) {
    const artists = await this.getAllArtists();
    return artists.filter(artist => 
      artist.name.toLowerCase().includes(query.toLowerCase()) ||
      artist.artType.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export default ArtistService;