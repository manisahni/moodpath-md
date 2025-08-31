#!/bin/bash

# Fix index.html - center Precision Tools and remove duplicates
echo "Fixing index.html..."

# Remove duplicate sections (keep only the first "Why Choose" and "Patient Stories" sections)
sed -i '' '/<!-- Why Choose MoodPath MD Section -->/,/<!-- Patient Stories Section -->/d' index.html

# Fix the Precision Tools box centering
sed -i '' 's/<div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 16px rgba(44, 95, 124, 0.1);">/<div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 16px rgba(44, 95, 124, 0.1); grid-column: 1 \/ -1; max-width: 400px; justify-self: center;">/' index.html

# Fix about.html - remove the CSS rule that centers the last approach card
echo "Fixing about.html..."
sed -i '' '/\.approach-grid \.approach-card:last-child {/,/}/d' about.html

# Fix phq9-tracker.html - center the severity box
echo "Fixing phq9-tracker.html..."
sed -i '' 's/\.score-severity {/\.score-severity {\n            text-align: center;\n            margin: 0 auto;/' phq9-tracker.html

echo "All centering fixes applied!"
