#!/bin/bash

# Rehome Platform Backend Setup Script

echo "🏗️  Setting up Rehome Platform Backend..."
echo ""

# Check if PHP is available
if ! command -v php &> /dev/null; then
    echo "❌ PHP is not installed. Please install PHP 8.2 or higher."
    exit 1
fi

# Check PHP version
PHP_VERSION=$(php -r "echo PHP_MAJOR_VERSION.'.'.PHP_MINOR_VERSION;")
if [[ $(echo "$PHP_VERSION < 8.2" | bc -l) ]]; then
    echo "❌ PHP 8.2 or higher is required. Current version: $PHP_VERSION"
    exit 1
fi

echo "✅ PHP version $PHP_VERSION detected"

# Check if Composer is available
if ! command -v composer &> /dev/null; then
    echo "❌ Composer is not installed. Please install Composer."
    exit 1
fi

echo "✅ Composer detected"

# Install Laravel dependencies
echo ""
echo "📦 Installing Laravel dependencies..."
composer install --optimize-autoloader

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies."
    exit 1
fi

# Copy environment file
if [ ! -f ".env" ]; then
    echo ""
    echo "📄 Creating environment file..."
    cp .env.example .env
    echo "✅ Environment file created (.env)"
else
    echo "⚠️  Environment file already exists"
fi

# Generate application key
echo ""
echo "🔑 Generating application key..."
php artisan key:generate --ansi

# Create database file for SQLite (fallback)
if [ ! -f "database/database.sqlite" ]; then
    echo ""
    echo "📁 Creating SQLite database file..."
    touch database/database.sqlite
fi

# Ask user about database setup
echo ""
echo "🗄️  Database Configuration:"
echo "The .env file is configured for PostgreSQL by default."
echo "You can modify the database settings in the .env file:"
echo ""
echo "For PostgreSQL:"
echo "  DB_CONNECTION=pgsql"
echo "  DB_HOST=127.0.0.1"
echo "  DB_PORT=5432"
echo "  DB_DATABASE=rehome_platform"
echo "  DB_USERNAME=postgres"
echo "  DB_PASSWORD=your_password"
echo ""
echo "For SQLite (development):"
echo "  DB_CONNECTION=sqlite"
echo "  DB_DATABASE=/absolute/path/to/database/database.sqlite"
echo ""

read -p "Do you want to run migrations now? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🏗️  Running migrations..."
    php artisan migrate --graceful
    
    if [ $? -eq 0 ]; then
        echo "✅ Migrations completed successfully"
        
        read -p "Do you want to seed the database with test users? (y/n): " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo ""
            echo "🌱 Seeding database..."
            php artisan db:seed
            
            if [ $? -eq 0 ]; then
                echo "✅ Database seeded successfully"
                echo ""
                echo "Test Users Created:"
                echo "  Admin:           admin@rehome.com / password123"
                echo "  Project Manager: pm@rehome.com / password123"
                echo "  Team Member:     team@rehome.com / password123"
                echo "  Client:          client@rehome.com / password123"
            else
                echo "❌ Failed to seed database"
            fi
        fi
    else
        echo "❌ Migration failed. Please check your database configuration."
    fi
fi

echo ""
echo "🎉 Setup completed!"
echo ""
echo "Next steps:"
echo "1. Configure your database settings in .env if not done already"
echo "2. Run 'php artisan migrate' if you skipped migrations"
echo "3. Run 'php artisan db:seed' if you skipped seeding"
echo "4. Start the development server: 'php artisan serve'"
echo ""
echo "API will be available at: http://localhost:8000"
echo "Documentation: See API_DOCUMENTATION.md"
echo ""
echo "Happy coding! 🚀"