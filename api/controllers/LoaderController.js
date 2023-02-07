import mongoose from 'mongoose'
import { readFile } from 'fs/promises';

const storeJsonInsertMany = async (req, res) => {
  let mongooseModel = null
  let sourceFile = null
  let response = ''
  if (req.query.mongooseModel && req.query.sourceFile) {
    mongooseModel = req.query.mongooseModel
    sourceFile = req.query.sourceFile
    

    console.log('Modelo:'+mongooseModel)
    console.log('sourceFile:'+sourceFile)

    const json = JSON.parse(await readFile(new URL(sourceFile, import.meta.url)));

    const collectionModel = mongoose.model(mongooseModel)

    console.log('inserting the json from file: ' + sourceFile + ', into the Model: ' + mongooseModel)
  
    try {
      response = await collectionModel.insertMany(json, { ordered: false })
      const responseFinal = 'All documents stored in the collection!'
        console.log(responseFinal)
        res.send(response)
    }
    catch (err) {
      console.log(err)
      res.send(err)
    }

  } else {
    if (req.query.mongooseModel == null) response += 'A mandatory mongooseModel parameter is missed.\n'
    if (req.query.sourceFile == null) response += 'A mandatory sourceFile parameter is missed.\n'
    console.log(response)
    res.send(response)
  }
}


export { storeJsonInsertMany }