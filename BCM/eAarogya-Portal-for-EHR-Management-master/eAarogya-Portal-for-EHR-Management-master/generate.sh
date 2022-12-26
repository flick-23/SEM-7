rm -R crypto-config/*

./bin/cryptogen generate --config=crypto-config.yaml

rm config/*

./bin/configtxgen -profile ehrOrgOrdererGenesis -outputBlock ./config/genesis.block

./bin/configtxgen -profile ehrOrgChannel -outputCreateChannelTx ./config/ehrchannel.tx -channelID ehrchannel
