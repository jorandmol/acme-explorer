// cjs file that takes arg1 actors.json and arg2 finder.json
// replaces the explorer field of the finder.json with the _id of an actor with role explorer

const fs = require('fs');

// Read file path from command line argument
const actorsPath = process.argv[2];
const finderPath = process.argv[3];

// Read contents of JSON file
const actorsFileContents = fs.readFileSync(actorsPath, 'utf8');

// Parse JSON data
const actorsJsonData = JSON.parse(actorsFileContents);

// Read contents of JSON file
const finderFileContents = fs.readFileSync(finderPath, 'utf8');

// Parse JSON data
const finderJsonData = JSON.parse(finderFileContents);


let availableExplorers = actorsJsonData.filter(actor => actor.role === 'explorer');

finderJsonData.forEach((finder) => {
  if (availableExplorers.length === 0) {
    // If no explorers are available, reset the availableExplorers array to all explorers
    availableExplorers = actorsJsonData.filter(actor => actor.role === 'explorer');
  }

  if (availableExplorers.length > 0) {
    const explorer = availableExplorers.shift(); // Get the first available explorer and remove it from the array
    finder.explorer = explorer._id;
    explorer.role = 'used';
  }
});

// Reset used actors back to explorers
actorsJsonData.forEach(actor => {
  if (actor.role === 'used') {
    actor.role = 'explorer';
  }
});

// Write modified data back to file
fs.writeFileSync(finderPath, JSON.stringify(finderJsonData, null, 2));

console.log('Finished processing file:', finderPath);
