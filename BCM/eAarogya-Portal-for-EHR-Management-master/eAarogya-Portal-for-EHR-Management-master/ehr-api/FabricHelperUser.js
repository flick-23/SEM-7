var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');
const fs = require('fs');
const PDFDocument = require('pdfkit');
var member_user = null;
var store_path = path.join(__dirname, 'hfc-key-store');
console.log('Store path:' + store_path);
var tx_id = null;

//Function to get the entire history of medical reports
function getRecord(req, res, doc) {
    //Init fabric client
    var fabric_client = new Fabric_Client();

    // setup the fabric network
    var channel = fabric_client.newChannel("ehrchannel");
    var order = fabric_client.newOrderer("grpc://192.168.99.100:7050");
    channel.addOrderer(order);

    //add buyer peer
    var peer = fabric_client.newPeer("grpc://192.168.99.100:7051");
    channel.addPeer(peer);

    Fabric_Client.newDefaultKeyValueStore({
            path: store_path
        })
        .then(state_store => {
            // assign the store to the fabric client
            fabric_client.setStateStore(state_store);
            var crypto_suite = Fabric_Client.newCryptoSuite();
            // use the same location for the state store (where the users' certificate are kept)
            // and the crypto store (where the users' keys are kept)
            var crypto_store = Fabric_Client.newCryptoKeyStore({
                path: store_path
            });
            crypto_suite.setCryptoKeyStore(crypto_store);
            fabric_client.setCryptoSuite(crypto_suite);

            // get the enrolled user from persistence, this user will sign all requests
            return fabric_client.getUserContext("clinicianUser", true);
        })
        .then(user_from_store => {
            if (user_from_store && user_from_store.isEnrolled()) {
                console.log("Successfully loaded clinicianUser from persistence");
                member_user = user_from_store;
            } else {
                throw new Error("Failed to get clinicianUser.... run registerUser.js");
            }

            // getRecord chaincode function - requires 1 argument, ex: args: ['ABCD'],
            var request = {
                chaincodeId: 'ehrcc',
                fcn: 'getRecord',
                args: [doc.medicalID],
                chainId: 'ehrchannel'
            };

            // send the query proposal to the peer
            return channel.queryByChaincode(request);
        })
        .then(query_responses => {
            console.log("Query has completed, checking results");
            // query_responses could have more than one  results if there multiple peers were used as targets
            if (query_responses && query_responses.length == 1) {
                if (query_responses[0] instanceof Error) {
                    console.error("error from query = ", query_responses[0]);
                    //res.send({ code: "500", message: "isuue with getting car history" });
                } else {
                    console.log("Response is ", query_responses[0].toString());
                    var result = JSON.parse(query_responses[0]);
                    console.log(doc.mobile);
                    if (doc.mobile) {
                        let reports = [];
                        for (let i in result) {
                            if (result[i]['Value']['report'] != '')
                                reports.push({
                                    date: Date(result[i]['Timestamp'].slice(0, 11)).slice(4, 15),
                                    info: result[i]['Value']['report']
                                })
                        }
                        res.status(200).send({
                            data: reports
                        })
                    } else {
                        let data = result;
                        var name = data[0]["Value"]["name"];
                        var dob = data[0]["Value"]["dob"];
                        const doc = new PDFDocument({
                            userPassword: req.user.name.split(' ')[0].toLowerCase() + req.user.dob.split('/')[2]
                        });
                        doc.pipe(fs.createWriteStream("Report.pdf"));
                        doc.fontSize(20);
                        doc.text(`Name : ${name}`, {
                            width: 410,
                            align: "left",
                        });

                        doc.moveDown();
                        doc.fontSize(20);
                        doc.text(`Date of Birth: ${dob}`, {
                            width: 410,
                            align: "left",
                        });

                        data.forEach((item, i) => {
                            doc.moveDown();
                            if (i == 0) {
                                item.Value.report.split(', ').forEach((x) => {
                                    doc.fontSize(14);
                                    doc.text(x, {
                                        width: 410,
                                        align: "left",
                                    });
                                })
                            } else {
                                doc.fontSize(16);
                                doc.text("Date:", {
                                    width: 410,
                                    align: "left",
                                });
                                doc.fontSize(18);
                                doc.text(item.Timestamp, {
                                    width: 410,
                                    align: "left",
                                });
                                doc.moveDown();
                                if (item.Value.prescription) {
                                    doc.fontSize(16);
                                    doc.text("Prescription:", {
                                        width: 410,
                                        align: "left",
                                    });

                                    doc.fontSize(18);
                                    doc.text(item.Value.prescription, {
                                        width: 410,
                                        align: "left",
                                    });
                                    doc.moveDown();
                                }
                                if (item.Value.report) {
                                    doc.fontSize(16);
                                    doc.text("Report:", {
                                        width: 410,
                                        align: "left",
                                    });

                                    doc.fontSize(18);
                                    doc.text(item.Value.report, {
                                        width: 410,
                                        align: "left",
                                    });
                                    doc.moveDown();
                                }
                                if (item.Value.links) {
                                    doc.fontSize(16);
                                    doc.text("Links:", {
                                        width: 410,
                                        align: "left",
                                    });

                                    doc.fontSize(18);
                                    doc.text(item.Value.links, {
                                        width: 410,
                                        align: "left",
                                    });
                                }
                            }
                        });

                        doc.end();
                        res.render("user/userPortal", {
                            permission: {},
                            reports: result,
                            prescs: [],
                            message: null,
                            error: null
                        });
                    }
                }
            } else {
                console.log("No payloads were returned from query");
                res.render("user/userPortal", {
                    permission: {},
                    reports: result,
                    prescs: [],
                    message: null,
                    error: res.__('messages.noReport')
                });
            }
        })
        .catch(err => {
            console.error("Failed to query successfully :: " + err);
            res.render("user/userPortal", {
                permission: {},
                reports: result,
                prescs: [],
                message: null,
                error: res.__('messages.error')
            });
        });
}

//Get entire history of prescriptions
function getMedicineRecord(req, res, doc) {
    //Init fabric client
    var fabric_client = new Fabric_Client();

    // setup the fabric network
    var channel = fabric_client.newChannel("ehrchannel");
    var order = fabric_client.newOrderer("grpc://192.168.99.100:7050");
    channel.addOrderer(order);

    //add buyer peer
    var peer = fabric_client.newPeer("grpc://192.168.99.100:7051");
    channel.addPeer(peer);

    Fabric_Client.newDefaultKeyValueStore({
            path: store_path
        })
        .then(state_store => {
            // assign the store to the fabric client
            fabric_client.setStateStore(state_store);
            var crypto_suite = Fabric_Client.newCryptoSuite();
            // use the same location for the state store (where the users' certificate are kept)
            // and the crypto store (where the users' keys are kept)
            var crypto_store = Fabric_Client.newCryptoKeyStore({
                path: store_path
            });
            crypto_suite.setCryptoKeyStore(crypto_store);
            fabric_client.setCryptoSuite(crypto_suite);

            // get the enrolled user from persistence, this user will sign all requests
            return fabric_client.getUserContext("clinicianUser", true);
        })
        .then(user_from_store => {
            if (user_from_store && user_from_store.isEnrolled()) {
                console.log("Successfully loaded clinicianUser from persistence");
                member_user = user_from_store;
            } else {
                throw new Error("Failed to get clinicianUser.... run registerUser.js");
            }
            var request = {
                chaincodeId: 'ehrcc',
                fcn: 'getRecord',
                args: [doc.medicalID],
                chainId: 'ehrchannel'
            };

            // send the query proposal to the peer
            return channel.queryByChaincode(request);
        })
        .then(query_responses => {
            console.log("Query has completed, checking results");
            // query_responses could have more than one  results if there multiple peers were used as targets
            if (query_responses && query_responses.length == 1) {
                if (query_responses[0] instanceof Error) {
                    console.error("error from query = ", query_responses[0]);
                } else {
                    console.log("Response is ", query_responses[0].toString());
                    var result = JSON.parse(query_responses[0]);
                    if (doc.mobile) {
                        let prescs = [];
                        for (let i in result) {
                            if (result[i]['Value']['prescription'] != '')
                                prescs.push({
                                    date: Date(result[i]['Timestamp'].slice(0, 11)).slice(4, 15),
                                    info: result[i]['Value']['prescription']
                                })
                        }
                        res.status(200).send({
                            data: prescs
                        })
                    } else {
                        res.render("user/userPortal", {
                            permission: {},
                            reports: [],
                            prescs: result,
                            message: null,
                            error: null
                        });
                    }
                }
            } else {
                console.log("No payloads were returned from query");
                res.render("user/userPortal", {
                    permission: {},
                    reports: result,
                    prescs: [],
                    rewards: {},
                    message: null,
                    error: res.__('messages.noPresc')
                });
            }
        })
        .catch(err => {
            console.error("Failed to query successfully :: " + err);
            res.render("user/userPortal", {
                permission: {},
                reports: result,
                prescs: [],
                message: null,
                error: res.__('messages.error')
            });
        });
}

// Get the latest medical report
async function getReport(doc) {
    //Init fabric client
    var fabric_client = new Fabric_Client();

    // setup the fabric network
    var channel = fabric_client.newChannel("ehrchannel");
    var order = fabric_client.newOrderer("grpc://192.168.99.100:7050");
    channel.addOrderer(order);

    //add buyer peer
    var peer = fabric_client.newPeer("grpc://192.168.99.100:9051");
    channel.addPeer(peer);

    Fabric_Client.newDefaultKeyValueStore({
            path: store_path
        })
        .then(state_store => {
            // assign the store to the fabric client
            fabric_client.setStateStore(state_store);
            var crypto_suite = Fabric_Client.newCryptoSuite();
            // use the same location for the state store (where the users' certificate are kept)
            // and the crypto store (where the users' keys are kept)
            var crypto_store = Fabric_Client.newCryptoKeyStore({
                path: store_path
            });
            crypto_suite.setCryptoKeyStore(crypto_store);
            fabric_client.setCryptoSuite(crypto_suite);

            // get the enrolled user from persistence, this user will sign all requests
            return fabric_client.getUserContext("clinicianUser", true);
        })
        .then(user_from_store => {
            if (user_from_store && user_from_store.isEnrolled()) {
                console.log("Successfully loaded clinicianUser from persistence");
                member_user = user_from_store;
            } else {
                throw new Error("Failed to get clinicianUser.... run registerUser.js");
            }

            // getReport chaincode function - requires 1 argument, ex: args: ['ABCD'],
            var request = {
                chaincodeId: 'ehrcc',
                fcn: 'getReport',
                args: [doc.medicalID],
                chainId: 'ehr'
            };

            // send the query proposal to the peer
            return channel.queryByChaincode(request);
        })
        .then(query_responses => {
            console.log("Query has completed, checking results");
            // query_responses could have more than one  results if there multiple peers were used as targets
            if (query_responses && query_responses.length == 1) {
                if (query_responses[0] instanceof Error) {
                    console.error("error from query = ", query_responses[0]);
                    return false
                } else {
                    console.log("Response is ", query_responses[0].toString())
                    var result = JSON.parse(query_responses[0]);
                    return result
                }
            } else {
                console.log("No payloads were returned from query");
                return false
            }
        })
        .catch(err => {
            console.error("Failed to query successfully :: " + err);
            return false
        });
}

let ehrUser = {
    getRecord: getRecord,
    getMedicineRecord: getMedicineRecord,
    getReport: getReport
}

module.exports = ehrUser;