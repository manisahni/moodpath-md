#!/bin/bash

echo "🚀 Deploying MoodPath MD to GitHub Pages..."

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Make sure you're in the moodpath-md directory."
    exit 1
fi

# Create gh-pages branch if it doesn't exist
echo "📦 Creating gh-pages branch..."
git checkout -b gh-pages 2>/dev/null || git checkout gh-pages

# Copy all files to gh-pages branch
echo "📋 Copying files..."
git checkout main -- .
git add .
git commit -m "Deploy to GitHub Pages" 2>/dev/null || echo "No changes to commit"

# Push to gh-pages branch
echo "🚀 Pushing to GitHub..."
git push origin gh-pages

# Switch back to main branch
git checkout main

echo "✅ Deployment complete!"
echo "🌐 Your site will be available at: https://manisahni.github.io/moodpath-md/"
echo ""
echo "📝 Next steps:"
echo "1. Go to: https://github.com/manisahni/moodpath-md/settings/pages"
echo "2. Under 'Source', select 'Deploy from a branch'"
echo "3. Choose 'gh-pages' branch"
echo "4. Click 'Save'"
echo ""
echo "Your site will be live in a few minutes! 🎉"
