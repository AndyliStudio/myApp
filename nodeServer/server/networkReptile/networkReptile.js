var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var eventproxy = require('eventproxy');
var config = require('./config');
var schedule = require('node-schedule');
var myAppTools = require('./tools/myAppTools');
var fs = require('fs');
var htmlToText = require('html-to-text');
var chinese_parseInt = require('./tools/chinese-parseint');
var connectDB = require('./connectDB/connectDB');

var app = express();
var firstSignUrls = [];
var secondSign = config.websiteConfig[0].publishSite.baiduTieBa.secondSign;
var firstSign = config.websiteConfig[0].publishSite.baiduTieBa.firstSign;
//用于记录前半部分，包括num和title
var finalDataPart = [];
//最终数据
var finalData = [];
//记录页面数的字段
var pageIndex = 2;
var ep = new eventproxy();

var init = function(){
    var rule = new schedule.RecurrenceRule();
    //每天0点执行就是rule.hour =0;rule.minute =0;rule.second =0;
    // rule.second =[0, 10, 20, 30, 40, 50];
    rule.hour =18;rule.minute =0;rule.second =0;
    var j = schedule.scheduleJob(rule, function(){
        //每次执行前都清空firstSignUrls， finalDataPart，finalData
        firstSignUrls = [];
        finalDataPart = [];
        finalData = [];
        console.log('小说爬取中，每天18:00点更新.......');
        getFactionSectionList();
    });
};
init();

var getFactionSectionList = function(){
    superagent.get(config.websiteConfig[0].publishSite.baiduTieBa.url)
        .end(function (err, res) {
            if (err) {
                next(err);
            }
            var $ = cheerio.load(res.text);
            //test
            console.log("抓取到的最新的小说章节有" + $(firstSign).length + "章。");
            $(firstSign).each(function (idx, element) {
                var $element = $(element);
                var firstSignID = $element.attr(config.websiteConfig[0].publishSite.baiduTieBa.inWhatAttr);

                //获取章节数和章标题
                //这里做个判断并不是置顶的就一定会是小说，这些我们要排除
                if($element.text().indexOf('第') < 0 || $element.text().indexOf('章') < 0){
                  return true;
                }

                var href = url.resolve(config.websiteConfig[0].publishSite.baiduTieBa.coreUrl, firstSignID);
                if(!myAppTools.isInArray(firstSignUrls, href)){
                  firstSignUrls.push(href);
                }
                var reg = new RegExp('第.*章');
                var dealString = myAppTools.removeNaN(reg.exec($element.text())[0]);
                /*
                * 积累正则
                * var reg = new RegExp('第[一二三四五六七八九十]章');
                * dealString.slice(dealString.indexOf('第')+1, dealString.indexOf('章')).trim()
                * */
                var sectionNum = chinese_parseInt(dealString);
                var sectionTitle = $element.text().substring($element.text().indexOf('章')+1).trim();

                var finalDataPartElement = {
                    sectionNum: sectionNum,
                    sectionTitle: sectionTitle,
                    url: href,
                    sectionContent: '',
                    upDateTime: new Date()
                };

                if(!myAppTools.isInArray(finalDataPart, finalDataPartElement)){
                    finalDataPart.push(finalDataPartElement);
                }
            });
            // console.log(firstSignUrls);
            getFactionContent();
        });
};
var getFactionContent = function(){

    ep.after('getFactionContentEvent', firstSignUrls.length, function(allEvents){
        allEvents = allEvents.map(function(everyEvent){
            //根据小说内容扒取sectionNum
            var reg = new RegExp('第.*章');
            var sectionNum = chinese_parseInt(myAppTools.removeNaN(reg.exec(everyEvent)[0]));
            console.log(sectionNum);
            //对finalDataPart进行遍历，把内容填充进去，没拔到的留空
            for(var i=0; i<finalDataPart.length; i++){
                if(sectionNum == finalDataPart[i].sectionNum){
                    finalDataPart[i].sectionContent = everyEvent;
                }
            }

        });
        //至此爬虫执行完毕,将内容写进数据库

        console.log('以下是爬到的章节的内容，以及他们的存储情况：');
        for(var j=0; j<finalDataPart.length; j++){
            var jsonTemp = {
                factionName: '大主宰',
                sectionNum: finalDataPart[j].sectionNum,
                sectionTitle: finalDataPart[j].sectionTitle,
                sectionContent: finalDataPart[j].sectionContent,
                sectionResource: '百度贴吧',
                recentUpdateTime: finalDataPart[j].upDateTime
            };
            //调用存储函数
            connectDB.saveFaction(jsonTemp);
        }
    });

    firstSignUrls.forEach(function(firstSignUrl){
        //每次调用之前将pageIndex还原
        pageIndex = 2;
        getPageContent(firstSignUrl);
    });
};

//纯访问页面，为了递归调用
var getPageContent = function(url){
    var allTexts = [];
    superagent.get(url)
        .end(function(err, res){
            console.log('fetch '+url+' successful!');
            //将获取小说内容的工作放到superagent之后
            var $ = cheerio.load(res.text);
            $(secondSign).each(function(idx, element){
                var $element = $(element);
                //把html转text
                var text = htmlToText.fromString($element.html(), {wordwrap: 130});
                allTexts.push(text);
            });
            var sectionContent = myAppTools.selectCorrect(allTexts);
            //如果获取不到当前小说章节内容，尝试往下一页获取
            if(sectionContent == ''){
                //如果url包含pn
                var pnIndex = url.indexOf('?pn=');
                if(pnIndex >= 0){
                    var newUrl = url.substring(0, pnIndex)+'?pn='+ pageIndex;
                }else{
                    var newUrl = url+'?pn='+ pageIndex;
                }
                //为下一页做准备
                pageIndex++;
                getPageContent(newUrl);
            }else{
                //获取成功，把正确的文章内容传给after
                ep.emit('getFactionContentEvent', sectionContent);
            }
        });
};
