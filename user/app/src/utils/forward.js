export const forward = async (host, _, reply, config) => {
    try {
     const res = await fetch(host, config);
        res.headers.forEach((value, key) => {
            reply.header(key, value);
        });
        let status = res.status
        let response = await res.json();
        reply.status(status).send(response);
    } catch (err) {
        console.log(err);
        reply.status(503).send({ message: 'Service Unavailable' });
    }
}
