const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/views/SalesModularPlatformView.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/Modulo/g, 'Soluzione');
content = content.replace(/modulo/g, 'soluzione');

fs.writeFileSync(filePath, content);
console.log('Done');
