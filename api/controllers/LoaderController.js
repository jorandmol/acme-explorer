import mongoose from 'mongoose'
import { readFile } from 'fs/promises';

const storeJsonInsertMany = async (req, res) => {
  const { model, sourceFile } = req.query
  if (!model || !sourceFile) {
    res.status(400).send('Model and sourceFile are mandatory fields')
  }

  const data = JSON.parse(await readFile(new URL(sourceFile, import.meta.url)));
  const collectionModel = mongoose.model(model)

  console.log('inserting the json from file: ' + sourceFile + ', into the Model: ' + model)
  try {
    const response = await collectionModel.insertMany(data, { ordered: false })
    res.send(`A list of ${response.length} ${model}s have been inserted to the DB`)
  }
  catch (err) {
    res.status(500).send(err)
  }
}

export { storeJsonInsertMany }