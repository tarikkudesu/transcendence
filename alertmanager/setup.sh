#!/bin/sh

cat << EOF > /etc/alertmanager/alertmanager.yml
global:
  smtp_smarthost: 'smtp.gmail.com:587'
  smtp_auth_username: $SMTP_USERNAME
  smtp_auth_password: $SMTP_PASSWORD
  smtp_from: $SMTP_FROM

route:
  receiver: 'gmail-notifications'

receivers:
  - name: 'gmail-notifications'
    email_configs:
      - to: $SMTP_USERNAME
        send_resolved: true
EOF

/bin/alertmanager --config.file=/etc/alertmanager/alertmanager.yml --web.external-url=$ALERT_EXTERNAL_URL
