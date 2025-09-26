class BudgetService {
  constructor() {
    this.apperClient = null;
  }

  getApperClient() {
    if (!this.apperClient) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
    return this.apperClient;
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "limit_c"}},
          {"field": {"Name": "spent_c"}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "year_c"}}
        ]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.fetchRecords('budget_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching budgets:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "limit_c"}},
          {"field": {"Name": "spent_c"}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "year_c"}}
        ]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.getRecordById('budget_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching budget ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(budgetData) {
    try {
      const params = {
        records: [{
          Name: budgetData.category_c || budgetData.category,
          category_c: budgetData.category_c || budgetData.category,
          limit_c: budgetData.limit_c || budgetData.limit,
          spent_c: budgetData.spent_c || budgetData.spent || 0,
          month_c: budgetData.month_c || budgetData.month,
          year_c: budgetData.year_c || budgetData.year
        }]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.createRecord('budget_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} budgets:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
            }
            if (record.message) console.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating budget:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, updateData) {
    try {
      const params = {
        records: [{
          Id: id,
          Name: updateData.category_c || updateData.category,
          category_c: updateData.category_c || updateData.category,
          limit_c: updateData.limit_c || updateData.limit,
          spent_c: updateData.spent_c || updateData.spent,
          month_c: updateData.month_c || updateData.month,
          year_c: updateData.year_c || updateData.year
        }]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.updateRecord('budget_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} budgets:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
            }
            if (record.message) console.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating budget:", error?.response?.data?.message || error);
      return null;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [id]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.deleteRecord('budget_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} budgets:`, failed);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        return successful.length === 1;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting budget:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export const budgetService = new BudgetService();