"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
;
global.WebSocket = require('isomorphic-ws');
const firebase = __importStar(require("firebase/app"));
require("firebase/auth");
require("firebase/firestore");
require("firebase/database");
const hub_1 = require("@textile/hub");
const threads_core_1 = require("@textile/threads-core");
const express = require("express");
const multer = require('multer');
const axios = require('axios');
const CryptoJS = require('crypto-js');
const upload = multer({ dest: 'uploads/' });
const bodyParser = __importStar(require("body-parser"));
const config = require('../config.js');
const cors = require('cors');
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
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
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
const setup = () => __awaiter(void 0, void 0, void 0, function* () {
    const identity = yield threads_core_1.Libp2pCryptoIdentity.fromString(config.libp2pkey);
    const key = {
        key: config.bucketKey,
        secret: ''
    };
    // Use the insecure key to setup a new session
    const buckets = yield hub_1.Buckets.withKeyInfo(key);
    // Authorize the user and your insecure keys with getToken
    yield buckets.getToken(identity);
    const root = yield buckets.open('io.textile.dropzone');
    if (!root) {
        throw new Error('Failed to open bucket');
    }
    const bucket = buckets;
    const bucketKey = root.key;
    const index = {
        author: identity.public.toString(),
        date: (new Date()).getTime(),
        paths: [],
    };
    // Store the index in the Bucket (or in the Thread later)
    const buf = Buffer.from(JSON.stringify(index, null, 2));
    const path = `index.json`;
    const resp = yield buckets.pushPath(bucketKey, path, buf);
    console.log(resp);
});
const insertFile = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const path = '/ipfs/' + config.path;
    const identity = yield threads_core_1.Libp2pCryptoIdentity.fromString(config.libp2pkey);
    const key = {
        key: config.bucketKey,
        secret: ''
    };
    // Use the insecure key to setup a new session
    const buckets = yield hub_1.Buckets.withKeyInfo(key);
    // Authorize the user and your insecure keys with getToken
    yield buckets.getToken(identity);
    const root = yield buckets.open('io.textile.dropzone');
    if (!root) {
        throw new Error('Failed to open bucket');
    }
    const bucket = buckets;
    const bucketKey = root.key;
    return new Promise((resolve, reject) => {
        const binaryStr = file;
        // Finally, push the full file to the bucket
        buckets.pushPath(bucketKey, path, binaryStr).then((raw) => {
            resolve(raw);
        });
    });
});
app.get('/post', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('home.ejs');
}));
app.post('/post', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const key = config.libp2pkey;
    const image = yield req.body.img;
    function makeid(length) {
        return __awaiter(this, void 0, void 0, function* () {
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        });
    }
    const resp = yield insertFile(image);
    //res.send({cid: resp.path.cid.toString()})
    const cipherId = yield CryptoJS.AES.encrypt(resp.path.cid.toString(), key).toString();
    const id = yield makeid(8);
    const dbresp = yield firebase.database().ref(id).set({
        cid: cipherId
    });
    res.send({ rid: id });
}));
app.get('/photo/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const key = config.libp2pkey;
    const rid = req.params.id;
    const cid = yield firebase.database().ref(rid).once('value').then(snapshot => {
        const details = snapshot.val();
        return details.cid;
    });
    const bytes = yield CryptoJS.AES.decrypt(cid, key);
    const originalText = yield bytes.toString(CryptoJS.enc.Utf8);
    const url = 'https://' + originalText + '.ipfs.hub.textile.io';
    const resp = yield axios.get(url).catch((err) => { res.send('error'); });
    console.log(resp);
    res.render('display.ejs', { img: resp });
}));
app.listen(process.env.PORT || 5000, function () {
    console.log('Example app listening on port 3000!');
});
