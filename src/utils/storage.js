// Local Storage Management for CodeChrono IDE
export const STORAGE_KEYS = {
  TASKS: 'codechrono_tasks',
  LOGS: 'codechrono_logs',
  AGENTS: 'codechrono_agents',
  PROJECTS: 'codechrono_projects',
  CODE_SESSIONS: 'codechrono_code_sessions',
  USER_PROFILE: 'codechrono_user_profile'
};

export const storageManager = {
  // Get data from localStorage
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return null;
    }
  },

  // Set data to localStorage
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key} to localStorage:`, error);
    }
  },

  // Add item to array in localStorage
  addToArray: (key, item) => {
    const existingData = storageManager.get(key) || [];
    const newData = [...existingData, { ...item, id: Date.now() + Math.random(), timestamp: new Date().toISOString() }];
    storageManager.set(key, newData);
    return newData;
  },

  // Update item in array
  updateInArray: (key, id, updates) => {
    const existingData = storageManager.get(key) || [];
    const updatedData = existingData.map(item => 
      item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
    );
    storageManager.set(key, updatedData);
    return updatedData;
  },

  // Remove item from array
  removeFromArray: (key, id) => {
    const existingData = storageManager.get(key) || [];
    const filteredData = existingData.filter(item => item.id !== id);
    storageManager.set(key, filteredData);
    return filteredData;
  },

  // Export all data as JSON
  exportAllData: () => {
    const allData = {};
    Object.values(STORAGE_KEYS).forEach(key => {
      allData[key] = storageManager.get(key);
    });
    return allData;
  },

  // Clear all data
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};
