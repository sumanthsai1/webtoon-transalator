document.getElementById('url-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = document.getElementById('url-input').value;
    const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
    });
    const data = await response.json();
    const img = document.getElementById('screenshot');
    img.src = `data:image/png;base64,${data.screenshot}`;
    document.getElementById('screenshot-container').style.display = 'block';
    const cropper = new Cropper(img, {
        aspectRatio: 16 / 9,
        autoCropArea: 1,
        viewMode: 1
    });
    document.getElementById('crop-button').addEventListener('click', () => {
        const croppedCanvas = cropper.getCroppedCanvas();
        const croppedImage = croppedCanvas.toDataURL();
        document.getElementById('translate-button').style.display = 'block';
        document.getElementById('translate-button').addEventListener('click', async () => {
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: croppedImage.split(',')[1] })
            });
            const data = await response.json();
            document.getElementById('translated-image').src = `data:image/png;base64,${data.translated_image}`;
            document.getElementById('translated-container').style.display = 'block';
        });
    });
});
