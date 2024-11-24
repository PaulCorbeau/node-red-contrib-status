# Nodered Status

## Command
docker exec nodered bash -c "cd /data/ && npm install /usr/src/node-red/nodes/nodered-status" && docker stop nodered && docker start nodered