const express = require("express");
const cors = require("cors");
const app =  express();
// var corOptions ={
//     origin:"http://localhost:8080"
// }

// // middleware
//  app.use(cors(corOptions))

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });
app.use(express.json())
app.use(express.urlencoded({extended:true}))
// static uploads folder
app.use('/uploads',express.static('./uploads'))
// app.use('/Images',express.static('./Images'))
// routers
const router = require('./routes/productRouter.js')
const router_customer = require('./routes/customerRouter')
const router_shop = require('./routes/shopRouter')
const packageitem = require('./routes/packageRouter')
const order = require('./routes/orderRouter')
const city = require('./routes/cityRouter')
const admin = require('./routes/adminRouter')
const orderstatus = require('./routes/orderStatusRouter')
const courier = require('./routes/courierRouter')
const productimage = require('./routes/productImageRouter')
const review = require('./routes/reviewRouter')
const notification = require('./routes/notificationRouter')
const discount = require('./routes/discountRouter')
const message = require('./routes/messageRouter')
const code =  require('./routes/codeRouter')
const payment =  require('./routes/paymenthistoryRouter')
const cart = require('./routes/cartRouter')


app.use('/api/customer',router_customer);
app.use('/api/shop',router_shop);
app.use('/api/products',router);
app.use('/api/package',packageitem);
app.use('/api/order',order);
app.use('/api/city',city);
app.use('/api/admin',admin);
app.use('/api/orderstatus',orderstatus);
app.use('/api/courier',courier);
app.use('/api/productimage',productimage);
app.use('/api/review',review);
app.use('/api/notification',notification);
app.use('/api/discount',discount);
app.use('/api/message',message);
app.use('/api/code',code);
app.use('/api/payment',payment);
app.use('/api/cart',cart)
// testing api
app.get("/",(req,res)=>{
    res.json({message:"hello from api" })
})

// port
const PORT = 8000

// server
app.listen(PORT,'0.0.0.0',()=>{
    console.log(`server is runnig at port:${PORT}`)
})