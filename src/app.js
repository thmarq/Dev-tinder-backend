const express = require('express');
const connectDB = require('./config/database.js')
const userModel = require('./models/user.schema.js');
var cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth.js');
const requestRouter = require('./routes/request.js');
const profileRouter = require('./routes/profile.js');
const userRouter = require('./routes/user.js');
var cors = require('cors')

const app = express()
const PORT = 5000;

//used to connect with front end and domain name is diff for both UI & BE so we enabled cors and need to set cookie
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use(express.json()) // which will convert JSON to JS objects in req and append in req body 
app.use(cookieParser())

app.use("/", authRouter); //"/ indicates will check inside all routes which start with / if no match found then 2d router will execute"
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)



 connectDB()
.then(()=> {
    console.log(" ================= DB connnected successfully ===================")
     app.listen(PORT, ()=> {
        console.log(`===================== Server listening on port ===================== :  ${PORT}`)
    })
}
)
.catch((err)=> console.log("Error in DB connected", err))

// we can define route like this , for better move to some router files and add this logic
// app.post("/login", async (req, res)=> {
//     try {
//         loginValidator(req);
//         const { email , password} = req.body;

//         const user = await userModel.findOne({email})
//         if(!user){
//             throw new Error('Invalid credentials') // to prevent info leaking
//         }
//         const isValidPwd = await bcrypt.compare(password,user.password)
//         if(!isValidPwd){
//             throw new Error('Invalid credentials ')
//         }
//         const token = await jwt.sign({_id : user.id},"SECRET_KEY", { expiresIn: '1d'})
//         res.cookie("token", token)
//         res.status(200).send(`Login success `)
//     }
//     catch(e){
//         res.status(404).send(`Something went wrong ${e}`)
//     }
// })

app.get("/feed", async (req, res)=> {
    const users = await userModel.find()
    res.status(200).send({data : users})
})

app.get("/user", async (req,res)=> {
    try {
        const email = req.body.email
        const user = await userModel.findOne({email})
        if(!user){
            res.status(404).send("User not found")
        }
        res.status(200).send({data : user})
    }
    catch(e){
        res.status(404).send(`Something went wrong ${e}`)
    }
})

app.delete('/user', async(req, res)=> {
    const userId = req.body.userId;
    const user = await userModel.findByIdAndDelete(userId)
    res.status(200).send("User deleted success.")
})

app.patch('/user', async(req, res)=> {
    try {
        const userId = req.body.userId;
        const user = await userModel.findByIdAndUpdate(userId, req.body, {new: true , runValidators: true})
        res.status(200).send(`User Update success.${user}`)
    }
    catch(e){
        res.status(404).send(`Something went wrong ${e}`)
    }
})







// / app.use("/admin", adminAuth)

// app.use("/admin/getData",(req, resp)=> {
//     resp.send("Hello from the getData !!")
// })

//this is the request handler
// app.use("/test",(req, resp, next)=> 
//     {
//         next()
//     console.log("Test from the server- Handler 1 !!")
// },
// (req, resp, next)=> {
//     console.log("Test from the server- Handler 2 !!")
//     next()
// },
// (req, resp,)=> {
//     console.log("Test from the server- Handler 3 !!")
//     resp.send("Test from the server- Handler 3 !!")

// }
// )

//we can use like this for different access of route path
// app.use("/hi",(req, resp)=> {
//     resp.send("Hello from the HI !!")
// })