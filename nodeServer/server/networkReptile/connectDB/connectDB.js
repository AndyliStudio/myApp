var mongoose = require('mongoose');
var Schema = mongoose.Schema;
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
    sectionNum: {
        type: Number
    },
    sectionTitle: String,
    sectionContent: String,
    sectionResource: String,//小说来源
    recentUpdateTime: Date  //最新的更新时间，用来比对最新文章
}, {safe:{j:1,w:1,wtimeout:10000}});

//定义存储小说的schema
var factionListSchema = new mongoose.Schema({
    // _id:{type: Schema.Types.ObjectId},  //主键
    // _fk:Schema.Types.ObjectId,  //外键
    factionName: {
        type: String,
        trim: true //去除两边的空格
    },  //小说名
    des: String, //小说说明
    headerImage: String, //小说首图链接
    author: String, //小说作者
    sectionArray: [{type: Schema.Types.ObjectId, ref: factionContentSchema._id}], //小说章节列表, 每个元素是包含章节数、标题、章节内容的JSON
    updateTime: Date //更新时间
}, {safe:{j:1,w:1,wtimeout:10000}}); //new Schema(config,options); j表示做1份日志，w表示做2个副本（尚不明确），超时时间10秒

//创建model
var factionListModel = mongoose.model('factionListModel', factionListSchema);
var factionContentModel = mongoose.model('factionContentModel', factionContentSchema);

//初始化函数
var init = function(){
    //创建实例
    var factionListEntity = new factionListModel({factionName: '大主宰', des: '大千世界，位面交汇，万族林立，群雄荟萃，一位位来自下位面的天之至尊，在这无尽世界，演绎着令人向往的传奇，追求着那主宰之路。 无尽火域，炎帝执掌，万火焚苍穹。 武境之内，武祖之威，震慑乾坤。 西天之殿，百战之皇，战威无可敌。 北荒之丘，万墓之地，不死之主镇天地。 ...... 少年自北灵境而出，骑九幽冥雀，闯向了那精彩绝伦的纷纭世界，主宰之路，谁主沉浮？ 大千世界，万道争锋，吾为大主宰。', headerImage: 'http://res.cloudinary.com/idwzx/image/upload/v1472746056/dazhuzai_y6428k.jpg', author: '天蚕土豆',sectionArray: ['57c85f18463272883ffd8283'], updateTime: new Date()});
    factionListEntity.save(function(err){
        if(err){
            console.log("小说列表实体存储失败，"+ err);
        }else{
            console.log("小说列表实体存储成功！");
        }
    });
    //创建实例
    var factionContentEntity = new factionContentModel({sectionNum: 1, sectionTitle: '测试章节', sectionContent: '这是我存进去的第一章，仅供测试', sectionResource: '百度贴吧', recentUpdateTime: new Date()});
    factionContentEntity.save(function(err){
        if(err){
            console.log("小说内容实体存储失败，"+ err);
        }else{
            console.log("小说内容实体存储成功！");
        }
    });
    //关闭数据库链接
    // db.close();
};
// init();

//存储小说的方法
var saveFaction = function(json){
    console.log("casaspo");
    if(!(json.factionId && json.sectionNum && json.factionName)){
        console.log('存储数据时，格式错误！！');
        return;
    }else{
        //首先写好sectionArray，最重要的
        //先查询要存入的内容是否存在，不存在则存入，否则摒弃
        console.log('adasda');
        factionListModel.find()
                           .populate({
                               path: 'sectionArray'
                           })
                           .sort({updateTime: -1})
                           .exec(function(err, list){
                               if(err){
                                   console.log("查询mongo失败！"+err);
                               }else{
                                   console.log(list);
                                   for(var j=0; j<list.length; j++){
                                       if(json.factionName == list[i].factionName && json.sectionNum == list[i].sectionNum){
                                           //数据已存在
                                           console.log("数据重复，放弃存储！！");
                                           return;
                                       }
                                   }
                                   //组装数据
                                   var jsonTemp = {
                                        factionId: json.factionId,
                                        sectionNum: json.sectionNum,
                                        sectionTitle: json.sectionTitle,
                                        sectionContent: json.sectionContent,
                                        sectionResource: json.sectionResource,
                                        recentUpdateTime: json.recentUpdateTime
                                   };
                                   //创建实例
                                   console.log(jsonTemp);
                                   var factionContentEntity = new factionContentModel(jsonTemp);
                                   factionContentEntity.save(function(err){
                                      if(err){
                                         console.log("小说第"+jsonTemp.sectionNum+"章内容存储失败，"+ err);
                                      }else{
                                        console.log("小说第"+jsonTemp.sectionNum+"章内容存储成功！");
                                      }
                                   });
                               }
                           });
    }
};

//调试saveFaction
var jsonTest = {
    factionId: '57c852bb86e27207333281ee',
    factionName: '大主宰',
    sectionNum: 2,
    sectionTitle: '测试章节2',
    sectionContent: '这是用于测试的第二章',
    sectionResource: '百度贴吧',
    recentUpdateTime: new Date()
}
saveFaction(jsonTest);