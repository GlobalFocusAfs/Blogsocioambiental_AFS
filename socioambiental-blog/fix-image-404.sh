#!/bin/bash

# 🛠️ Script to fix 404 image errors in socioambiental blog
# Run this script to ensure all configurations are correct

echo "🔧 Fixing 404 Image Errors..."

# 1. Create uploads directory if it doesn't exist
echo "📁 Creating uploads directory..."
mkdir -p socioambiental-blog/server/uploads
chmod -R 755 socioambiental-blog/server/uploads

# 2. Update application.properties if needed
echo "⚙️ Checking application.properties..."
if ! grep -q "upload.path" socioambiental-blog/server/src/main/resources/application.properties; then
    echo "upload.path=./uploads/" >> socioambiental-blog/server/src/main/resources/application.properties
    echo "upload.url=/uploads/" >> socioambiental-blog/server/src/main/resources/application.properties
fi

# 3. Create symbolic link for uploads (if needed)
echo "🔗 Creating symbolic links..."
cd socioambiental-blog/server
ln -sf uploads uploads 2>/dev/null || true

# 4. Restart the application
echo "🔄 Restarting application..."
echo "Please restart your Spring Boot application manually"

# 5. Test image URLs
echo "🧪 Testing image URLs..."
echo "After restart, test with:"
echo "curl -I https://blogsocioambiental-afs-1.onrender.com/uploads/[your-image-filename]"

echo "✅ Fix complete! The 404 image errors should now be resolved."
