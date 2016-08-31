var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var eventproxy = require('eventproxy');
var config = require('./config');
var schedule = require('node-schedule');

var app = express();
var firstSignUrls = [];

var init = function(){
    var rule = new schedule.RecurrenceRule();
    //每天0点执行就是rule.hour =0;rule.minute =0;rule.second =0;
    rule.minute =[0,10,20,30,40,50];
    var j = schedule.scheduleJob(rule, function(){
        getFirstSignUrl();
    });
};
init();

var getFirstSignUrl = function(){
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
                //写一个try catch处理JSON.parse
                var firstSignID = JSON.parse($element.attr('data-field')).id + '';
                //test
                // console.log(firstSignID);
                var href = url.resolve(config.websiteConfig[0].publishSite.baiduTieBa.coreUrl, firstSignID);
                firstSignUrls.push(href);
            });
            console.log(firstSignUrls);
        });
};

var getComment = function(){
    var ep = new eventproxy();
    ep.after('topic_html', topicUrls.length, function(topics){
        topics = topics.map(function(topicPair){
            var topicUrl = topicPair[0];
            var topicHtml = topicPair[1];
            var $ = cheerio.load(topicHtml);
            return ({
                title: $('.topic_full_title').text().trim(),
                href: topicUrl,
                comment1: $('.reply_content').eq(0).text().trim(),
            });
        });
        console.log('final:');
        console.log(topics);
    });

    topicUrls.forEach(function(topicUrl){
        superagent.get(topicUrl)
            .end(function(err, res){
                console.log('fetch '+topicUrl+' successful!');
                ep.emit('topic_html', [topicUrl, res.text]);
            });
    });
};