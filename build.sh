New-Item -Path . -Name "build.sh" -ItemType "file" -Value @'
#!/bin/bash
apt-get update && apt-get install -y \
  libgbm-dev \
  libasound2 \
  libnss3 \
  libxss1 \
  libappindicator3-1 \
  fonts-liberation \
  libatk-bridge2.0-0 \
  libgtk-3-0
'@
