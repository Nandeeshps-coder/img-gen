// Configuration
const HF_API_URL = 'https://api-inference.huggingface.co/models/';

// Get API key from localStorage or prompt user
function getApiKey() {
    let apiKey = localStorage.getItem('hf_api_key');
    if (!apiKey || apiKey === 'your_api_key_here') {
        apiKey = prompt('Please enter your Hugging Face API key:\n\nGet one free at: https://huggingface.co/settings/tokens');
        if (apiKey) {
            localStorage.setItem('hf_api_key', apiKey);
        }
    }
    return apiKey;
}

// DOM elements
const form = document.getElementById('imageForm');
const results = document.getElementById('results');
const numImagesSlider = document.getElementById('numImages');
const numImagesValue = document.getElementById('numImagesValue');
const generateBtn = document.getElementById('generateBtn');
const status = document.getElementById('status');

// Update number display
numImagesSlider.addEventListener('input', function () {
    numImagesValue.textContent = this.value;
});

// Parse dimensions from aspect ratio value
function parseDimensions(dimensionString) {
    const [width, height] = dimensionString.split('x').map(Number);
    return { width, height };
}

// Generate image using Hugging Face API with proper dimensions
async function generateImage(prompt, model, dimensions) {
    const apiKey = getApiKey();
    if (!apiKey) {
        throw new Error('API key is required. Please refresh and enter your Hugging Face API key.');
    }

    const requestBody = {
        inputs: prompt,
        parameters: {
            width: dimensions.width,
            height: dimensions.height,
            num_inference_steps: 20,
            guidance_scale: 7.5
        }
    };

    const response = await fetch(HF_API_URL + model, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
        } catch (e) {
            if (response.status === 404) {
                errorMessage = `Model "${model}" not found or not available.`;
            } else if (response.status === 503) {
                errorMessage = `Model is loading. Please wait 1-2 minutes and try again.`;
            } else {
                errorMessage = `${response.status}: ${response.statusText}`;
            }
        }
        throw new Error(errorMessage);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
}

// Update status
function updateStatus(message, type = 'info') {
    status.textContent = message;
    status.className = `status ${type}`;
}

// Handle form submission
form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const prompt = document.getElementById('prompt').value.trim();
    const selectedModel = document.querySelector('input[name="model"]:checked');
    const selectedAspect = document.querySelector('input[name="aspectRatio"]:checked');
    const numImages = parseInt(numImagesSlider.value);

    if (!prompt || !selectedModel || !selectedAspect) {
        alert('Please fill in all required fields');
        return;
    }

    const model = selectedModel.value;
    const dimensions = parseDimensions(selectedAspect.value);

    // Show loading state
    generateBtn.disabled = true;
    generateBtn.innerHTML = `
        <span class="btn-text">Generating...</span>
        <div class="spinner" style="width: 16px; height: 16px; margin: 0;"></div>
    `;

    updateStatus(`Generating ${numImages} image${numImages > 1 ? 's' : ''}...`, 'loading');

    results.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <h3>Creating your images...</h3>
            <p>Using ${model.split('/').pop()} at ${dimensions.width}×${dimensions.height}</p>
        </div>
    `;

    try {
        const imagePromises = [];
        for (let i = 0; i < numImages; i++) {
            imagePromises.push(generateImage(prompt, model, dimensions));
        }

        const imageUrls = await Promise.all(imagePromises);

        // Display results
        let gridHTML = '<div class="success"><h3>✅ Images Generated Successfully!</h3></div>';
        gridHTML += '<div class="image-grid">';

        imageUrls.forEach((url, index) => {
            gridHTML += `
                <div class="image-item">
                    <img src="${url}" alt="Generated image ${index + 1}" loading="lazy">
                    <div class="image-info">
                        <h4>Image ${index + 1}</h4>
                        <p><strong>Model:</strong> ${model.split('/').pop()}</p>
                        <p><strong>Dimensions:</strong> ${dimensions.width}×${dimensions.height}</p>
                        <p><strong>Prompt:</strong> ${prompt.substring(0, 60)}${prompt.length > 60 ? '...' : ''}</p>
                        <button class="download-btn" onclick="downloadImage('${url}', 'kiro-ai-${index + 1}-${dimensions.width}x${dimensions.height}.png')">
                            Download Image
                        </button>
                    </div>
                </div>
            `;
        });

        gridHTML += '</div>';
        results.innerHTML = gridHTML;
        updateStatus(`Generated ${numImages} image${numImages > 1 ? 's' : ''} successfully`, 'success');

    } catch (error) {
        console.error('Generation error:', error);
        results.innerHTML = `
            <div class="error">
                <h3>❌ Generation Failed</h3>
                <p><strong>Error:</strong> ${error.message}</p>
                <p><strong>Recommendation:</strong> Try using <strong>FLUX.1 Schnell</strong> - it's the most reliable model.</p>
                <div style="margin-top: 12px;">
                    <strong>Common solutions:</strong>
                    <ul style="margin: 8px 0; padding-left: 20px;">
                        <li>Model loading (503): Wait 1-2 minutes and retry</li>
                        <li>Model not found (404): Use FLUX.1 Schnell instead</li>
                        <li>Rate limits: Wait a moment before trying again</li>
                        <li>Invalid prompt: Try a simpler description</li>
                    </ul>
                </div>
            </div>
        `;
        updateStatus('Generation failed', 'error');
    } finally {
        generateBtn.disabled = false;
        generateBtn.innerHTML = `
            <span class="btn-text">Generate Images</span>
            <span class="btn-icon">✨</span>
        `;
    }
});

// Download function
function downloadImage(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// API Key management
const apiKeyInput = document.getElementById('apiKey');
const saveApiKeyBtn = document.getElementById('saveApiKey');
const clearApiKeyBtn = document.getElementById('clearApiKey');

// Load saved API key on page load
function loadSavedApiKey() {
    const savedKey = localStorage.getItem('hf_api_key');
    if (savedKey && savedKey !== 'your_api_key_here') {
        apiKeyInput.value = savedKey;
        updateStatus('API key loaded', 'success');
    } else {
        updateStatus('Please enter your API key', 'info');
    }
}

// Save API key
saveApiKeyBtn.addEventListener('click', function() {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
        localStorage.setItem('hf_api_key', apiKey);
        updateStatus('API key saved', 'success');
    } else {
        alert('Please enter a valid API key');
    }
});

// Clear API key
clearApiKeyBtn.addEventListener('click', function() {
    localStorage.removeItem('hf_api_key');
    apiKeyInput.value = '';
    updateStatus('API key cleared', 'info');
});

// Update getApiKey function to use env.js first, then input field
function getApiKey() {
    // Try to get from env.js first
    let apiKey = window.ENV?.HUGGINGFACE_API_KEY;
    
    // If not available or placeholder, try input field or localStorage
    if (!apiKey || apiKey === 'PLACEHOLDER_WILL_BE_REPLACED_DURING_BUILD') {
        apiKey = apiKeyInput.value.trim() || localStorage.getItem('hf_api_key');
    }
    
    if (!apiKey || apiKey === 'your_api_key_here') {
        updateStatus('Please enter your API key above', 'error');
        return null;
    }
    return apiKey;
}

// Initialize
loadSavedApiKey();