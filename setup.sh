#!/bin/bash

# Rehome Platform Development Setup Script
echo "🚀 Setting up Rehome Platform development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if required tools are installed
check_requirements() {
    echo -e "${BLUE}Checking system requirements...${NC}"
    
    if ! command -v php &> /dev/null; then
        echo -e "${RED}❌ PHP is not installed. Please install PHP 8.2 or later.${NC}"
        exit 1
    fi
    
    if ! command -v composer &> /dev/null; then
        echo -e "${RED}❌ Composer is not installed. Please install Composer.${NC}"
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18 or later.${NC}"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm is not installed. Please install npm.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All required tools are installed!${NC}"
}

# Setup backend
setup_backend() {
    echo -e "${BLUE}Setting up Laravel backend...${NC}"
    cd backend
    
    # Install dependencies
    echo -e "${YELLOW}Installing PHP dependencies...${NC}"
    composer install
    
    # Setup environment
    if [ ! -f .env ]; then
        echo -e "${YELLOW}Creating environment file...${NC}"
        cp .env.example .env
    fi
    
    # Generate application key
    echo -e "${YELLOW}Generating application key...${NC}"
    php artisan key:generate
    
    # Setup database (if PostgreSQL is available)
    echo -e "${YELLOW}Setting up database...${NC}"
    if command -v psql &> /dev/null; then
        php artisan migrate --force
        echo -e "${GREEN}✅ Database migrations completed!${NC}"
    else
        echo -e "${YELLOW}⚠️  PostgreSQL not found. Please setup database manually.${NC}"
    fi
    
    cd ..
}

# Setup frontend
setup_frontend() {
    echo -e "${BLUE}Setting up Next.js frontend...${NC}"
    cd frontend
    
    # Install dependencies
    echo -e "${YELLOW}Installing Node.js dependencies...${NC}"
    npm install
    
    # Setup environment
    if [ ! -f .env.local ]; then
        echo -e "${YELLOW}Creating frontend environment file...${NC}"
        cp .env.local.example .env.local
    fi
    
    cd ..
}

# Main setup function
main() {
    echo -e "${GREEN}"
    echo "=================================================="
    echo "       Rehome Platform Development Setup"
    echo "=================================================="
    echo -e "${NC}"
    
    check_requirements
    setup_backend
    setup_frontend
    
    echo -e "${GREEN}"
    echo "=================================================="
    echo "           Setup Complete! 🎉"
    echo "=================================================="
    echo -e "${NC}"
    
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Configure your database settings in backend/.env"
    echo "2. Start the backend: cd backend && php artisan serve"
    echo "3. Start the frontend: cd frontend && npm run dev"
    echo "4. Visit http://localhost:3000 to see the application"
    echo ""
    echo -e "${YELLOW}For Docker deployment:${NC}"
    echo "Run: docker-compose up -d"
    echo ""
    echo -e "${GREEN}Happy coding! 🚀${NC}"
}

# Run main function
main