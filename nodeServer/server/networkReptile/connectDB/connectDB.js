var mongoose = require('mongoose');
var config = require('../config'); 
var chinese_parseInt = require('../tools/chinese-parseint');

// Connection URL 
var url = 'mongodb://'+config.mongoConfig.username+':'+config.mongoConfig.password+'@'+config.mongoConfig.url+':'+config.mongoConfig.port+'/'+config.mongoConfig.dbName;
// Use connect method to connect to the Server 
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('connect to mongodb successfully!!, the url is :'+url);
});

//定义存储小说内容的schema
var factionContentSchema = new mongoose.Schema({
    // _id:Schema.Types.ObjectId,  //主键
    // _fk:Schema.Types.ObjectId,  //外键--factionListSchema的_id
    sectionNum: {
        type: Number
    },
    sectionTitle: String,
    sectionContent: String
}, {safe:{j:1,w:1,wtimeout:10000}});

//定义存储小说的schema
var factionListSchema = new mongoose.Schema({
    // _id:Schema.Types.ObjectId,  //主键
    // _fk:Schema.Types.ObjectId,  //外键
    factionName: {
        type: String,
        trim: true //去除两边的空格
    },  //小说名
    sectionArray: [factionContentSchema], //小说章节列表, 每个元素是包含章节数、标题、章节内容的JSON
    factionResource: String, //小说来源
    updateTime: Date
}, {safe:{j:1,w:1,wtimeout:10000}}); //new Schema(config,options); j表示做1份日志，w表示做2个副本（尚不明确），超时时间10秒

//创建model
var factionListModel = mongoose.model('factionListModel', factionListSchema);
var factionContentModel = mongoose.model('factionContentModel', factionContentSchema);

//创建实例
var factionListEntity = new factionListModel();
var factionContentEntity = new factionContentModel();

console.log(factionListEntity);

//将东西存进mongo
factionListEntity.save(function(err){
    if(err){
        console.log("factionListEntity存储失败"+ err);
    }else{
        console.log("factionListEntity存储成功！！");
    }
});