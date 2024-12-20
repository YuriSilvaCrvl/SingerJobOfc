// src/services/RecommendationService.js
import StorageService from './StorageService';
import ArtistService from './ArtistService';
import OpportunityService from './OpportunityService';

class RecommendationService {
  static async getPersonalRecommendations() {
    try {
      // Buscar perfil do usuário logado
      const currentUser = await StorageService.getData('currentUser');
      
      if (!currentUser) {
        return [];
      }

      // Buscar todas as oportunidades
      const opportunities = await OpportunityService.getAllOpportunities();

      // Filtrar recomendações baseadas no perfil do usuário
      const recommendations = opportunities.filter(opportunity => 
        opportunity.artType === currentUser.primaryArtType ||
        opportunity.location === currentUser.location
      );

      // Ordenar por relevância (pode ser expandido com algoritmo mais complexo)
      return recommendations
        .sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted))
        .slice(0, 5); // Limitar a 5 recomendações
    } catch (error) {
      console.error('Erro ao buscar recomendações:', error);
      return [];
    }
  }

  static async getLatestRecommendations() {
    try {
      const opportunities = await OpportunityService.getAllOpportunities();
      
      return opportunities
        .sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted))
        .slice(0, 5);
    } catch (error) {
      console.error('Erro ao buscar últimas recomendações:', error);
      return [];
    }
  }
}

export default RecommendationService;