var Compare = require('./compareJSON');

//判断是否有重复项
var isInArray = function(array, sameElement){
    if(!(array instanceof Array)){
        return false;
    }else{
        for(var i=0; i<array.length; i++){
            //json1={a:1}, json2={a:1}, json1 != json2
            if(sameElement instanceof Object){
                // console.log("我是一个对象");
                // console.log('此次比对结果是：'+Compare(array[i], sameElement));
                // console.log('原告人：');
                // console.log(sameElement);
                // console.log('被告人：');
                // console.log(array[i]);
                if(Compare(array[i], sameElement) == true){
                    return true;
                }else{
                    continue;
                }
            }else{
                if(array[i] == sameElement){
                    return true;
                }
            }
        }
        return false;
    }
};

//于千军万马中挑出中意的小说内容
var selectCorrect = function(array){
    if(!(array instanceof Array)){
        return '';
    }else{
        for(var i=0; i<array.length; i++){
            if(array[i].length>300 && array[i].match('第*章')){
                return array[i];
            }
        }
        return '';
    }
}

//联合两个JSON数组, 比如JSON1=[{a:1, b:2}],JSON2=[{c:3, d:4}], concatJSON(JSON1, JSON2)结果为[{a:1, b:2, c:3, d:4}]
var concatJSON = function(JSONArray1, JSONArray2){
    var finalJSONArray = [];
    if(JSONArray1.length != JSONArray2.length){
        console.log('两个JSON数组长度不一致！！');
        return null;
    }
    for(var i=0; i<JSONArray1.length; i++){
        if((!JSONArray1[i] instanceof Array) || (!JSONArray2 instanceof Array)){
            console.log('不是JSON数组');
            return null;
        }
        var finalJSONArrayTemp = {};

        for(var attr in JSONArray1[i]){
            finalJSONArrayTemp[attr]=JSONArray1[i][attr];
        }
        for(var attr in JSONArray2[i]){
            finalJSONArrayTemp[attr]=JSONArray2[i][attr];
        }
        finalJSONArray.push(finalJSONArrayTemp);
    }
    return finalJSONArray;
}

exports.isInArray = isInArray;
exports.selectCorrect = selectCorrect;
exports.concatJSON = concatJSON;