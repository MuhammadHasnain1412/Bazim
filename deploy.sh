#!/bin/bash

# EC2 Deployment Script for Bazim Clothing

# Set variables
APP_DIR="/var/www/bazim-clothing"
REPO_URL="https://github.com/MuhammadHasnain1412/Bazim.git"

echo "Starting deployment..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Create app directory
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

# Clone repository
cd $APP_DIR
git clone $REPO_URL .

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Setup database
sudo mysql -e "CREATE DATABASE IF NOT EXISTS bazim_clothing;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'bazim_user'@'localhost' IDENTIFIED BY 'bazim_password_123';"
sudo mysql -e "GRANT ALL PRIVILEGES ON bazim_clothing.* TO 'bazim_user'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# Run database migrations
npx prisma db push
npm run db:seed

# Create production environment file
cat > .env << EOF
DATABASE_URL="mysql://bazim_user:bazim_password_123@localhost:3306/bazim_clothing"
NODE_ENV="production"
NEXTAUTH_SECRET="your_nextauth_secret_here"
NEXTAUTH_URL="http://$(curl -s ifconfig.me)"
EOF

# Build application
npm run build

# Start application with PM2
pm2 start npm --name "bazim-clothing" -- start
pm2 save
pm2 startup

# Setup Nginx reverse proxy
sudo tee /etc/nginx/sites-available/bazim-clothing << EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/bazim-clothing /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo "Deployment completed!"
echo "Visit http://$(curl -s ifconfig.me) to see your app"
