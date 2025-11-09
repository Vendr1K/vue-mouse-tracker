import { MouseTracker } from './src/index.js'


const trackArea = document.getElementById('trackArea');


const BASE_URL = 'http://localhost:3000/save.php'
const BASE_CHECK_INTERVAL = 30
const BASE_SEND_INTERVAL = 3000



trackArea.addEventListener('mousemove', (e) => {
    const rect = trackArea.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    coordsDisplay.textContent = `X: ${x}, Y: ${y}`;
});


const tracker = new MouseTracker(trackArea, {
    url: BASE_URL,
    checkInterval: BASE_CHECK_INTERVAL,
    sendInterval: BASE_SEND_INTERVAL
});

tracker.start();
