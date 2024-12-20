// src/services/OpportunityService.js
import StorageService from './StorageService';

class OpportunityService {
  static async getAllOpportunities() {
    try {
      const opportunities = await StorageService.getData('opportunities');
      return opportunities || [];
    } catch (error) {
      console.error('Erro ao buscar oportunidades:', error);
      return [];
    }
  }

  static async saveOpportunity(opportunityId) {
    try {
      const savedOpportunities = await StorageService.getData('savedOpportunities') || [];
      
      if (savedOpportunities.includes(opportunityId)) {
        // Remover se já estiver salvo
        const updatedSaved = savedOpportunities.filter(id => id !== opportunityId);
        await StorageService.saveData('savedOpportunities', updatedSaved);
        return false;
      } else {
        // Adicionar aos salvos
        const updatedSaved = [...savedOpportunities, opportunityId];
        await StorageService.saveData('savedOpportunities', updatedSaved);
        return true;
      }
    } catch (error) {
      console.error('Erro ao salvar oportunidade:', error);
      return false;
    }
  }

  static async searchOpportunities(query) {
    const opportunities = await this.getAllOpportunities();
    return opportunities.filter(opp => 
      opp.title.toLowerCase().includes(query.toLowerCase()) ||
      opp.description.toLowerCase().includes(query.toLowerCase()) ||
      opp.artType.toLowerCase().includes(query.toLowerCase())
    );
  }

  static async filterOpportunities(filters) {
    const opportunities = await this.getAllOpportunities();
    
    return opportunities.filter(opp => {
      // Filtro por tipo de arte
      if (filters.artTypes && filters.artTypes.length > 0) {
        if (!filters.artTypes.includes(opp.artType)) return false;
      }

      // Filtro por localização
      if (filters.locations && filters.locations.length > 0) {
        if (!filters.locations.includes(opp.location)) return false;
      }

      // Filtro por faixa de pagamento
      if (filters.minPayment) {
        if (opp.paymentRange.min < filters.minPayment) return false;
      }

      return true;
    });
  }
}

export default OpportunityService;