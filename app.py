from flask import Flask, request, jsonify
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time
from PIL import Image
import io
import base64
import pytesseract
from googletrans import Translator

app = Flask(__name__)

@app.route('/screenshot', methods=['POST'])
def screenshot():
    url = request.json['url']
    options = Options()
    options.headless = True
    options.add_argument("--start-maximized")
    driver = webdriver.Chrome(options=options)
    driver.get(url)
    time.sleep(3)  # wait for the page to load completely
    screenshot = driver.get_screenshot_as_png()
    driver.quit()
    screenshot_b64 = base64.b64encode(screenshot).decode('utf-8')
    return jsonify({'screenshot': screenshot_b64})

@app.route('/translate', methods=['POST'])
def translate():
    image_b64 = request.json['image']
    image_data = base64.b64decode(image_b64)
    image = Image.open(io.BytesIO(image_data))
    # Perform OCR
    text = pytesseract.image_to_string(image)
    translator = Translator()
    translated_text = translator.translate(text, dest='en').text
    # Replace text in image
    image = image.convert("RGBA")
    txt = Image.new('RGBA', image.size, (255, 255, 255, 0))
    d = ImageDraw.Draw(txt)
    d.text((10,10), translated_text, fill=(0,0,0,255))
    combined = Image.alpha_composite(image, txt)
    buffered = io.BytesIO()
    combined.save(buffered, format="PNG")
    translated_image_b64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
    return jsonify({'translated_image': translated_image_b64})

if __name__ == '__main__':
    app.run(port=5000)
