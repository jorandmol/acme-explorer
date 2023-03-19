import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
        title: 'ACME-Explorer API',
        version: '1.0.0',
        description:
            'Specification of models and endpoints for communication and integration with the ACME-Explorer API.'
        },
        servers: [{
        url: `http://localhost:8080`,
        description: 'Development server'
        }],
    },
    apis: ['openapi/*.yml'],
}

const swaggerSpec = swaggerJSDoc(options);
const swaggerDocs = (app) => {
    app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))
    app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerSpec)
    })
}

export default swaggerDocs
