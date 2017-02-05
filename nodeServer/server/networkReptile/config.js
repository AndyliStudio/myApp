var websiteConfig = [
  {
    factionName: '大主宰',
    des: '大千世界，位面交汇，万族林立，群雄荟萃，一位位来自下位面的天之至尊，在这无尽世界，演绎着令人向往的传奇，追求着那主宰之路。 无尽火域，炎帝执掌，万火焚苍穹。 武境之内，武祖之威，震慑乾坤。 西天之殿，百战之皇，战威无可敌。 北荒之丘，万墓之地，不死之主镇天地。 ...... 少年自北灵境而出，骑九幽冥雀，闯向了那精彩绝伦的纷纭世界，主宰之路，谁主沉浮？ 大千世界，万道争锋，吾为大主宰。',
    headerImage: 'http://qiniu.andylistudio.com/myblog/images/dazhuzai.jpg',
    author: '烟雨江南',
    allResources: [
      {
        sourceName: '爱下电子书',
        url: 'http://read.ixdzs.com/66/66485/',
        coreUrl: 'http://read.ixdzs.com/66/66485/',
        des: '爱下电子书-大主宰，再给出的页面中罗列了所有的小说章节，在爬取的时候得分不同的情况',
        firstSign: '.catalog .chapter > a',
        inWhatAttr: 'href',//链接存储的属性
        secondSign: '.content'
      }
    ]
  }
];
var localMongoJson = {
  url: 'localhost',
  port: '27017',
  dbName: 'myapp',
  username: 'lidikang',
  password: '123456'
};
var mongoConfig = {
  url: 'ds021326.mlab.com',
  port: '21326',
  dbName: 'myapp',
  username: 'lidikang',
  password: '121960425mongo'
}
//暴露websiteConfig
exports.websiteConfig = websiteConfig;
exports.mongoConfig = mongoConfig;
exports.localMongoJson = localMongoJson;
