FROM prom/prometheus:latest

COPY --chmod=755 ./setup.sh /setup.sh

ENTRYPOINT ["/setup.sh"]
