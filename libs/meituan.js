var isInited = false; //初始化状态

function meiTuanReady(callback) {
    function init(bridge) {
        if (isInited) return;
        try {
            bridge.init();
            isInited = true;
        } catch (e) {
            console.log('init failed');
        }
    }

    // 如果有WebViewJavascriptBridge这个全局变量，
    // 则直接初始化它
    if (window.WebViewJavascriptBridge) {
        init(WebViewJavascriptBridge);
        callback(WebViewJavascriptBridge);
        return;
    }
    // 否则添加监听事件再初始化
    document.addEventListener('WebViewJavascriptBridgeReady', function () {
        init(WebViewJavascriptBridge);
        callback(WebViewJavascriptBridge);
    }, false);
}

//设置分享
function setMeiTuanShare(shareConfig) {
    meiTuanReady(function (bridge) {
        bridge.callHandler('callNativeMethod', {
            "moduleName": "platform",
            "methodName": "shareCommon",
            "data": {
                "channel": shareConfig.channel,//频道十进制值相加
                "content": shareConfig.content,//分享内容 兼容android 该字段必须有内容
                "content_-1": shareConfig.content,
                "content_1": true,
                "detailURL": shareConfig.href,//分享的详情链接
                "imageURL": shareConfig.imageURL,//分享的缩略图链接
                "title": shareConfig.title//分享的标题
            }
        }, function (res) {
            shareConfig.success && shareConfig.success(res);
        });

    });
}


/*channel 值说明*/
// eg:385 = 1 + 128 + 256 ，也就说说支持 新浪微博、微信好友、微信朋友圈 分享 (大部
// console.log(shareConfig)


function setKNBShare(shareConfig) {    
    KNB.use("waimai.shareCommon", {
        "channel": "640",
        "content": shareConfig.content,
        "content_-1": shareConfig.content,
        "detailURL": shareConfig.href,
        "imageURL": shareConfig.imageURL,
        "title": shareConfig.title,
        success: function (ret) {

        },
        fail: function (ret) {
            alert(ret)
        }
    })
}


function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return "";
}
function checkMeiTuanNewVersion() {
    // wm_appversion=5.5.5
    var isNew55 = false;
    var ver = getQueryString("wm_appversion");
    if (ver != "") {
        var args = ver.split(".");
        var num_1 = Number(args[0]);
        if (args.length >= 2) {
            var num_2 = Number(args[1]);
        } else {
            num_2 = 0;
        }

        if (num_1 > 5) {
            isNew55 = true;
        } else if (num_1 == 5 && num_2 >= 5) {
            isNew55 = true;
        }
    }

    return isNew55;
}

var meiTuanShareCofig = {};


function initMeiTuanShare(shareConfig) {
    //配置参数
    // var shareConfig = {
    // 	channel: '385',
    // 	content: "content",
    // 	href: "href",
    // 	imageURL: "imageURL",
    // 	title: "title",
    // 	success: function (res) {
    // 		//console.log("share success", res)
    // 	}
    // };
    meiTuanShareCofig = shareConfig;

    if(navigator.userAgent.indexOf("MicroMessenger") > -1){
        return;
    }

    if (checkMeiTuanNewVersion()) {
        var url = "https://s0.meituan.net/bs/knb/v1.2.4/knb.js";
        var doc = document;
        var head = doc.head || (doc.getElementsByTagName("head")[0] || doc.documentElement);
        var node = doc.createElement("script");
        node.onload = function () {
            this.loadKnbComplete(meiTuanShareCofig);
        }.bind(this);
        node.onerror = function () {
        };
        node.async = true;
        node.src = url;
        head.appendChild(node);
    } else {
        setMeiTuanShare(meiTuanShareCofig);
    }

}

function loadKnbComplete(shareConfig) {
    if (window["KNB"]) {
        setKNBShare(shareConfig);
    }
}

























