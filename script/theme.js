
const savedTheme = localStorage.getItem('theme');
(savedTheme) && changeTheme(savedTheme);
savedTheme || addThemeEventListener();
savedTheme || changeTheme('system');

function changeTheme(theme) {
    localStorage.setItem('theme', theme)

    const newTheme = theme !== 'system' ? theme :
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");

    (newTheme === 'dark') ?
        document.documentElement.classList.add('dark')
        : document.documentElement.classList.remove('dark');
}

function themeEventHandler(e) {
    changeTheme(e.matches ? "dark" : "light")
}
function addThemeEventListener() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', themeEventHandler);
}
function removeThemeEventListener() {
    window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', themeEventHandler);
}