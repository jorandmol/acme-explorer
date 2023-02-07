import GlobalConfig from '../models/GlobalConfigModel.js'

const listConfig = async (req, res) => {
  try {
    const configs = await GlobalConfig.find({})
    res.json(configs)
  } catch (err) {
    res.status(500).send(err)
  }
}

const updateConfig = async (req, res) => {
  const newGlobalConfig = req.body
  try {
    const configs = await GlobalConfig.find({})
    const updatedConfig = await GlobalConfig.findOneAndUpdate({ _id: configs[0]._id }, newGlobalConfig, { new:true })
    if (updatedConfig) {
      res.json(updatedConfig)
    } else{
      res.status(404).send('Global Config not found')
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

export { listConfig, updateConfig }