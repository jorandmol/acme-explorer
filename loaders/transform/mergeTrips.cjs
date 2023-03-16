const fs = require('fs');

// Read file path from command line argument
const stagesPath = process.argv[2];
const sponsorPath = process.argv[3];
const tripsPath = process.argv[4];

// Read contents of JSON file
const stagesFileContents = fs.readFileSync(stagesPath, 'utf8');
const sponsorFileContents = fs.readFileSync(sponsorPath, 'utf8');
const tripsFileContents = fs.readFileSync(tripsPath, 'utf8');

// Parse JSON data
const stagesJsonData = JSON.parse(stagesFileContents);
const sponsorJsonData = JSON.parse(sponsorFileContents);
const tripsJsonData = JSON.parse(tripsFileContents);

let availableStages = stagesJsonData;
let availableSponsors = sponsorJsonData;

tripsJsonData.forEach((trip) => {
    if (availableStages.length === 0) {
        // If no stages are available, reset the availableStages array to all stages
        availableStages = stagesJsonData;
    }
    
    if (availableStages.length > 0) {
        const stage = availableStages.shift(); // Get the first available stage and remove it from the array
        // remove stage id
        delete stage['_id'];
        trip.stages.push(stage);
    }
    
    if (availableSponsors.length === 0) {
        // If no sponsors are available, reset the availableSponsors array to all sponsors
        availableSponsors = sponsorJsonData;
    }
    
    if (availableSponsors.length > 0) {
        const sponsor = availableSponsors.shift(); // Get the first available sponsor and remove it from the array
        // remove sponsorship id
        delete sponsor['_id']
        trip.sponsorships.push(sponsor);
    }
    }
);

// Write modified data back to file
fs.writeFileSync(tripsPath, JSON.stringify(tripsJsonData, null, 2));

console.log('Finished processing file:', tripsPath);