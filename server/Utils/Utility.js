

// checks if any object in this array has a primaryKeyName with the desired value
function existsInArray(array, primaryKeyName, value){
    try {
        for( var i = 0; i < array.length; i++){
            if (array[i][primaryKeyName].trim() === value.trim() ) return true;
        }
        return false;
    }
    catch (error ) {
        return false;
    }
}

// same as existsInArray but returns the actual value
function getFromArray(array, primaryKeyName, value){
    try {
        for( var i = 0; i < array.length; i++){
            if (array[i][primaryKeyName].trim() === value.trim() ) return array[i];
        }
        return null;
    }
    catch (error ) {
        return false;
    }
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
    removeElementFromArrayByKey: removeElementFromArrayByKey,
    getFromArray: getFromArray
}