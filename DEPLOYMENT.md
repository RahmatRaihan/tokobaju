# Deploying INSKYLXSTR to a VPS (Ubuntu, no Docker)

Stack in production: **Nginx** (TLS + static) → **Laravel Octane / FrankenPHP** (app worker) → **MySQL**.

---

## 0. Prerequisites on the VPS

- Ubuntu 22.04/24.04, a domain pointed at the server's IP.

> **DNS first (do this before certbot):** at your domain registrar, create two
> A records pointing to the VPS IP `103.247.11.234`:
> - `inskylxstr.com`      → `103.247.11.234`
> - `www.inskylxstr.com`  → `103.247.11.234`
>
> Wait for propagation (`ping www.inskylxstr.com` should return the VPS IP)
> before running certbot in step 7.
- Installed: **PHP 8.4** (cli) with extensions `pdo_mysql gd zip bcmath opcache pcntl sockets mbstring curl xml`, **Composer**, **Node 20+ / npm**, **MySQL 8**, **Nginx**, **certbot**.

```bash
sudo apt update
sudo apt install -y nginx mysql-server certbot python3-certbot-nginx \
    php8.4-cli php8.4-mysql php8.4-gd php8.4-zip php8.4-bcmath php8.4-mbstring \
    php8.4-curl php8.4-xml php8.4-opcache unzip git
# Composer
curl -sS https://getcomposer.org/installer | php && sudo mv composer.phar /usr/local/bin/composer
# Node
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs
```

---

## 1. Get the code

```bash
sudo mkdir -p /var/www/inskylxstr && sudo chown -R $USER:www-data /var/www/inskylxstr
git clone https://github.com/RahmatRaihan/tokobaju.git /var/www/inskylxstr
cd /var/www/inskylxstr
```

## 2. Configure environment

```bash
cp .env.production.example .env
nano .env          # fill APP_URL, DB_*, MAIL_*, ADMIN_* etc.
composer install --no-dev --optimize-autoloader
php artisan key:generate      # sets APP_KEY
```

## 3. Database

```bash
sudo mysql -e "CREATE DATABASE inskylxstr CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER 'inskylxstr'@'localhost' IDENTIFIED BY 'YOUR_STRONG_PASSWORD';"
sudo mysql -e "GRANT ALL ON inskylxstr.* TO 'inskylxstr'@'localhost'; FLUSH PRIVILEGES;"

php artisan migrate --force
php artisan db:seed --force          # creates admin from ADMIN_* env (prints password if blank)
php artisan storage:link
```

## 4. Build frontend & cache

```bash
npm ci
npm run build
php artisan config:cache && php artisan route:cache && php artisan event:cache && php artisan view:cache
```

## 5. Permissions

```bash
sudo chown -R www-data:www-data /var/www/inskylxstr/storage /var/www/inskylxstr/bootstrap/cache
sudo chmod -R 775 /var/www/inskylxstr/storage /var/www/inskylxstr/bootstrap/cache
```

## 6. Run Octane + queue via systemd

```bash
sudo cp deploy/inskylxstr-octane.service /etc/systemd/system/
sudo cp deploy/inskylxstr-queue.service  /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now inskylxstr-octane inskylxstr-queue
sudo systemctl status inskylxstr-octane
```

> First Octane start downloads the FrankenPHP binary automatically. If it fails,
> run `php artisan octane:install --server=frankenphp` once as the `www-data` user.

## 7. Nginx + HTTPS

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/inskylxstr
# edit server_name + paths in that file, then:
sudo ln -s /etc/nginx/sites-available/inskylxstr /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d inskylxstr.com -d www.inskylxstr.com
```

Visit **https://www.inskylxstr.com** — done.

---

## Updating after a `git push`

```bash
cd /var/www/inskylxstr
bash deploy/deploy.sh
```

This pulls, installs deps, rebuilds assets, migrates, re-caches, and gracefully
reloads Octane (zero downtime).

---

## Post-deploy checklist

- [ ] `APP_ENV=production`, `APP_DEBUG=false` in `.env`
- [ ] `APP_KEY` generated
- [ ] Real `MAIL_*` SMTP credentials set (OTP emails must actually send)
- [ ] Admin password changed from any default (log in and update)
- [ ] WhatsApp number set in **Admin → Settings** (format `62…`)
- [ ] Hero / About / Community / Gallery images uploaded
- [ ] HTTPS working, `http` redirects to `https`
- [ ] `sudo systemctl status inskylxstr-octane inskylxstr-queue` both active

## Notes

- **Cache after code changes:** always re-run the `deploy.sh` script; it re-caches
  config/routes and reloads Octane so changes take effect.
- **Docker files** (`docker-compose.yml`, `Dockerfile`) are for **local development
  only** and are not used in this VPS setup.
