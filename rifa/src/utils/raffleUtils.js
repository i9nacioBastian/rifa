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
export function getAvailableNumbers(total, drawnNumbers, unsoldNumbers, losers) {
  const available = [];
  for (let i = 1; i <= total; i++) {
    if (!drawnNumbers.includes(i) && !unsoldNumbers.has(i) && !losers.includes(i)) {
      available.push(i);
    }
  }
  return available;
}

// Find participant name by number
export function findParticipantName(number, participants) {
  const participant = participants.find(p => p.number === parseInt(number));
  return participant ? participant.name : 'Desconocido';
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
