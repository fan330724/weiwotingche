
module.exports.hexString2Array=hexString2Array;
module.exports.array2Hexstring=array2Hexstring;
module.exports.utf8Encode=utf8Encode;
module.exports.utf8Decode=utf8Decode;

/**
 * 16进制字符串转Byte数组
 */
function hexString2Array(hexString){
    var len=hexString.length/2;
    var array=[];
    for(var i=0;i<len;i++){
        var sData=hexString.substr(i*2,2);
        var data=parseInt(sData,16);
        array.push(data);
    }
    return array;
}

/**
 * Byte数组转16进制字符串
 */
function array2Hexstring(array){
    var hexstring="";
    for(var i=0;i<array.length;i++){
        hexstring+=array[i].toString(16);
    }
    return hexstring;
}

/**
 * UFT8字符串转Byte数组
 */
function utf8Encode(str){
    var array=[];
    for(var i=0;i<str.length;i++){
        array.push(str.charCodeAt(i));
    }
    return array;
}

/**
 * Byte数组转UFT8字符串
 */
function utf8Decode(array){
    var str="";
    for(var i=0;i<array.length;i++){
        str+=String.fromCharCode(array[i]);
    }
    return str;
}