// LocalStorage keys
const RAFFLE_CONFIG_KEY = 'raffleConfig';
const RAFFLE_DATA_KEY = 'raffleData';

// Save raffle configuration
export const saveRaffleConfig = (config) => {
  try {
    localStorage.setItem(RAFFLE_CONFIG_KEY, JSON.stringify(config));
    return true;
  } catch (error) {
    console.error('Error saving raffle config:', error);
    return false;
  }
};

// Load raffle configuration
export const loadRaffleConfig = () => {
  try {
    const data = localStorage.getItem(RAFFLE_CONFIG_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading raffle config:', error);
    return null;
  }
};

// Save raffle data (sales, winners, losers)
export const saveRaffleData = (data) => {
  try {
    // Convert Set to Array for storage
    const dataToSave = {
      ...data,
      unsoldNumbers: data.unsoldNumbers ? Array.from(data.unsoldNumbers) : []
    };
    localStorage.setItem(RAFFLE_DATA_KEY, JSON.stringify(dataToSave));
    return true;
  } catch (error) {
    console.error('Error saving raffle data:', error);
    return false;
  }
};

// Load raffle data
export const loadRaffleData = () => {
  try {
    const data = localStorage.getItem(RAFFLE_DATA_KEY);
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    // Convert Array back to Set
    return {
      ...parsed,
      unsoldNumbers: new Set(parsed.unsoldNumbers || [])
    };
  } catch (error) {
    console.error('Error loading raffle data:', error);
    return null;
  }
};

// Clear all raffle data
export const clearRaffleData = () => {
  try {
    localStorage.removeItem(RAFFLE_CONFIG_KEY);
    localStorage.removeItem(RAFFLE_DATA_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing raffle data:', error);
    return false;
  }
};

// Check if raffle exists
export const raffleExists = () => {
  return localStorage.getItem(RAFFLE_CONFIG_KEY) !== null;
};
