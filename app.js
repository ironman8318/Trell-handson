const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

const rootDir = path.dirname(process.mainModule.filename);

const appPkg = require(`${rootDir}/Schema/appPackage.js`);
const userPkg = require(`${rootDir}/Schema/userPacakge.js`);

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/test", (req, res, next) => {
  const userId = req.query.userId;
  const packages = req.query.packages;
  const packageArray = packages.split(",");

  // appPkg.find({"name" : { $nin : packageArray}}).then(foundPackage => {
  //         console.log(foundPackage);
  // })

  const tempMap = new Map();
  const arrayToStore = [];
  appPkg.find({ name: { $in: packageArray } }).then((foundPackage) => {
    for (let i = 0; i < foundPackage.length; i++) {
      const pkg = foundPackage[i];
      tempMap.set(pkg.name, pkg._id);
    }

    

    let tset = new Set();

    packageArray.forEach(pkg =>{
        tset.add(pkg);
    })

    const setArray  = Array.from(tset);

    setArray.forEach((package) => {
      if (!tempMap.has(package)) {
        arrayToStore.push({name : package});
      }
    });

    console.log(arrayToStore)

    appPkg.insertMany(arrayToStore).then(data => {
        console.log("Bulk upload")
    })

    // arrayToStore.forEach((package) => {
    //   const a = new appPkg({
    //     name: package,
    //   });

    //   a.save().then((data) => {
    //     console.log("package created successfully");
    //   });
    // });
  });

  // packageArray.forEach(package => {
  //     appPkg.findOne({name : package}).then(foundPackage => {
  //         if(!foundPackage && package){
  //             const a = new appPkg({
  //                 name : package,
  //             })

  //             a.save().then(data => {
  //                 console.log("package created successfully");
  //             })
  //         }
  //     })
  // })

  userPkg.findOne({ userId: userId }).then((user) => {
    if (!user) {
      const tempUser = new userPkg({
        userId: userId,
        packages: packageArray,
      });

      return tempUser.save().then((user) => {
        console.log("User created Successfully");
      });
    }

    const tempUserArray = packageArray.filter((el) => {
      return !user.packages.includes(el);
    });

    user.packages = [...user.packages, ...tempUserArray];
    user.save().then((data) => {
      console.log("updation done");
    });
  });

  res.json("sent");
});

mongoose
  .connect("mongodb://localhost:27017/trell")
  .then((data) => {
    console.log("DB connected");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
