// namespace:
this.answerjs = this.answerjs || {};

(function () {
    "use strict";

    function WxShare() {     

        this.JSSDKURL = "";
        this.title = "";
        this.desc = "";
        this.link = "";
        this.imgUrl = "";
        this.type = "";
        this.dataUrl = "";

        // this.onSuccess = this.onSuccessCallback().bind(this);
        this.onCancel = this.onCancelCallback.bind(this);

    }

    var p = WxShare.prototype;

    p.isWeiXin = function() {
        return navigator.userAgent.indexOf("MicroMessenger") > -1;
    }

  

    p.init = function (jssdk, isJsonp, useEncodeURI) {


        if (!this.isWeiXin()) {          
            return;
        }

        this.JSSDKURL = jssdk || "";
        this.isJsonp = isJsonp || false;
        this.useEncodeURI = useEncodeURI || false;

        var url = "https://res.wx.qq.com/open/js/jweixin-1.2.0.js";
        var doc = document;
        var head = doc.head || (doc.getElementsByTagName("head")[0] || doc.documentElement);
        var node = doc.createElement("script");
        node.onload = function () {
            this.loadJweixinComplete();
        }.bind(this);
        node.onerror = function () {
        };
        node.async = true;
        node.src = url;
        head.appendChild(node);

    }
    p.loadJweixinComplete = function () {
        var uri = location.href;
        if (this.useEncodeURI) {
            uri = encodeURIComponent(uri);
        }

        if (this.isJsonp) {
            $.ajax({
                url: this.JSSDKURL,
                dataType: "jsonp",
                jsonp: "callback",
                data: { url: uri },
                success: function (data) {
                    this.onLoadJsonpComplete(data)
                }.bind(this)
            })
        } else {
            $.ajax({
                url: this.JSSDKURL,
                type: "POST",
                data: { url: uri },
                success: function (data) {
                    this.onLoadJsonpComplete(JSON.parse(data))
                }.bind(this)
            })
        }
    }
    // 用户确认分享后执行的回调函数
    p.onSuccessCallback = function (type) {
       
    }
    // 用户取消分享后执行的回调函数
    p.onCancelCallback = function () {
        
    }

    p.onLoadJsonpComplete = function (data) {      
        var d = {
            debug: false,
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: answerjs.WxShare.jsApiList
        }
        // console.log(d)
        this.wxConfigReady(d);
    }
    p.wxConfigReady = function (data) {
        wx.config(data);
        wx.ready(function () {            
            this.update();    
        }.bind(this));
    }
    p.update = function () {
        // 分享到朋友圈
        wx.onMenuShareTimeline({
            title: this.desc, // 分享标题
            link: this.link, // 分享链接
            imgUrl: this.imgUrl, // 分享图标
            success: function () {
                this.onSuccessCallback("share_timeline");
            }.bind(this),
            cancel: this.onCancel
        });
        // 分享给朋友
        wx.onMenuShareAppMessage({
            title: this.title, // 分享标题
            desc: this.desc, // 分享描述
            link: this.link, // 分享链接
            imgUrl: this.imgUrl, // 分享图标
            type: this.type, // 分享类型,music、video或link，不填默认为link
            dataUrl: this.dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                this.onSuccessCallback("share_app_message");
            }.bind(this),
            cancel: this.onCancel
        });
        // 分享到QQ
        wx.onMenuShareQQ({
            title: this.title, // 分享标题
            desc: this.desc, // 分享描述
            link: this.link, // 分享链接
            imgUrl: this.imgUrl, // 分享图标
            success: function () {
                this.onSuccessCallback("share_qq");
            }.bind(this),
            cancel: this.onCancel
        });
        // 分享到腾讯微博
        wx.onMenuShareWeibo({
            title: this.title, // 分享标题
            desc: this.desc, // 分享描述
            link: this.link, // 分享链接
            imgUrl: this.imgUrl, // 分享图标
            success: function () {
                this.onSuccessCallback("share_weibo");
            }.bind(this),
            cancel: this.onCancel
        });
        // 分享到QQ空间
        wx.onMenuShareQZone({
            title: this.title, // 分享标题
            desc: this.desc, // 分享描述
            link: this.link, // 分享链接
            imgUrl: this.imgUrl, // 分享图标
            success: function () {
                this.onSuccessCallback("share_qzone");
            }.bind(this),
            cancel: this.onCancel
        });

    }


    WxShare.jsApiList = [
        "onMenuShareTimeline",
        "onMenuShareAppMessage",
        "onMenuShareQQ",
        "onMenuShareWeibo"
    ];

    answerjs.WxShare = WxShare;

} ());

