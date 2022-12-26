echo "Starting network..."

docker-compose -f docker-compose.yml up -d

sleep 30

echo "Network started"

echo "Following is the docker network....."

docker ps