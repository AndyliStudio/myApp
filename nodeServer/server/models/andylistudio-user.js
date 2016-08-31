module.exports = function(Andylistudiouser) {
    //声明方法，使用callback return
    Andylistudiouser.sayHi = function(callback) {
        callback(null, 'hi, welcome to Andylistudio!!');
    };
    //注册方法
    Andylistudiouser.remoteMethod(
        'sayHi', {
            'accepts': [],
            'returns': [
                { 'arg': 'result', 'type': 'string' }
            ],
            'http': {
                'verb': 'get',
                'path': '/say-hi'
            }
        }
    );

    //声明一个写入用户是否第
};