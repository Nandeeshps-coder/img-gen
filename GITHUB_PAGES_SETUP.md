# GitHub Pages Setup with Secure API Key

## Step 1: Add Your API Key to GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Name: `HUGGINGFACE_API_KEY`
6. Value: `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`
7. Click **Add secret**

## Step 2: Enable GitHub Pages

1. In your repository, go to **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Save the settings

## Step 3: Deploy

1. Push your code to the `main` branch:
   ```bash
   git add .
   git commit -m "Setup GitHub Actions deployment"
   git push origin main
   ```

2. The GitHub Action will automatically:
   - Build your site with the secure API key
   - Deploy to GitHub Pages
   - Your site will be available at: `https://yourusername.github.io/repository-name/`

## How It Works

- ✅ Your API key stays secure in GitHub secrets
- ✅ The build process injects the real API key into `env.js`
- ✅ Users get a fully working app without seeing your API key
- ✅ Automatic deployment on every push to main branch

## Troubleshooting

If the deployment fails:
1. Check the **Actions** tab in your repository
2. Look at the build logs for any errors
3. Make sure the secret name is exactly `HUGGINGFACE_API_KEY`