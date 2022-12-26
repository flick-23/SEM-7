# eAarogya Portal for Electronic Health Record Management (eAPEM)
eAPEM is a private blockchain based solution built for the problem statement submitted by Ministry of Health and Family Welfare in the Smart India Hackathon 2020. 
This application focuses on use of private blockchain to create and manage electronic health records on top of the existing Aadhaar Identity Infrastructure (UIDAI).

[Demo video](https://youtu.be/mlPB1FBxMQo)

[Power Point Presentation](https://drive.google.com/drive/folders/1S-edWrW7Nn50Otnp0N4X1ScdWIBHO7mY?usp=sharing)

## Why private blockchain ? 
While desiging a system to be utilizied by a country like India, it is very important to keep in mind to tackle problems such as scalability, security and cost efficiency.
Private blockchains offer all the above along with decentralization in a closed ecosystem.

## Idea
The main idea of this application is to form a consortium of trusted parties and have a  **role based access** system headed by a central authority which in our case would be the government i.e the parties can only make transactions and call functions which are permitted to them. This is taken care by the **Certificate Authority or CA**. For Eg: The phamacist present in the network can only query the prescriptions while a clinician can add/query reports and prescriptions.

<p align="center">
    <img width="900" height="450" src="https://github.com/vaibhavmuchandi/eArogya-Portal-for-EHR-Management-eAPEM-/blob/master/eAarogya_network_diagram.png">
</p>

The role of the Central authority would be to add and remove entities from the consortium. 
Other consortium members included in the application: 
1. Clinician: A clinician peer would be allowed to add/query reports and prescription.
2. Radiologist: A radiologist peer can add/query reports and precriptions along with addition feature of adding medical images. The medical images added will be encrypted and stored securely on [IPFS](https://ipfs.io)
3. Pharmacist: A pharmacist peer can only query prescriptions.
4. Health Care provider: A healthcare provider peer can query reports and prescriptions.
5. Test Center: A test center peer can add reports only.
6. Researcher: A researcher peer can download dataset and visualize medical data from different parts of country only if permitted by the user.

<p align="center">
    <img width="700" height="350" src="https://github.com/vaibhavmuchandi/eArogya-Portal-for-EHR-Management-eAPEM-/blob/master/eAarogya_org_sequence.png">
</p>

#### Protecting users data
The users of the application/medical data holders are provided with a permission system. Using this permission system the record holders can add/revoke permission to a given organisation for accessibility of their medical records. The users are also provided with **crypto incentives** if they agree to share their data with researchers.

<p align="center">
    <img width="700" height="600" src="https://github.com/vaibhavmuchandi/eArogya-Portal-for-EHR-Management-eAPEM-/blob/master/eAarogya_User_Sequence.png">
</p>

#### Data storage management across peers
Since it might not actually be necessary for all the peers to store all the transactions, we use Private Data Collection technique to make sure that there is a better data storage management. For the Pharmacist Peers in our network, there is no need for them to store the data related medical reports since they can only access prescriptions and also considering constrains such as size of total data. Hence with the help of Private Data Collection, it is made sure that the Pharmacist stores only the data related to addition of Prescription reports while all the other peers can store the data related to both medical reports and prescriptions.

<p align="center">
    <img width="550" height="300" src="https://github.com/vaibhavmuchandi/eArogya-Portal-for-EHR-Management-eAPEM-/blob/master/eAarogya_PrivateDataCollection.JPG">
</p>

#### Additional features
1. Localisation of the application, i.e the application is avaiable to use in multiple languages.
2. Easy to use mobile application for users: The users can use the mobile app to grant/revoke permission by just **scanning organisation's QR code**
3. Test centers are provided with a OCR functionality. The data can be entered automatically by uploading a medical report.
4. SMS Gateway is provieded for users through which they can use the functionalities by sending SMS.
5. Data visualisation for researchers.
6. Ethereum based crypto incentive system for users when they agree upon sharing their data for researcher purposes. 
7. Ready to download password protected report PDF's.
8. Private API's to access the medical images stored on IPFS.

## Getting started with the application
### Prerequisite
Make sure you have installed Docker and Nodejs v^8.13.0 < v10.10.0 for the web app

```
1. In the root directory first run ./start.sh : this will create the required containers
2. Then run ./setup.sh : this will connect the peers and install the chaincode
3. cd to ehr-api directory and run 'npm install'
3. Then run the enrollUsers.js files ( For all the users )
4. Finally, run 'npm start'
The application can then used at https://localhost:3000
```

The source code for mobile app is placed in the [AarogyaMobileApp](https://github.com/vaibhavmuchandi/SS45_Eureka99/tree/master/AarogyaMobileApp) directory.
```
1. Install the Expo app in your mobile phone from AppStore or Google Play Store.
2. cd to AarogyaMobileApp directory and run 'npm install'.
3. You need to have a tunnel between the Web App api and Mobile App, we recommand to use ngrok.
4. Start a [ngrok](https://ngrok.com/) tunnel at port 3000 from your command prompt
5. The ngrok link needs to be put in webServer.js file present in the 'api' directory inside the 'src' directory of AarogyaMobileApp
6. After setting up the ngrok link, you can run 'npm start' from root of AarogyaMobileApp directory.
7. The app can then be used in the Expo app in the phone

Note: The Laptop/PC and the cellphone needs to be connected to the same Wifi network in order for Expo to work.

```

### Built with
* [Hyperledger Fabric v1.4](https://https://github.com/hyperledger/fabric)
* [Nodejs ^v8.13.0](https://nodejs.org/dist/latest-v8.x/)
* [Embedded JS](https://ejs.co/)
* [React Native](https://reactnative.dev)

### Authors
1. **Vaibhav Muchandi** - [vaibhavmuchandi](https://github.com/vaibhavmuchandi)
2. **Varun Shiri** - [varunks99](https://github.com/varunks99)
3. **Larina Maskren** - [Larii2024](https://github.com/Lari2024)
4. **Naman Mehta** - [NamanMehta16](https://github.com/NamanMehta16)
5. **Sujay Amberkar** - [SujayAmberkar](https://github.com/SujayAmberkar)
6. **Shramik Murkute** - [Shramik99](https://github.com/Shramik99)

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
