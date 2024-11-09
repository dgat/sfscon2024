#!/bin/bash

wget https://download.geofabrik.de/europe/italy/nord-est-latest.osm.pbf
sudo docker run -t -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-extract -p /opt/car.lua /data/nord-est.osm.pbf || echo "osrm-extract failed"
sudo docker run -t -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-partition /data/nord-est-latest.osrm || echo "osrm-partition failed"
sudo docker run -t -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-customize /data/nord-est-latest.osrm || echo "osrm-customize failed"
sudo docker run -t -i -d -p 5000:5000 -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-routed --algorithm mld /data/berlin-latest.osrm