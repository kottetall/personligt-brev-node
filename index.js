const Express = require("express")
const app = Express()
const port = 3000

// startexempel från expressjs.com
// app.get("/", (req, res) => {
//     res.send("Hello World")
// })

app.use(Express.static("public"))

app.listen(port, () => {
    console.log(`Lyssnar genom port: ${port}`)
})

const testData = {
    meddelande: "gick bra"
}

// testgrej för att se så server och sida kan prata med varandra
app.get("/test", (req, res) => {
    res.send(testData)
})