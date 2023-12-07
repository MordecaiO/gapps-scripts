/* Number cases 
44 7.... / add plus symbol + 
if number is 12 digits long and begins with 44 
then add + 

*/


const numberParse = (phoneNum) => {
    let phoneNumAsString = phoneNum.toString() 
    if(phoneNumAsString.length === 12 && phoneNumAsString[0] === "4" && phoneNumAsString[1] === "4"){
        return "+" + phoneNumAsString ; 
    }
}

console.log(numberParse(447454480493))
