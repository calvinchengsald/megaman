
// checks if any object in this array has a primaryKeyName with the desired value
export function existsInArray(array, primaryKeyName, value){
    return getFromArray(array, primaryKeyName, value)?true:false
}

// same as existsInArray but returns the actual value
export function getFromArray(array, primaryKeyName, value){
    if(!array) return null
    for( var i = 0; i < array.length; i++){
        if (array[i][primaryKeyName] && array[i][primaryKeyName].trim() === value ) return array[i];
    }
    return null;
}