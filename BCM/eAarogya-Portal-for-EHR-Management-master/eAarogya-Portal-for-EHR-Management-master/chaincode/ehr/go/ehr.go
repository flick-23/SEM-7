/*
 * This the smart contract for vehicle lifetime management
 */

 package main

 import (
	 "bytes"
	 "encoding/json"
	 "fmt"
	 "strconv"
	 "time"
 
	 "github.com/hyperledger/fabric/core/chaincode/shim"
	 sc "github.com/hyperledger/fabric/protos/peer"
 )
 
 // SmartContract structure
 type SmartContract struct {
 }
 
 // Report Struct structure
 type RecordStruct struct {
	 RecordID             string `json:"recordID"`
	 Name                 string `json:"name"`
	 Dob			      string `json:"dob"`
	 Address			  string `json:"address"`
	 Report               string `json:"report"`
	 Links		          string `json:"links"`
	 Prescription		  string `json:"prescription"`
	 AddedBy			  string `json:"addedby"`
 }
 
 // Init SmartContract
 func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	 return shim.Success(nil)
 }
 
 // Invoke SmartContract Invoke
 func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {
	 // Retrieve the requested Smart Contract function and arguments
	 function, args := APIstub.GetFunctionAndParameters()
	 // Route to the appropriate handler function to interact with the ledger appropriately
	 if function == "createRecord" {
		 return s.createRecord(APIstub, args)
	 }else if function == "addReport" {
		 return s.addReport(APIstub, args)
	 } else if function == "addMedicineReport" {
		 return s.addMedicineReport(APIstub, args)
	 } else if function == "addrLReport" {
		 return s.addrLReport(APIstub, args)
	 } else if function == "getRecord" {
		 return s.getRecord(APIstub, args)
	 } else if function == "getReport"{
		 return s.getReport(APIstub, args)
	 }
 
	 return shim.Error("Invalid Smart Contract function name.")
 }
 
 // createRecord - This is for centralAuth to issue new medical cards.
 func (s *SmartContract) createRecord(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	 recordID := args[0]
	 name := args[1]
	 dob := args[2]
	 address := args[4]
	 report := args[5]

	 Record := RecordStruct {RecordID: recordID,
		 Name:                  name,
		 Dob:        			dob,
		 Address : 				address,
		 Report:                report,
		 Links:					"",
		 Prescription: 			"",
		 AddedBy:				"",
		}
	 RecordBytes, err := json.Marshal(Record)
	 if err != nil {
		 return shim.Error("JSON Marshal failed.")
	 }
 
	 APIstub.PutState(recordID, RecordBytes)
	 fmt.Println("Record has been created -> ", Record)
 
	 return shim.Success(nil)
 }
 
  //Function for clinicians and radioLogists to add a prescription to medicine record
 
 func (s *SmartContract) addMedicineReport(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 recordID := args[0]
	 prescription := args[1]
	 addedby := args[2]
 
	 RecordAsBytes, _ := APIstub.GetState(recordID)
 
	 var record RecordStruct
 
	 err := json.Unmarshal(RecordAsBytes, &record)
	 if err != nil {
		 return shim.Error("Issue with Record json unmarshaling")
	 }
 
 
	 Record := RecordStruct{RecordID: record.RecordID,
		 Name:                 record.Name,
		 Dob:       		   record.Dob,
		 Address: 			   record.Address,
		 Report:				"",
		 Links:					"",
		 Prescription:         prescription,
		 AddedBy:			   addedby}
		 
 
	 RecordBytes, err := json.Marshal(Record)
	 if err != nil {
		 return shim.Error("Issue with Record json marshaling")
	 }
 
	 APIstub.PutState(Record.RecordID, RecordBytes)
	 fmt.Println("New Prescription Report has been added -> ", Record)
 
	 return shim.Success(nil)
 }
 
 // addReport - This is for clinician to add a new report.
 func (s *SmartContract) addReport(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 recordID := args[0]
	 report := args[1]
	 addedby := args[2]
 
	 RecordAsBytes, _ := APIstub.GetState(recordID)
 
	 var record RecordStruct
 
	 err := json.Unmarshal(RecordAsBytes, &record)
	 if err != nil {
		 return shim.Error("Issue with Record json unmarshaling")
	 }
 
 
	 Record := RecordStruct{RecordID: record.RecordID,
		 Name:                  record.Name,
		 Dob:       			record.Dob,
		 Address: 			  	record.Address,
		 Report:                report,
		 Links:					"",
		 Prescription:			"",
		 AddedBy:				addedby}
		 
 
	 RecordBytes, err := json.Marshal(Record)
	 if err != nil {
		 return shim.Error("Issue with Record json marshaling")
	 }
 
	 APIstub.PutState(Record.RecordID, RecordBytes)
	 fmt.Println("New Report has been added -> ", Record)
 
	 return shim.Success(nil)
 }
 
 //Function for radioLogists to add new report with image links
 func (s *SmartContract) addrLReport(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 recordID := args[0]
	 report := args[1]
	 links := args[2]
	 addedby := args[3]
 
	 RecordAsBytes, _ := APIstub.GetState(recordID)
 
	 var record RecordStruct
 
	 err := json.Unmarshal(RecordAsBytes, &record)
	 if err != nil {
		 return shim.Error("Issue with Record json unmarshaling")
	 }
 
 
	 Record := RecordStruct{RecordID: record.RecordID,
		 Name:                  record.Name,
		 Dob:       			record.Dob,
		 Address: 			  	record.Address,
		 Report:                report,
		 Links:				  	links,
		 Prescription:			"",
		 AddedBy:				addedby}
		 
 
	 RecordBytes, err := json.Marshal(Record)
	 if err != nil {
		 return shim.Error("Issue with Record json marshaling")
	 }
 
	 APIstub.PutState(Record.RecordID, RecordBytes)
	 fmt.Println("New Report has been added -> ", Record)
 
	 return shim.Success(nil)
 }
 
 
 
 //Function to obtain the latest medical report
 func (s *SmartContract) getReport(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 recordID := args[0]
	 RecordAsBytes, _ := APIstub.GetState(recordID)
	 recordd := new(RecordStruct)
	 _ = json.Unmarshal(RecordAsBytes, recordd)
	 return shim.Success(RecordAsBytes)
	 
 }
 
 //Function to get entire medical report history
 func (s *SmartContract) getRecord(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
 
	 recordID := args[0]
 
	 resultsIterator, err := APIstub.GetHistoryForKey(recordID)
	 if err != nil {
		 return shim.Error("Error retrieving Record history with GetHistoryForKey")
	 }
	 defer resultsIterator.Close()
 
	 // buffer is a JSON array containing historic values for the Report
	 var buffer bytes.Buffer
	 buffer.WriteString("[")
 
	 bArrayMemberAlreadyWritten := false
	 for resultsIterator.HasNext() {
		 response, err := resultsIterator.Next()
		 if err != nil {
			 return shim.Error("Error retrieving next Record history.")
		 }
		 // Add a comma before array members, suppress it for the first array member
		 if bArrayMemberAlreadyWritten == true {
			 buffer.WriteString(",")
		 }
		 buffer.WriteString("{\"TxId\":")
		 buffer.WriteString("\"")
		 buffer.WriteString(response.TxId)
		 buffer.WriteString("\"")
 
		 buffer.WriteString(", \"Value\":")
		 // if it was a delete operation on given key, then we need to set the
		 //corresponding value null. Else, we will write the response.Value
		 //as-is (as the Value itself a JSON marble)
		 if response.IsDelete {
			 buffer.WriteString("null")
		 } else {
			 buffer.WriteString(string(response.Value))
		 }
 
		 buffer.WriteString(", \"Timestamp\":")
		 buffer.WriteString("\"")
		 buffer.WriteString(time.Unix(response.Timestamp.Seconds, int64(response.Timestamp.Nanos)).String())
		 buffer.WriteString("\"")
 
		 buffer.WriteString(", \"IsDelete\":")
		 buffer.WriteString("\"")
		 buffer.WriteString(strconv.FormatBool(response.IsDelete))
		 buffer.WriteString("\"")
 
		 buffer.WriteString("}")
		 bArrayMemberAlreadyWritten = true
	 }
	 buffer.WriteString("]")
 
	 fmt.Printf("- Getting record returning:\n%s\n", buffer.String())
 
	 return shim.Success(buffer.Bytes())
 }
  
 // Main function is only relevant in unit test mode. Only included here for completeness.
 func main() {
	 // Create a new Smart Contract
	 err := shim.Start(new(SmartContract))
	 if err != nil {
		 fmt.Printf("Error creating new Smart Contract: %s", err)
	 }
 }