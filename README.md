# Kiro AI Studio

A professional AI image generation studio powered by Hugging Face's state-of-the-art models including FLUX.1 and Stable Diffusion XL. Optimized for GitHub Pages hosting.

## Features

- **Multiple AI Models**: FLUX.1 Schnell, FLUX.1 Dev, and Stable Diffusion XL
- **Flexible Dimensions**: Square, landscape, portrait, and standard aspect ratios
- **Batch Generation**: Generate up to 4 images at once
- **Professional UI**: Clean, modern interface optimized for creative workflows
- **High Quality**: Support for various resolutions up to 1344×768
- **Download Ready**: One-click download for all generated images
- **GitHub Pages Ready**: Pure frontend, no server required

## Quick Start for GitHub Pages

### 1. Setup Repository

1. **Fork or Clone** this repository
2. **Configure API Key**:
   - Edit `env.js` file
   - Replace `'your_huggingface_api_key_here'` with your actual API key:
     ```javascript
     window.ENV = {
         HUGGINGFACE_API_KEY: 'hf_your_actual_api_key_here'
     };
     ```

### 2. Deploy to GitHub Pages

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Setup for GitHub Pages"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

3. **Access Your Site**: Your site will be available at `https://yourusername.github.io/repository-name/img-gen/`

### 3. Getting a Hugging Face API Key

1. Visit [Hugging Face](https://huggingface.co)
2. Create an account or sign in
3. Go to Settings → Access Tokens
4. Create a new token with "Read" permissions
5. Copy the token to your `env.js` file

## File Structure

```
img-gen/
├── index.html          # Main HTML file
├── script.js           # JavaScript functionality
├── styles.css          # CSS styling
├── env.js              # Environment configuration
├── .env                # Environment variables (for reference)
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## Supported Models

- **FLUX.1 Schnell**: Fast generation, reliable results
- **FLUX.1 Dev**: Higher quality, slower generation
- **Stable Diffusion XL**: Classic model, good balance

## Usage Tips

1. **Start with FLUX.1 Schnell** - Most reliable for beginners
2. **Be descriptive** - Detailed prompts yield better results
3. **Try different aspect ratios** - Match your intended use case
4. **Batch generation** - Generate multiple variations efficiently

## Troubleshooting

### Common Issues

- **503 Model Loading**: Wait 1-2 minutes, models need to warm up
- **404 Model Not Found**: Try FLUX.1 Schnell instead
- **Rate Limits**: Wait between requests
- **Generation Fails**: Simplify your prompt

### Performance Tips

- Use FLUX.1 Schnell for fastest results
- Lower batch sizes for better reliability
- Standard dimensions (1024×1024) work best

## Security Options

### Option 1: User Input (Most Secure - Current Setup)
- Users enter their own API key in the app
- Key is stored locally in browser only
- No API key exposed in code
- Each user uses their own quota

### Option 2: GitHub Secrets + Actions (For Personal Use)
1. Go to repository Settings → Secrets and variables → Actions
2. Add secret: `HUGGINGFACE_API_KEY` with your API key
3. Push code - GitHub Actions will build and deploy automatically
4. API key stays secure in GitHub secrets

### Option 3: Backend Proxy (Most Professional)
- Create a simple backend API that proxies requests
- Deploy backend to Vercel/Netlify with environment variables
- Frontend calls your backend instead of Hugging Face directly

## Technical Details

- **Frontend**: Pure HTML/CSS/JavaScript (no build process required)
- **API**: Hugging Face Inference API
- **Hosting**: GitHub Pages compatible
- **No Backend**: Direct API calls from browser

## License

MIT License - feel free to use and modify for your projects.