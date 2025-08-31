#!/bin/bash

# Add the Transparent Pricing box after the Precision Tools box
sed -i '' '/🧬 Precision Tools/,/months of trial and error./a\
                <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 16px rgba(44, 95, 124, 0.1);">\
                    <h3 style="color: var(--ocean-blue); margin-bottom: 1rem;">💰 Transparent Pricing</h3>\
                    <p style="color: var(--warm-gray); line-height: 1.6;">No hidden fees or surprise bills. Clear upfront pricing: $249 initial consultation, $119 follow-ups, with optional $89/month membership plan.</p>\
                </div>' index.html

echo "Added Transparent Pricing box!"
