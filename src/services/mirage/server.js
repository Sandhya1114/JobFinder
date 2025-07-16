import { createServer } from 'miragejs';

createServer({
  routes() {
    this.namespace = 'api';

    this.get('/jobs', () => {
      return [
        { id: 1, title: 'Software Engineer', company: 'Company A' },
        { id: 2, title: 'Product Manager', company: 'Company B' },
      ];
    });

    this.post('/auth/login', (schema, request) => {
      let attrs = JSON.parse(request.requestBody);
      return { token: 'fake-jwt-token', user: attrs };
    });
  },
});
