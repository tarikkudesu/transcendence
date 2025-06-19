#!bin/sh

sed -i 's/bind 127.0.0.1/bind 0.0.0.0/g' /etc/redis/redis.conf
sed -i 's/port 6379/port 9000/g' /etc/redis/redis.conf

echo "maxmemory 128mb\n" >> /etc/redis/redis.conf
echo "maxmemory-policy allkeys-lfu\n" >> /etc/redis/redis.conf
