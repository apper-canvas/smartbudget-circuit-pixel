class CategoryService {
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
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "is_default_c"}}
        ]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.fetchRecords('category_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching categories:", error?.response?.data?.message || error);
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
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "is_default_c"}}
        ]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.getRecordById('category_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(categoryData) {
    try {
      const params = {
        records: [{
          Name: categoryData.name_c || categoryData.name,
          name_c: categoryData.name_c || categoryData.name,
          type_c: categoryData.type_c || categoryData.type,
          color_c: categoryData.color_c || categoryData.color,
          is_default_c: categoryData.is_default_c !== undefined ? categoryData.is_default_c : (categoryData.isDefault || false)
        }]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.createRecord('category_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} categories:`, failed);
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
      console.error("Error creating category:", error?.response?.data?.message || error);
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
          type_c: updateData.type_c || updateData.type,
          color_c: updateData.color_c || updateData.color,
          is_default_c: updateData.is_default_c !== undefined ? updateData.is_default_c : updateData.isDefault
        }]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.updateRecord('category_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} categories:`, failed);
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
      console.error("Error updating category:", error?.response?.data?.message || error);
      return null;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [id]
      };
      
      const apperClient = this.getApperClient();
      const response = await apperClient.deleteRecord('category_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} categories:`, failed);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        return successful.length === 1;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting category:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export const categoryService = new CategoryService();