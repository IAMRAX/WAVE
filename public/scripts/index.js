const form = document.getElementById('uv-form');
const address = document.getElementById('uv-address');
const searchEngine = document.getElementById('uv-search-engine');
const frame = document.getElementById('uv-frame');

if (form && address && frame) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        let url = address.value.trim();
        if (!url) return;
        
        // Check if it's a URL or search query
        if (!url.includes('.') || url.includes(' ')) {
            // It's a search query
            url = searchEngine.value.replace('%s', encodeURIComponent(url));
        } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
            // Add protocol if missing
            url = 'https://' + url;
        }
        
        // Register the service worker if not already registered
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('/uv/uv.sw.js', {
                    scope: '/service/'
                });
            } catch (error) {
                console.error('Service worker registration failed:', error);
            }
        }
        
        // Encode the URL for UV
        const encodedUrl = __uv$config.prefix + __uv$config.encodeUrl(url);
        
        // Show and load the frame
        frame.style.display = 'block';
        frame.src = encodedUrl;
    });
}
