const fs = require('fs');

function fixHtml(file, role) {
  let html = fs.readFileSync(file, 'utf-8');
  
  // Clean up any module scripts in the head
  html = html.replace(/<head>[\s\S]*?<\/head>/i, (head) => {
      return head.replace(/<script type="module">[\s\S]*?<\/script>/i, '');
  });
  
  // Now replace the main bottom script with a module link
  html = html.replace(/<script>[\s\S]*?const trips[\s\S]*?<\/script>/i, `<script type="module" src="/src/${role}.js"></script>`);
  
  fs.writeFileSync(file, html);
}

fixHtml('passenger.html', 'passenger');
fixHtml('admin.html', 'admin');
fixHtml('driver.html', 'driver');
