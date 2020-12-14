const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

const rootDir = path.dirname(process.mainModule.filename);

const appPkg = require(`${rootDir}/Schema/appPackage.js`);
const userPkg = require(`${rootDir}/Schema/userPacakge.js`);

app.use(bodyParser.urlencoded({extended : false}));

app.post("/test",(req,res,next) => {
    const userId = req.query.userId;
    const packages = req.query.packages;
    const packageArray = packages.split(",");

    // appPkg.find({"name" : { $nin : packageArray}}).then(foundPackage => {
    //         console.log(foundPackage);
    // })

    packageArray.forEach(package => {
        appPkg.findOne({name : package}).then(foundPackage => {
            if(!foundPackage && package){
                const a = new appPkg({
                    name : package,
                })

                a.save().then(data => {
                    console.log("package created successfully");
                })
            }
        })
    })

    userPkg.findOne({userId : userId}).then(user => {
        if(!user){
            const tempUser = new userPkg({
                userId : userId,
                packages : packageArray,
            })

            return tempUser.save().then(user => {
                console.log("User created Successfully");
            })
        }

        const tempUserArray = packageArray.filter(el => {
            return !user.packages.includes(el)
        })

        user.packages = [...user.packages , ...tempUserArray];
        user.save().then(data => {
            console.log("updation done")
        })
        

       
    })

  
    

    res.json("sent");
})

mongoose.connect("mongodb://localhost:27017/trell").then(data => {
    console.log("DB connected");
    app.listen(3000);
}).catch(err => {
    console.log(err);
})



