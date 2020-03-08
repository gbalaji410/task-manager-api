const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

const multer = require('multer')
const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(doc|docx)$/)){
            return cb(new Error('Please upload a Word Document.'))
        }
        cb(undefined, true)
        // cb(new Error('File must be a PDF.'))
        // cb(undefined, true)
    }
})

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on ' + port)
})

const Task = require('./models/task')
const User = require('./models/user')

const main = async () => {
    // const task = await Task.findById('5e5ca03ce2551b3582cad8a4')
    // await task.populate('owner').execPopulate()
    // console.log(task.owner)
    const user = await User.findById('5e5c9f9e48ef3f34d9ddbb5e')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}

main()