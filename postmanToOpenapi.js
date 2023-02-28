import postmanToOpenApi from 'postman-to-openapi'
import { join } from 'node:path'
import { readdirSync, existsSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'

const API_VERSION = 'v1'

const postmanDir = './postman'
const openapiDir = './openapi'

// read all postman collections and store its names
const getPostmanFiles = (dir) => {
    return 
}

// convert the postman collection file into an openapi specification
const convertToOpenApi = async (filename) => {
    const collectionName = filename.split('.')[0]
    const postmanFilename = join(postmanDir, filename)
    const openApiFilename = join(openapiDir, `${collectionName}.yml`)

    console.log('Creating OpenAPI specification for collection', collectionName)
    try {
        const result = await postmanToOpenApi(postmanFilename, null, { defaultTag: collectionName })
        if (result) {
            console.log(`OpenAPI spec for collection ${collectionName} created`)
            await writeFile(openApiFilename, result)
            console.log(`OpenAPI file ${collectionName}.yml generated`)
        } else {
            throw new Error()
        }
    } catch (err) {
        console.log('An error occurred while creating the OpenAPI file for collection', collectionName)
        console.log(err)
    }
}

if (!existsSync(openapiDir)) {
    console.log('OpenAPI  directory does not exist, create it in the root folder')
    process.exit()
}

const filenames = readdirSync(postmanDir)
const openApiCollections = filenames.map(filename => convertToOpenApi(filename))

try {
    const result = await Promise.all(openApiCollections)
    console.log('-----------------------------')
    console.log('OpenAPI files generated succesfully!')
} catch (err) {
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    console.log('Something went wrong', err)
}

