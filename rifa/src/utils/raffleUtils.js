// Fisher-Yates shuffle algorithm
export function shuffle(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Get available numbers for raffle
export function getAvailableNumbers(total, drawnNumbers, unsoldNumbers, losers, soldNumbers = {}, isFinalized = false) {
  const available = [];
  
  // Helper to check if number is unavailable
  const isUnavailable = (num) => {
    if (unsoldNumbers instanceof Set) {
      return unsoldNumbers.has(num);
    }
    return Array.isArray(unsoldNumbers) && unsoldNumbers.includes(num);
  };

  if (isFinalized) {
    // If finalized, only consider SOLD numbers
    const sold = Object.keys(soldNumbers).map(Number);
    for (const num of sold) {
      if (!drawnNumbers.includes(num) && !losers.includes(num)) {
        available.push(num);
      }
    }
  } else {
    // If not finalized, consider all numbers except unavailable/drawn/losers
    for (let i = 1; i <= total; i++) {
      if (!drawnNumbers.includes(i) && !isUnavailable(i) && !losers.includes(i)) {
        available.push(i);
      }
    }
  }
  
  return available;
}

// Find participant name by number
export function findParticipantName(number, soldNumbers) {
  if (!soldNumbers || !soldNumbers[number]) return 'Desconocido';
  return soldNumbers[number].name;
}

// Generate sections of numbers (100 per section)
export function generateNumberSections(total) {
  const numbersPerSection = 100;
  const totalSections = Math.ceil(total / numbersPerSection);
  const sections = [];

  for (let section = 0; section < totalSections; section++) {
    const startNumber = section * numbersPerSection + 1;
    const endNumber = Math.min((section + 1) * numbersPerSection, total);
    const numbers = [];

    for (let i = startNumber; i <= endNumber; i++) {
      numbers.push(i);
    }

    sections.push({
      id: section,
      startNumber,
      endNumber,
      numbers
    });
  }

  return sections;
}
