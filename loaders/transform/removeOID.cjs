// mockaroo generates a $oid field for each document 
// This loader removes the $oid field and sets the value of the field to the $oid value

const fs = require('fs');

// Read file path from command line argument
const filePath = process.argv[2];

// Read contents of JSON file
const fileContents = fs.readFileSync(filePath, 'utf8');

// Parse JSON data
const jsonData = JSON.parse(fileContents);

// Iterate over each document in the array
jsonData.forEach((doc) => {
  // Iterate over each field in the document
  Object.keys(doc).forEach((key) => {
    // Check if the field contains a $oid subfield
    if (doc[key] && typeof doc[key] === 'object' && doc[key].$oid) {
      // Remove the $oid subfield and set the value of the field to the $oid value
      doc[key] = doc[key].$oid;
    }
  });
});

// Write modified data back to file
fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

console.log('Finished processing file:', filePath);