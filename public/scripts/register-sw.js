if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/uv/uv.sw.js', {
        scope: '/service/'
      })
      .then(registration => {
        console.log('UV Service Worker registered:', registration);
      })
      .catch(err => {
        console.error('UV Service Worker registration failed:', err);
      });
  });
}
