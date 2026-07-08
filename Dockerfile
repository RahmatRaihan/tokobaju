# INSKYLXSTR app container — FrankenPHP (persistent worker) running Laravel Octane.
# FrankenPHP bundles PHP + the Caddy web server, so it serves static assets fast
# and keeps Laravel booted in memory between requests (huge speed-up vs artisan serve).
FROM dunglas/frankenphp:1-php8.4

# System deps for the PHP extensions we compile below.
RUN apt-get update && apt-get install -y --no-install-recommends \
        libzip-dev zip unzip \
        libpng-dev libjpeg-dev libfreetype6-dev \
        libonig-dev \
        default-mysql-client \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" pdo_mysql gd zip bcmath opcache pcntl sockets \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# OPcache tuned for a long-running worker.
RUN { \
        echo 'opcache.enable=1'; \
        echo 'opcache.enable_cli=1'; \
        echo 'opcache.memory_consumption=256'; \
        echo 'opcache.max_accelerated_files=20000'; \
        echo 'opcache.validate_timestamps=1'; \
        echo 'opcache.revalidate_freq=0'; \
    } > /usr/local/etc/php/conf.d/opcache.ini

# App PHP limits. Each must sit ABOVE the app-level rule it backs, otherwise PHP kills
# the request before Laravel's validation can return a readable error:
#   post_max_size    > several 10MB product images in one POST  (max:10240)
#   max_file_uploads > the 20-image batch rule                  (images -> max:20)
RUN { \
        echo 'memory_limit=512M'; \
        echo 'upload_max_filesize=12M'; \
        echo 'post_max_size=64M'; \
        echo 'max_file_uploads=30'; \
    } > /usr/local/etc/php/conf.d/app.ini

# Composer (copied from the official image).
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
