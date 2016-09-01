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

var app = express();
var firstSignUrls = [];
//用于记录前半部分，包括num和title
var finalDataPart = [];
//最终数据
var finalData = [];

var init = function(){
    var rule = new schedule.RecurrenceRule();
    //每天0点执行就是rule.hour =0;rule.minute =0;rule.second =0;
    rule.second =[0,10,20,30,40,50];
    var j = schedule.scheduleJob(rule, function(){
        //每次执行前都清空firstSignUrls， finalDataPart，finalData
        firstSignUrls = [];
        finalDataPart = [];
        finalData = [];
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
            var firstSign = config.websiteConfig[0].publishSite.baiduTieBa.firstSign;
            //test
            console.log("抓取到的最新的小说章节有" + $(firstSign).length + "章。");
            $(firstSign).each(function (idx, element) {
                var $element = $(element);
                var firstSignID = $element.attr(config.websiteConfig[0].publishSite.baiduTieBa.inWhatAttr);
                
                //test
                // console.log("第"+idx+'循环后finalDataPart为');
                // console.log(finalDataPart);

                //test
                // console.log(firstSignID);
                var href = url.resolve(config.websiteConfig[0].publishSite.baiduTieBa.coreUrl, firstSignID);
                if(!myAppTools.isInArray(firstSignUrls, href)){
                    firstSignUrls.push(href);
                }

                //获取章节数和章标题
                var dealString = $element.text();
                var sectionNum = chinese_parseInt(dealString.slice(dealString.indexOf('第')+1, dealString.indexOf('章')).trim());
                var sectionTitle = dealString.substring(dealString.indexOf('章')+1).trim();

                var finalDataPartElement = {
                    sectionNum: sectionNum,
                    sectionTitle: sectionTitle,
                    url: href
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
    var ep = new eventproxy();
    var secondSign = config.websiteConfig[0].publishSite.baiduTieBa.secondSign;

    ep.after('getFactionContentEvent', firstSignUrls.length, function(allEvents){
        allEvents = allEvents.map(function(everyEvent){
            var url = everyEvent[0];
            var html = everyEvent[1];
            var $ = cheerio.load(html);
            //写入文件
            fs.writeFile('result.txt', $.html(), function (err) {
                if (err) throw err;
            });

            var allTexts = [];
            $(secondSign).each(function(idx, element){
                var $element = $(element);
                //把html转text
                var text = htmlToText.fromString($element.html(), {
                    wordwrap: 130
                });
                allTexts.push(text);
            })

            return ({
                sectionContent: myAppTools.selectCorrect(allTexts)
            });
        });

        //为
        console.log('final:');
        finalData = myAppTools.concatJSON(finalDataPart, allEvents);
        console.log(finalData);
    });

    firstSignUrls.forEach(function(firstSignUrl){
        superagent.get(firstSignUrl)
            .end(function(err, res){
                console.log('fetch '+firstSignUrl+' successful!');
                ep.emit('getFactionContentEvent', [firstSignUrl, res.text]);
            });
    });
};