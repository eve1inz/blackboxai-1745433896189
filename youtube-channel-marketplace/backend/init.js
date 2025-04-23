const fs = require('fs');
const path = require('path');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory:', uploadsDir);
}

// Ensure uploads directory has proper permissions
fs.chmodSync(uploadsDir, 0o755);
console.log('Set permissions for uploads directory');

console.log('Initialization complete');
