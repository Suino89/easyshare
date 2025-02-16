const videoId = new URL(window.location.href).searchParams.get('video_id');
const tiktokUrlInput = document.getElementById('tiktokUrl');
const videoContainer = document.getElementById('videoContainer');
const shareBtn = document.getElementById('shareBtn');
const title = document.getElementById('title');
const audio = new Audio('assets/audio.mp3');

function extractVideoId(url) {
    try {
        const match = url.match(/(?:vm\.|www\.)?tiktok\.com\/(?:.*?video\/)?(\d+)/);
        return match ? match[1] : null;
    } catch (error) {
        console.error("Error extracting video ID", error);
        return null;
    }
}

function makePageUrl(videoId) {
    const pageUrl = new URL(window.location.href);
    pageUrl.searchParams.set('video_id', videoId);
    return pageUrl.toString();
}

function handleTikTokInput(event) {
    const url = event.target.value.trim();
    const currVideoId = extractVideoId(url);
    if (currVideoId) {
        showShareButton(currVideoId);
    }
}

function showShareButton(videoId) {
    shareBtn.innerText = "Condividi";
    shareBtn.style.display = 'block';
    shareBtn.onclick = async () => {
        try {
            const videoPageUrl = makePageUrl(videoId);
            await navigator.clipboard.writeText(videoPageUrl);
            shareBtn.innerText = "📋✅";
            if (navigator.share) { // Check if the device supports Web Share API
                await navigator.share({
                    title: 'Condividi',
                    url: videoPageUrl
                });
            }
            showNotification("Il link è stato copiato negli appunti.");
        } catch (error) {
            console.error("Sharing failed", error);
            showNotification("Errore nella condivisione. Riprova.");
        }
    };
}

function renderPlayer(videoId) {
    if (!videoId) return;
    videoContainer.innerHTML = `
        <iframe
            src="https://www.tiktok.com/player/v1/${videoId}?loop=1&rel=0&description=1&music_info=0"
            allow="fullscreen"
            scrolling="no"
        ></iframe>
    `;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.innerText = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = '#333';
    notification.style.color = 'white';
    notification.style.padding = '10px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}

// Main logic
document.getElementById('llm').addEventListener('click', () => audio.play());

if (!videoId) {
    tiktokUrlInput.addEventListener('input', handleTikTokInput);
} else {
    tiktokUrlInput.style.display = 'none';
    renderPlayer(videoId);
}
