/**
 * Created by sbv23 on 08/12/2016.
 */

exports.msg = function msg(code, msg, data) {
    return '{' +
        ' "code": "'+ code +'",' +
        ' "msg": "'+ msg +'",' +
        ' "data": '+ data +'}';
};

