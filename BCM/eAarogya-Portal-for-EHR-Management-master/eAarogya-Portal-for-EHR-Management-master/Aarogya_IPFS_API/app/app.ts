;(global as any).WebSocket = require('isomorphic-ws')
import * as firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";
import { Buckets, Identity, KeyInfo, PushPathResult } from '@textile/hub'
import {Libp2pCryptoIdentity} from '@textile/threads-core';
import express = require('express');
const multer  = require('multer');
const axios = require('axios')
const CryptoJS = require('crypto-js')
const upload = multer({ dest: 'uploads/' });
import * as bodyParser from 'body-parser'
const config = require('../config.js');
const cors = require('cors')

// var allowCrossDomain = function(req: express.Request, res: express.Response, next: express.NextFunction) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

//   // intercept OPTIONS method
//   if ('OPTIONS' == req.method) {
//     res.send(200);
//   }
//   else {
//     next();
//   }
// };


// Create a new express application instance
const app: express.Application = express();
app.use(cors())
app.use(bodyParser.urlencoded({limit: '50mb',extended: false}));


const firebaseConfig = {
    apiKey: config.firebaseAPI,
    authDomain: config.firebaseauthDomain,
    databaseURL: config.firebaseDbUrl,
    projectId: config.firebaseProjectId,
    storageBucket: config.firebaseStorageBucket,
    messagingSenderId: config.firebasemsgId,
    appId: config.firebaseAppId
  };

firebase.initializeApp(firebaseConfig);

// const identity = async() => {
//     const lidentity = await Libp2pCryptoIdentity.fromRandom()
//     console.log(lidentity.toString())
// }
    
// identity()
 

const setup = async () => {
  const identity = await Libp2pCryptoIdentity.fromString(config.libp2pkey)
  const key: KeyInfo = {
    key: config.bucketKey,
    secret: ''
    }
  // Use the insecure key to setup a new session
  const buckets = await Buckets.withKeyInfo(key)
  // Authorize the user and your insecure keys with getToken
  await buckets.getToken(identity) 

   const root = await buckets.open('io.textile.dropzone')
   if (!root) {
     throw new Error('Failed to open bucket')
   }
   const bucket = buckets
   const bucketKey = root.key

   const index = {
    author: identity.public.toString(),
    date: (new Date()).getTime(),
    paths: [],
  }
  // Store the index in the Bucket (or in the Thread later)
  const buf = Buffer.from(JSON.stringify(index, null, 2))
  const path = `index.json`
  const resp = await buckets.pushPath(bucketKey, path, buf)
  console.log(resp)
 }

const insertFile = async (file: any) : Promise<PushPathResult> => {
    const path = '/ipfs/'+config.path
    const identity = await Libp2pCryptoIdentity.fromString(config.libp2pkey)
    const key: KeyInfo = {
      key: config.bucketKey,
      secret: ''
      }
    // Use the insecure key to setup a new session
    const buckets = await Buckets.withKeyInfo(key)
    // Authorize the user and your insecure keys with getToken
    await buckets.getToken(identity) 
  
     const root = await buckets.open('io.textile.dropzone')
     if (!root) {
       throw new Error('Failed to open bucket')
     }
     const bucket = buckets
     const bucketKey = root.key

     return new Promise((resolve, reject) => {
        
          const binaryStr = file
          // Finally, push the full file to the bucket
          buckets.pushPath(bucketKey, path, binaryStr).then((raw) => {
            resolve(raw)
          })
        
      })
}

app.get('/post', async(req, res) => {
  res.render('home.ejs')
})

app.post('/post', async(req, res) => {
    const key = config.libp2pkey
    const image = await req.body.img
    async function makeid(length: any) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     }
    const resp = await insertFile(image)
    //res.send({cid: resp.path.cid.toString()})
    const cipherId = await CryptoJS.AES.encrypt(resp.path.cid.toString(), key).toString()
    const id = await makeid(8)
    const dbresp = await firebase.database().ref(id).set({
        cid: cipherId
    })
    res.send({rid: id})
})


app.get('/photo/:id', async(req, res) => {
    const key = config.libp2pkey
    const rid = req.params.id
    const cid = await firebase.database().ref(rid).once('value').then(snapshot => {
        const details = snapshot.val()
        return details.cid
    })
    const bytes = await CryptoJS.AES.decrypt(cid, key)
    const originalText = await bytes.toString(CryptoJS.enc.Utf8)
    const url = 'https://'+originalText+'.ipfs.hub.textile.io'
    const resp = await axios.get(url).catch((err: any) => {res.send('error')})
    console.log(resp)
    res.render('display.ejs', {img: resp});
})

app.listen(process.env.PORT || 5000, function () {
    console.log('Example app listening on port 3000!');
  });

