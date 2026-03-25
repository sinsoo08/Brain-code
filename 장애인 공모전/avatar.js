const handleOnError = (el) => {
    el.style.display = 'none';
    el.nextElementSibling.style.display = 'block';
};

let selectedAvatar = null;

document.querySelectorAll('.avatar-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.avatar-item').forEach(a => a.classList.remove('selected'));
        item.classList.add('selected');
        selectedAvatar = item.dataset.src;

        const previewWrap        = document.getElementById('preview-wrap');
        const previewPlaceholder = document.getElementById('preview-placeholder');
        const previewSelected    = document.getElementById('preview-selected');
        const previewImg         = document.getElementById('preview-img');
        const previewEmoji       = document.getElementById('preview-emoji');
        const previewName        = document.getElementById('preview-name');

        previewPlaceholder.style.display = 'none';
        previewSelected.style.display    = 'flex';
        previewWrap.classList.add('has-selection');
        previewName.textContent          = item.dataset.name;

        const gridImg = item.querySelector('.avatar-img-wrap img');
        if (gridImg.style.display === 'none') {
            previewImg.style.display   = 'none';
            previewEmoji.style.display = 'block';
            previewEmoji.textContent   = item.dataset.emoji;
        } else {
            previewImg.src             = item.dataset.src;
            previewImg.style.display   = 'block';
            previewEmoji.style.display = 'none';
        }
    });
});

function handleSubmit() {
    if (!selectedAvatar) { alert('캐릭터를 선택해 주세요.'); return; }

    const name      = sessionStorage.getItem('kidName');
    const birthYear = sessionStorage.getItem('kidBirthYear');
    const birthDate = sessionStorage.getItem('kidBirthDate');

    fetch('/save-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, birthYear, birthDate, avatar: selectedAvatar })
    }).catch(() => {});

    location.href = 'profile.html';
}