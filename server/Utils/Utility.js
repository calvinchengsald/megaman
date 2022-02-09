

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

function removeElementFromArray( array, value) {
    var newArray = [];
    for ( var i = 0; i < array.length; i++) {
        if (array[i] !== value) {
            newArray.push(array[i]);
        }
    }
    return newArray;
}

/**
 * Checks if this x/y coordinate does not exist inside any boundary in 'boundaryArray'
 * WARNING: this method assumes boundaries are created with the top-left point as Coordinate0 and bot-right point as Coordinate1
 * @param [] boundaryArray - array of boundary json, denoted with x0,y0,x1,y1. Boundary is a square created between these 2 coordinates 
 * @param {int} x x coordinate being checked 
 * @param {int} y y coordinate being checked
 */
function isWithinPlayableArea( boundaryArray, x, y){
    for(const boundary of boundaryArray){
        if(x >= boundary.x0 && x<=boundary.x1 && y >= boundary.y0 && y<=boundary.y1){
            return false
        }
    }
    return true
}

// similar to isWithinBoundary except player also needs to be 'killDistance' deep into the boundary
function isWithinPlayableAreaKillZone(boundaryArray, x, y, killDistance){
    for(const boundary of boundaryArray){
        if(x >= boundary.x0 && x<=boundary.x1 && y >= boundary.y0 && y<=boundary.y1 && isWithinPlayableAreaKillDistance(boundary, x,y,killDistance)){
            return false
        }
    }
    return true
}

//helper method that checks if this unit is 'killDistance' deep into the boundary for main method isWithinBoundaryKillZone
function isWithinPlayableAreaKillDistance( boundary, x, y, killDistance){
    return (Math.abs(x-boundary.x0)>killDistance || Math.abs(x-boundary.x1)>killDistance ||
            Math.abs(y-boundary.y0)>killDistance || Math.abs(y-boundary.y1)>killDistance)
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
    removeElementFromArray: removeElementFromArray,
    getFromArray: getFromArray,
    isWithinPlayableArea: isWithinPlayableArea,
    isWithinPlayableAreaKillZone: isWithinPlayableAreaKillZone
}