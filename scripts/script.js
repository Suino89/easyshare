const videoId = new URL(window.location.href).searchParams.get('video_id');
const tiktokUrlInput = document.getElementById('tiktokUrl');
const videoContainer = document.getElementById('videoContainer');
const shareBtn = document.getElementById('shareBtn');
const title = document.getElementById('title');
const audio = new Audio('assets/audio.mp3');

function extractVideoId(url) {
    const match = url.match(/(?:vm\.|www\.)?tiktok\.com\/(?:.*?video\/)?(\d+)/);
    return match ? match[1] : null;
}

function updatePageUrl(videoId) {
    const pageUrl = new URL(window.location.href);
    pageUrl.searchParams.set('video_id', videoId);
    window.history.replaceState(null, '', pageUrl); // Updates URL without refresh
    return pageUrl.toString();
}

function handleTikTokInput(event) {
    const url = event.target.value.trim();
    const currVideoId = extractVideoId(url);
    if (currVideoId) {
        updatePageUrl(currVideoId);
        showShareButton(currVideoId);
    }
}

function showShareButton(videoId) {
    shareBtn.innerText = "Condividi";
    shareBtn.style.display = 'block';
    shareBtn.onclick = async () => {
        const pageUrl = updatePageUrl(videoId);
        await navigator.clipboard.writeText(pageUrl);
        shareBtn.innerText = "Copiato✔️";
        renderPlayer(videoId);
    };
}

function renderPlayer(videoId) {
    videoContainer.innerHTML = `
        <iframe
            src="https://www.tiktok.com/player/v1/${videoId}?loop=1&rel=0&description=1&music_info=1"
            allow="fullscreen"
            scrolling="no"
        ></iframe>
    `;
}

// Main logic
document.getElementById('llm').addEventListener('click', () => audio.play());

if (!videoId) {
    tiktokUrlInput.addEventListener('input', handleTikTokInput);
} else {
    tiktokUrlInput.style.display = 'none';
    renderPlayer(videoId);
}
