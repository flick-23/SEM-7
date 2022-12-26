echo "Setting up the network.."

echo "Creating channel genesis block.."
# Create the channel
docker exec -e "CORE_PEER_LOCALMSPID=centAuthMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/centAuth.ehr.com/users/Admin@centAuth.ehr.com/msp" -e "CORE_PEER_ADDRESS=peer0.centAuth.ehr.com:7051" cli peer channel create -o orderer.ehr.com:7050 -c ehrchannel -f /etc/hyperledger/configtx/ehrchannel.tx
sleep 5
echo "Channel genesis block created."

echo "peer0.centAuth.ehr.com joining the channel..."
# Join peer0.manf.vlm.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=centAuthMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/centAuth.ehr.com/users/Admin@centAuth.ehr.com/msp" -e "CORE_PEER_ADDRESS=peer0.centAuth.ehr.com:7051" cli peer channel join -b ehrchannel.block
sleep 5
echo "peer0.centAuth.ehr.com joined the channel"

echo "peer0.clinician.ehr.com joining the channel..."
# Join peer0.clinician.ehr.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=clinicianMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/clinician.ehr.com/users/Admin@clinician.ehr.com/msp" -e "CORE_PEER_ADDRESS=peer0.clinician.ehr.com:7051" cli peer channel join -b ehrchannel.block
sleep 5
echo "peer0.clinician.ehr.com joined the channel"

echo "peer0.radioLogist.ehr.com joining the channel..."
# Join peer0.radioLogist.ehr.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=radioLogistMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/radioLogist.ehr.com/users/Admin@radioLogist.ehr.com/msp" -e "CORE_PEER_ADDRESS=peer0.radioLogist.ehr.com:7051" cli peer channel join -b ehrchannel.block
sleep 5
echo "peer0.radioLogist.ehr.com joined the channel"

echo "peer0.pharmacist.ehr.com joining the channel..."
# Join peer0.pharmacist.ehr.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=pharmacistMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/pharmacist.ehr.com/users/Admin@pharmacist.ehr.com/msp" -e "CORE_PEER_ADDRESS=peer0.pharmacist.ehr.com:7051" cli peer channel join -b ehrchannel.block
sleep 5
echo "peer0.pharmacist.ehr.com joined the channel"

echo "peer0.researcher.ehr.com joining the channel..."
# Join peer0.researcher.ehr.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=researcherMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/researcher.ehr.com/users/Admin@researcher.ehr.com/msp" -e "CORE_PEER_ADDRESS=peer0.researcher.ehr.com:7051" cli peer channel join -b ehrchannel.block
sleep 5
echo "peer0.researcher.ehr.com joined the channel"

echo "peer0.healthCareProvider.ehr.com joining the channel..."
# Join peer0.insu.vlm.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=healthCareProviderMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/healthCareProvider.ehr.com/users/Admin@healthCareProvider.ehr.com/msp" -e "CORE_PEER_ADDRESS=peer0.healthCareProvider.ehr.com:7051" cli peer channel join -b ehrchannel.block
sleep 5
echo "peer0.healthCareProvider.ehr.com joined the channel"

echo "Installing vlm chaincode to peer0.manf.vlm.com..."
# install chaincode
# Install code on centAuth peer
docker exec -e "CORE_PEER_LOCALMSPID=centAuthMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/centAuth.ehr.com/users/Admin@centAuth.ehr.com/msp" -e "CORE_PEER_ADDRESS=peer0.centAuth.ehr.com:7051" cli peer chaincode install -n ehrcc -v 1.0 -p github.com/ehr/go -l golang
sleep 5
echo "Installed ehr chaincode to peer0.centAuth.ehr.com "


echo "Installing ehr chaincode to peer0.clinician.ehr.com...."
# Install code on clinician peer
docker exec -e "CORE_PEER_LOCALMSPID=clinicianMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/clinician.ehr.com/users/Admin@clinician.ehr.com/msp" -e "CORE_PEER_ADDRESS=peer0.clinician.ehr.com:7051" cli peer chaincode install -n ehrcc -v 1.0 -p github.com/ehr/go -l golang
sleep 5
echo "Installed ehr chaincode to peer0.clinician.ehr.com"

echo "Installing ehr chaincode to peer0.radioLogist.ehr.com..."
# Install code on radioLogist peer
docker exec -e "CORE_PEER_LOCALMSPID=radioLogistMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/radioLogist.ehr.com/users/Admin@radioLogist.ehr.com/msp" -e "CORE_PEER_ADDRESS=peer0.radioLogist.ehr.com:7051" cli peer chaincode install -n ehrcc -v 1.0 -p github.com/ehr/go -l golang
sleep 5
echo "Installed ehr chaincode to peer0.radioLogist.ehr.com"

echo "Installing ehr chaincode to peer0.pharmacist.ehr.com..."
# Install code on pharmacist peer
docker exec -e "CORE_PEER_LOCALMSPID=pharmacistMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/pharmacist.ehr.com/users/Admin@pharmacist.ehr.com/msp" -e "CORE_PEER_ADDRESS=peer0.pharmacist.ehr.com:7051" cli peer chaincode install -n ehrcc -v 1.0 -p github.com/ehr/go -l golang
sleep 5
echo "Installed ehr chaincode to peer0.pharmacist.ehr.com"

echo "Installing ehr chaincode to peer0.researcher.ehr.com..."
# Install code on researcher peer
docker exec -e "CORE_PEER_LOCALMSPID=researcherMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/researcher.ehr.com/users/Admin@researcher.ehr.com/msp" -e "CORE_PEER_ADDRESS=peer0.researcher.ehr.com:7051" cli peer chaincode install -n ehrcc -v 1.0 -p github.com/ehr/go -l golang
sleep 5
echo "Installed ehr chaincode to peer0.researcher.ehr.com"

echo "Installing ehr chaincode to peer0.healthCareProvider.ehr.com..."
# Install code on healthCareProvider peer
docker exec -e "CORE_PEER_LOCALMSPID=healthCareProviderMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/healthCareProvider.ehr.com/users/Admin@healthCareProvider.ehr.com/msp" -e "CORE_PEER_ADDRESS=peer0.healthCareProvider.ehr.com:7051" cli peer chaincode install -n ehrcc -v 1.0 -p github.com/ehr/go -l golang
sleep 5
echo "Installed ehr chaincode to peer0.healthCareProvider.ehr.com"


echo "Instantiating ehr chaincode.."
docker exec -e "CORE_PEER_LOCALMSPID=centAuthMSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/centAuth.ehr.com/users/Admin@centAuth.ehr.com/msp" -e "CORE_PEER_ADDRESS=peer0.centAuth.ehr.com:7051" cli peer chaincode instantiate -o orderer.ehr.com:7050 -C ehrchannel -n ehrcc -l golang -v 1.0 -c '{"Args":[""]}' -P "OR ('centAuthMSP.member','clinicianMSP.member','radioLogistMSP.member','pharmacistMSP.member','researcherMSP.member', 'healthCareProviderMSP.member')"
echo "Instantiated ehr chaincode."
echo "Following is the docker network....."

docker ps

