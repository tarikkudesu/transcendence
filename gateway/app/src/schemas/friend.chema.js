export const friendSchema = {
    type: 'object',
    required: ['to'],
    properties: {
        to: {
            type: 'string',
            pattern: '^[a-zA-Z0-9 _-]+$'
        }
    },
};
  