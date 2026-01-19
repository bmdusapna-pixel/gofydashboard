# Vercel Deployment Guide for Dashboard

## ✅ Fixed Configuration

The configuration has been updated to work with Vercel. Here's what was changed:

1. **vite.config.js** - Now uses environment variable for base path (defaults to `/`)
2. **main.jsx** - BrowserRouter basename matches the base path
3. **vercel.json** - Proper SPA routing configuration

## 🚀 Deployment Steps

### Step 1: Push to GitHub/GitLab/Bitbucket

Make sure your `dashboard` folder is in a repository.

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your repository
4. **Important Settings:**
   - **Root Directory**: Set to `dashboard` (if your repo has multiple folders)
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `dist` (should auto-detect)
   - **Install Command**: `npm install`

### Step 3: Set Environment Variables

In Vercel project settings → **Environment Variables**, add:

```
VITE_BASE_URL=https://your-backend-api-url.com/api
```

**Important:** 
- Replace `https://your-backend-api-url.com/api` with your actual backend API URL
- Make sure to add this for **Production**, **Preview**, and **Development** environments
- The URL should point to your backend API (e.g., `https://your-backend.vercel.app/api` or your custom domain)

### Step 4: Deploy

Click **"Deploy"** and wait for the build to complete.

## 🔧 Optional: Deploy to `/admin` Subpath

If you want the dashboard at `yourdomain.com/admin` instead of root:

1. In Vercel → **Environment Variables**, add:
   ```
   VITE_BASE_PATH=/admin
   ```

2. Update `vercel.json`:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "rewrites": [
       {
         "source": "/admin/:path*",
         "destination": "/admin/index.html"
       },
       {
         "source": "/admin",
         "destination": "/admin/index.html"
       }
     ]
   }
   ```

## 🐛 Troubleshooting Blank Page

### Check Browser Console

Open browser DevTools (F12) and check:
- **Console tab**: Look for JavaScript errors
- **Network tab**: Check if assets are loading (look for 404s)

### Common Issues:

1. **Missing Environment Variable**
   - Error: `VITE_BASE_URL is undefined`
   - Fix: Add `VITE_BASE_URL` in Vercel environment variables

2. **API CORS Issues**
   - Error: `CORS policy` errors in console
   - Fix: Ensure your backend allows requests from your Vercel domain

3. **Build Errors**
   - Check Vercel build logs for errors
   - Make sure all dependencies are in `package.json`

4. **Asset Path Issues**
   - If assets show 404, check that `base` in `vite.config.js` matches your deployment path

5. **Routing Issues**
   - Ensure `vercel.json` has the correct rewrites for SPA routing

## 📝 Quick Checklist

- [ ] Code pushed to repository
- [ ] Vercel project created
- [ ] Root directory set to `dashboard` (if needed)
- [ ] `VITE_BASE_URL` environment variable set
- [ ] Build completes successfully
- [ ] No console errors in browser
- [ ] API calls working (check Network tab)

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
