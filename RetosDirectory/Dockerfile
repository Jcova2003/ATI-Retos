FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    apache2 \
    python3 \
    python3-pip \
    curl \
    libapache2-mod-wsgi-py3

COPY . /var/www/html/

RUN a2enmod wsgi

COPY mod-wsgi.conf /etc/apache2/sites-available/000-default.conf

EXPOSE 80

CMD ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]
