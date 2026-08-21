const fs = require('fs');

function addAuthOverlay(file) {
    let html = fs.readFileSync(file, 'utf-8');
    
    const overlay = `
    <!-- Auth Overlay -->
    <div id="auth-overlay" class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#fcfbf9]">
        <h1 class="text-3xl font-bold font-serif mb-6 text-[#29302a]">Authentication Required</h1>
        <button id="google-login-btn" class="flex items-center gap-3 px-6 py-3 bg-white border border-[#c4d1d1] shadow-sm rounded-xl text-[#2a2928] font-bold hover:shadow-md hover:border-[#b92f55] transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Sign in with Google
        </button>
    </div>
    `;
    
    // Check if body tag exists
    if (html.includes('<body')) {
        html = html.replace(/(<body[^>]*>)/i, '$1' + overlay);
    }
    
    fs.writeFileSync(file, html);
}

['admin.html', 'driver.html'].forEach(addAuthOverlay);
