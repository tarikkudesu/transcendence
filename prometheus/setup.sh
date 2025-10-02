#!/bin/sh

/bin/prometheus \
      --config.file=/etc/prometheus/prometheus.yml \
      --web.external-url=${PROMETHEUS_EXTERNAL_URL} \
      --storage.tsdb.retention.time=${PROMETHEUS_RETENTION}