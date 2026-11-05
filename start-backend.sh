#!/usr/bin/env bash
# Starts the PHP API on http://localhost:8000 from the PROJECT ROOT (the folder this file is in),
# no matter where you run it from. Run it with:  ./start-backend.sh
cd "$(dirname "$0")" || exit 1
exec php -d upload_max_filesize=50M -d post_max_size=55M -S localhost:8000
