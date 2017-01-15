var loopback = require('loopback');
var boot = require('loopback-boot');
// var weappSession = require('weapp-session');

var app = module.exports = loopback();
// app.use(weappSession({
//     appId: '',      // 微信小程序 APP ID
//     appSecret: '',  // 微信小程序 APP Secret

//     // REDIS 配置
//     // @see https://www.npmjs.com/package/redis#options-object-properties
//     redisConfig: {
//         host: '0.0.0.0',
//         port: '6379',
//         password: '121960425redis'
//     },

//     // （可选）指定在哪些情况下不使用 weapp-session 处理
//     ignore(req, res) {
//         return /^\/api\//.test(req.url);
//     }
// }));

// app.use(function(req, res){
//     res.json({
//         // 在 req 里可以直接取到微信用户信息
//         wxUserInfo: req.$wxUserInfo
//     });
// });

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
