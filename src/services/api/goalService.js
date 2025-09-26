class GoalService {
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "target_amount_c"}},
          {"field": {"Name": "current_amount_c"}},
          {"field": {"Name": "target_date_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.fetchRecords('goal_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Transform database field names to JavaScript property names
      const transformedData = (response.data || []).map(goal => ({
        ...goal,
        name: goal.name_c || goal.Name,
        currentAmount: goal.current_amount_c || 0,
        targetAmount: goal.target_amount_c || 0,
        targetDate: goal.target_date_c,
        createdAt: goal.created_at_c
      }));
      
      return transformedData;
    } catch (error) {
      console.error("Error fetching goals:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "target_amount_c"}},
          {"field": {"Name": "current_amount_c"}},
          {"field": {"Name": "target_date_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.getRecordById('goal_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      // Transform database field names to JavaScript property names
      if (response.data) {
        return {
          ...response.data,
          name: response.data.name_c || response.data.Name,
          currentAmount: response.data.current_amount_c || 0,
          targetAmount: response.data.target_amount_c || 0,
          targetDate: response.data.target_date_c,
          createdAt: response.data.created_at_c
        };
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching goal ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

async create(goalData) {
    try {
      const params = {
        records: [{
          Name: goalData.name_c || goalData.name,
          name_c: goalData.name_c || goalData.name,
          target_amount_c: goalData.target_amount_c || goalData.targetAmount,
          current_amount_c: goalData.current_amount_c || goalData.currentAmount || 0,
          target_date_c: goalData.target_date_c || goalData.targetDate,
          created_at_c: goalData.created_at_c || goalData.createdAt || new Date().toISOString()
        }]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.createRecord('goal_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} goals:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
            }
            if (record.message) console.error(record.message);
          });
        }
        
        // Transform returned data to match component expectations
        if (successful.length > 0 && successful[0].data) {
          const goal = successful[0].data;
          return {
            ...goal,
            name: goal.name_c || goal.Name,
            currentAmount: goal.current_amount_c || 0,
            targetAmount: goal.target_amount_c || 0,
            targetDate: goal.target_date_c,
            createdAt: goal.created_at_c
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating goal:", error?.response?.data?.message || error);
      return null;
    }
  }

async update(id, updateData) {
    try {
      const params = {
        records: [{
          Id: id,
          Name: updateData.name_c || updateData.name,
          name_c: updateData.name_c || updateData.name,
          target_amount_c: updateData.target_amount_c || updateData.targetAmount,
          current_amount_c: updateData.current_amount_c || updateData.currentAmount,
          target_date_c: updateData.target_date_c || updateData.targetDate
        }]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.updateRecord('goal_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} goals:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
            }
            if (record.message) console.error(record.message);
          });
        }
        
        // Transform returned data to match component expectations
        if (successful.length > 0 && successful[0].data) {
          const goal = successful[0].data;
          return {
            ...goal,
            name: goal.name_c || goal.Name,
            currentAmount: goal.current_amount_c || 0,
            targetAmount: goal.target_amount_c || 0,
            targetDate: goal.target_date_c,
            createdAt: goal.created_at_c
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating goal:", error?.response?.data?.message || error);
      return null;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [id]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.deleteRecord('goal_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} goals:`, failed);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        return successful.length === 1;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting goal:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export const goalService = new GoalService();