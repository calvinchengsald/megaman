

// checks if any object in this array has a primaryKeyName with the desired value
function existsInArray(array, primaryKeyName, value){
    return getFromArray(array, primaryKeyName, value)?true:false
}

// same as existsInArray but returns the actual value
function getFromArray(array, primaryKeyName, value){
    if(!array) return null
    for( var i = 0; i < array.length; i++){
        if (array[i][primaryKeyName] && array[i][primaryKeyName].trim() === value.trim() ) return array[i];
    }
    return null;
}

// checks if any value in this object equals the given value
function existsInObject(object, value){
    if(!object) return false
    var keys = Object.keys(object)
    for(var i = 0; i<keys.length; i++){
        if(object[keys[i]]===value) return true
    }
    return false
}


// from the input 'array' find the object with field name 'primaryKeyName' that has the value 'primaryKeyValue' and remove it
function removeElementFromArrayByKey( array , primaryKeyName, primaryKeyValue) {
    var newArray = [];
    for ( var i = 0; i < array.length; i++) {
        if (array[i][primaryKeyName] !== primaryKeyValue) {
            newArray.push(array[i]);
        }
    }
    return newArray;
}


function basicJson(field, value) {
    return {
        [field]: value
    }
}
function generateRandomLetterString(size) {
    var letterString = "";
    for(let i=0; i<size; i++){
        letterString+=getRandomLetter();
    }
    console.log("generating: " + letterString)
    return letterString
}

function getRandomLetter(){
    return String.fromCharCode(65+ Math.floor(Math.random() * 26))
}


module.exports = {
    generateRandomLetterString: generateRandomLetterString,
    basicJson: basicJson,
    existsInArray: existsInArray,
    existsInObject: existsInObject,
    removeElementFromArrayByKey: removeElementFromArrayByKey,
    getFromArray: getFromArray
}