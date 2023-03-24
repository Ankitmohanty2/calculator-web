if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then((reg) => console.log('service worker registered'))
        .catch((err) => console.log('service worker not registered', err));
}

// theme toggler event listener
document.getElementById('themeSelect').addEventListener('change', (e) => {
    const theme = e.target.value
    changeTheme(theme)
})
document.getElementById('themeSelect').value = localStorage.getItem('theme')