import * as React from 'react';
import {Text,View,StyleSheet,TouchableOpacity,TextInput} from 'react-native';
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from 'expo-barcode-scanner';
import db from '../config'
import{collection,query,where,getDocs} from 'firebase/firestore';


export default class TransactionScreen extends React.Component {

    constructor(props){
        super(props)
        this.state={
            domState:"normal",
            hasCameraPermissions:null,
            scanned:false,
            scannedData:"",
            bookID:"",
            studentID:"",
            bookName:"",
            studentName:""

        }
    }

    GetCameraPERMISSIONS = async domState=>{
        const {status}=await Permissions.askAsync(Permissions.CAMERA)
        this.setState({
            hasCameraPermissions:status==="granted",
            domState:domState,
            scanned:false
        })
          
    }

    HandleBarcodeScanned=async ({type,data})=>{
      const {domState}=this.state
      if (domState==="bookID") {
        this.setState ({
            scanned:true,
            bookID:data,
            domState:"normal"
        })
      }
      else if (domState==="studentID") {
        this.setState ({
            scanned:true,
            studentID:data,
            domState:"normal"
        })
      }
      
    }
    handleTransaction = async () => {
      var { bookId, studentId } = this.state;
      await this.getBookDetails(bookId);
      await this.getStudentDetails(studentId);
  
      var transactionType = await this.checkBookAvailability(bookId);
  
      if (!transactionType) {
        this.setState({ bookId: '', studentId: '' });
        // For Android users only
        // ToastAndroid.show("The book doesn't exist in the library database!", ToastAndroid.SHORT);
        Alert.alert("The book doesn't exist in the library database!");
      } else if (transactionType === 'issue') {
        var isEligible = await this.checkStudentEligibilityForBookIssue(
          studentId
        );
                                                                        
        if (isEligible) {
          var { bookName, studentName } = this.state;
          this.initiateBookIssue(bookId, studentId, bookName, studentName);
        }
        // For Android users only
        // ToastAndroid.show("Book issued to the student!", ToastAndroid.SHORT);
        Alert.alert('Book issued to the student!');
      } else {
        var isEligible = await this.checkStudentEligibilityForBookReturn(
          bookId,
          studentId
        );
  
        if (isEligible) {
          var { bookName, studentName } = this.state;
          this.initiateBookReturn(bookId, studentId, bookName, studentName);
        }
        // For Android users only
        // ToastAndroid.show("Book returned to the library!", ToastAndroid.SHORT);
        Alert.alert('Book returned to the library!');
      }
    };

    checkBookAvailability = async (bookId) => {
      let dbQuery = query(
        collection(db, 'books'),
        where('book_id', '==', BookID)
      );
  
      let bookRef = await getDocs(dbQuery);
  
      var transactionType = '';
      if (bookRef.docs.length == 0) {
        transactionType = false;
      } else {
        bookRef.forEach((doc) => {
          //if the book is available then transaction type will be issue
          // otherwise it will be return
          transactionType = doc.data(). Availablity? 'issue' : 'return';
        });
      }
  
      return transactionType;
    };


    checkStudentEligibilityForBookIssue = async (studentId) => {
       var dbQuery = query(
        collection(db,'students'),
        where(
          'studentID','==',StudentID
        )
       )
       var studentref=await getDocs( dbQuery)
       
       var isStudentEligible = ''
       if (studentref.docs.length==0) {
        this.setState({
          bookID :'',
          studentID:''
        })
        isStudentEligible=false
        Alert.alert ("student ID doesnt exist")
        
       }
       else{
        studentref.forEach(
          doc=>{
            
          }
        )
       }
    };


    checkStudentEligibilityForBookReturn = async (bookId, studentId) => {
      let dbQuery = query(
        collection(db, 'transactions'),
        where('book_id', '==', bookId),
        limit(1)
      );
  
      let transactionRef = await getDocs(dbQuery);
  
      var isStudentEligible = '';
      transactionRef.forEach((doc) => {
        var lastBookTransaction = doc.data();
        if (lastBookTransaction.student_id === studentId) {
          isStudentEligible = true;
        } else {
          isStudentEligible = false;
          Alert.alert("The book wasn't issued by this student!");
          this.setState({
            bookId: '',
            studentId: '',
          });
        }
      });
      return isStudentEligible;
    };
  

getStudentdetails=async(studentID)=>{
  studentID=studentID.trim();
  let dbquery=query(
    collection(db,books),
    where('studentID','==',studentID)
  )
  let studentref=await getDocs(dbquery)
  studentref.forEach((doc)=>{
    this.setState({
      studentName:doc.data().Name
    })  
  }) 
}
getBookdetails=async(bookID)=>{
  bookID=bookID.trim();
  let dbquery=query(
    collection(db,books),
    where('bookID','==',bookID)
  )
  let bookref=await getDocs(dbquery)
  bookref.forEach((doc)=>{
    this.setState({
      bookName:doc.data().name

    })
    
  }) 
}

    render(){
        const {domState,hasCameraPermissions,scanned,studentID,bookID}=this.state;
        if(domState!=="normal"){
           return(
            <BarCodeScanner 
            ScanningDone={scanned ? undefined : this.HandleBarcodeScanned}
            style={StyleSheet.absoluteFillObject}/>
           )
        }


        return(
            <View style={styles.container}>
                <View>
                    <View style={styles.textinputContainer}>
                        <TextInput
                        style={styles.textinput}
                        placeholder={"enter book ID"}
                        placeholderTextColor={"#FFFFFF"}
                        value={bookID }

                        />
                        <TouchableOpacity style={styles.scanbutton} 
                        onPress={()=>this.GetCameraPERMISSIONS("bookID")}>
                          <Text style={styles.scanbuttonText}>Scan</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.textinputContainer,{marginTop:25}]}>
                        <TextInput
                        style={styles.textinput}
                        placeholder={"enter student ID"}
                        placeholderTextColor={"#FFFFFF"}
                        value={studentID }

                        />
                        <TouchableOpacity style={styles.scanbutton}
                        onPress={()=>this.GetCameraPERMISSIONS("studentID")}>
                          <Text style={styles.scanbuttonText}>Scan</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.Button}
                    onPress={this.handleTransaction}>
                      <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
               
                
            </View>
            
        )
    }
}
const styles = StyleSheet.create({
    bgImage: {
      flex: 1,
      resizeMode: "cover",
      justifyContent: "center"
    },
    upperContainer: {
      flex: 0.5,
      justifyContent: "center",
      alignItems: "center"
    },
    appIcon: {
      width: 200,
      height: 200,
      resizeMode: "contain",
      marginTop: 80
    },
    appName: {
      width: 80,
      height: 80,
      resizeMode: "contain"
    },
    lowerContainer: {
      flex: 0.5,
      alignItems: "center"
    },
    textinputContainer: {
      borderWidth: 2,
      borderRadius: 10,
      flexDirection: "row",
      backgroundColor: "#9DFD24",
      borderColor: "#FFFFFF"
    },
    textinput: {
      width: "57%",
      height: 50,
      padding: 10,
      borderColor: "#FFFFFF",
      borderRadius: 10,
      borderWidth: 3,
      fontSize: 18,
      backgroundColor: "#5653D4",
      fontFamily: "Rajdhani_600SemiBold",
      color: "#FFFFFF"
    },
    scanbutton: {
      width: 100,
      height: 50,
      backgroundColor: "#9DFD24",
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      justifyContent: "center",
      alignItems: "center"
    },
    scanbuttonText: {
      fontSize: 24,
      color: "#0A0101",
      fontFamily: "Rajdhani_600SemiBold"
    },
    Button:{
        width:"43%",
        height:55,
        justifyContent:"center",
        alignItems:"center",
        borderRadius:7,
        backgroundColor:"Blue"
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#5653D4"
      },
      text: {
        color: "#ffff",
        fontSize: 15
      },
      buttonText: {
        fontSize: 24,
        color: "#FFFFFF"
      }
})