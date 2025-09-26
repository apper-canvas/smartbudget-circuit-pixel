class TransactionService {
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
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.fetchRecords('transaction_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Normalize field names for UI consumption
      const normalizedData = (response.data || []).map(transaction => ({
        Id: transaction.Id,
        Name: transaction.Name,
        amount: transaction.amount_c,
        type: transaction.type_c,
        category: transaction.category_c,
        description: transaction.description_c,
        date: transaction.date_c,
        createdAt: transaction.created_at_c
      }));
      
      return normalizedData;
    } catch (error) {
      console.error("Error fetching transactions:", error?.response?.data?.message || error);
      return [];
    }
  }

async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.getRecordById('transaction_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      // Normalize field names for UI consumption
      if (response.data) {
        return {
          Id: response.data.Id,
          Name: response.data.Name,
          amount: response.data.amount_c,
          type: response.data.type_c,
          category: response.data.category_c,
          description: response.data.description_c,
          date: response.data.date_c,
          createdAt: response.data.created_at_c
        };
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching transaction ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(transactionData) {
    try {
      const params = {
records: [{
          Name: transactionData.description,
          amount_c: transactionData.amount,
          type_c: transactionData.type,
          category_c: transactionData.category,
          description_c: transactionData.description,
          date_c: transactionData.date,
          created_at_c: transactionData.created_at_c || transactionData.createdAt || new Date().toISOString()
        }]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.createRecord('transaction_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} transactions:`, failed);
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
      console.error("Error creating transaction:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, updateData) {
    try {
      const params = {
        records: [{
          Id: id,
          Name: updateData.description_c || updateData.description,
          amount_c: updateData.amount_c || updateData.amount,
type_c: updateData.type,
          category_c: updateData.category,
          description_c: updateData.description,
          date_c: updateData.date
        }]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.updateRecord('transaction_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} transactions:`, failed);
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
      console.error("Error updating transaction:", error?.response?.data?.message || error);
      return null;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [id]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.deleteRecord('transaction_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} transactions:`, failed);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        return successful.length === 1;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting transaction:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export const transactionService = new TransactionService();