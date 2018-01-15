/** 单独部署时为IP和port * */
var ip = "";
var system_name = "/WeChat";
var prefix_url = getUrl();
function getUrl() {
	if ("" != ip) {
		return ip + "/";
	} else {
		var URL_1 = window.location + "";
		return URL_1.substring(0, URL_1.indexOf(system_name));
	}
}
var webroot = prefix_url + system_name;
var request_url = prefix_url + system_name;
var request = {
	QueryString : function(val) {
		var uri = window.location.search;
		var re = new RegExp("" + val + "=([^\&\?]*)", "ig");
		return ((uri.match(re)) ? (uri.match(re)[0].substr(val.length + 1))
				: null);
	}
}

var layer_index;
/*iframe弹出框口*/
function layer_iframe_show(title, url, w, h) {
    if (title == null || title == '') {
        title = false;
    }
    if (url == null || url == '') {
        url = "404.html";
    }
    if (w == null || w == '') {
        w = 800;
    }
    if (h == null || h == '') {
        h = ($(window).height() - 50);
    }
    layer_index = layer.open({
        type: 2,
        area: [w + 'px', h + 'px'],
        fix: false, //不固定
        maxmin: true,
        resize:true,
        shade: 0.4,
        title: title,
        skin: 'layui-layer-molv', //样式类名
        content: url
    });
}
/*关闭iframe弹出框口*/
function layer_iframe_close() {
    layer.close(layer_index);
}
function layer_content(title, content, w, h){
	if (title == null || title == '') {
        title = false;
    }
    if (w == null || w == '') {
        w = 420;
    }
    if (h == null || h == '') {
        h = 320;
    }
	layer.open({
		type: 1,
		title: title,
		skin: 'layui-layer-molv', //样式类名
		area: [w + 'px', h + 'px'],
		content: content
	});
}
/*弹出提示框*/
function layer_alert(message) {
	layer.alert(message, {icon: 6});
}
/*弹出提示框*/
/*function layer_msg_a(message, callback) {
	layer.msg(message, {
		  time: 0, //不自动关闭
		  btn: ['确定', '取消'],
		  yes: function(index){
		    layer.close(index);
		    callback();
		  }
	});
}*/
/*弹出提示框，会自动消失*/
function layer_msg_b(message) {
	layer.msg(message);
}
/*弹出提示框，会自动消失，带图标*/
function layer_msg_c(message) {
	layer.msg(message, {icon: 5});
}
/*弹出询问层*/
function layer_confirm(msg, callback) {
	layer.confirm(msg, {
		  skin: 'layui-layer-molv', //样式类名
		  btn: ['确定','取消'] //按钮
		}, function(index){
			layer.close(index);
			callback();
		}, function(){
		  
		});
}

function openWinLogin(username,fn){
	layer.open({
		type:1,
		title:["登录过期,请重新输入密码并确认","color:red;"],
		//skin:'layui-layer-molv',
		area: ['320px','200px'],
		content:"<div style='padding:10px; margin-top:10px;'>" +
				"<div class='input-group'> " +
				"<span class='input-group-addon'><i class='fa fa-key fa-fw'></i></span>" +
				"<input id='win_login_password' type='password' class='form-control' placeholder='密码' style='width:250px;' />" +
				"</div>" +
				"<div id='win_login_tips' style='margin-top:10px;color:red;text-align:center;font-size:12px;'></div>" +
				"</div>",
		btn:['确定'],
		yes:function(index,layero){
			$("#win_login_tips").text("");
			var password=$("#win_login_password").val();
			if(password!=null && password!=""){
				replayLogin(username,password,
					function(){
						layer.close(index);
						layer_msg_b("登陆成功!");
						if (fn && typeof fn === "function"){
							fn();
						}
					},
					function(msg){
						$("#win_login_tips").text(msg);
					}
				);
				
			}else{
				$("#win_login_tips").text("请输入登陆密码!");
				return;
			}
			
		}
	
	});
}

function replayLogin(username,password,successFn,failFn){
	if(username!=null && password!=null){
		$.ajax({
	        type: "post",
	        url: request_url+'/login.do',
	        data: {"username": username,"password": password},
	        dataType: "json",
	        success: function(data) {
				if(data.code=='0') {
					if (successFn && typeof successFn === "function"){
						successFn();
					}
				}else {
					if (failFn && typeof failFn === "function"){
						failFn(data.message);
					}
				}			
	      	 },
	      	 error: function (XMLHttpRequest, textStatus, errorThrown) {
	      		if (failFn && typeof failFn === "function"){
					failFn("网络异常!");
				}
	         }
		 });
	}
}



//ajax 请求error处理
function errorExcepHandler(xhr, textStatus, errorThrown){
	console.log("AJAX请求错误返回数据................");
	console.log(xhr);
	var rs=xhr.responseText || "";
	if(rs=="unlogin"){
		if(CurrentUser && CurrentUser.loginName!=null && CurrentUser.loginName!=""){
			openWinLogin(CurrentUser.loginName);
		}else{
			layer.alert("未登录或登录过期",{title:"提示",icon:6,closeBtn:0},function(){
				window.location.href = "/WeChat/html/login.html";
			});
		}
	}else if(rs=="otherlogin"){
		layer.alert("当前用户已在其他位置登陆",{title:"提示",icon:6,closeBtn:0},function(){
			window.location.href = "/WeChat/html/login.html";
		});
	}else if(rs=="Read timed out"){
		layer_msg_b("请求超时");
	}else{
		layer_msg_b("系统错误");
	}
}

/*表单接口数据异常解析提醒*/
function exceptionHandler(xhr, textStatus, errorThrown) {
	console.log("exceptionHandler:");
	console.log(xhr);
	if(xhr.code == 0){
		if(xhr.records == 0){
			layer_msg_b("暂无数据");
		}
	}else if(xhr.code == 2) {
		window.location.href = "/WeChat/html/login.html";
		layer_msg_b(xhr.message);
		throw new Error(xhr.message);
	}else{
		layer_msg_b(xhr.message);
		throw new Error(xhr.message);
	}
	
}

/**
 * 把毫秒转换时间格式(00:00:00)显示
 * @param time
 * @return
 */
function shapeTimeformat(time){
	
	var Min = 60,		//分
		Hr = Min * 60,	//小时
		now = time/1000,
		h = Math.floor(now/Hr),
		m = Math.floor((now%Hr)/Min),
		s = Math.floor((now%Hr)%Min);
	time = null;
	return ((h < 10 ? '0' : '')+h) + ((m < 10 ? ':0' : ':')+m) + ((s < 10 ? ':0' : ':')+s);
	
}

/**
 * 判断系统当前时间是否在时间段范围内
 * @param beginTime
 * @param endTime
 * @return
 */
function validateTimeRange(beginTime,endTime,nowTime){
	var beginStr = beginTime.split (":");
	var endStr = endTime.split (":");
	if (beginStr.length != 2){
        return false;
    }
    if (endStr.length != 2){
        return false;
    }
    var begin = new Date ();
    var end = new Date ();
    begin.setHours (beginStr[0]);
    begin.setMinutes (beginStr[1]);
    end.setHours (endStr[0]);
    end.setMinutes (endStr[1]);
    if(nowTime.getTime () - begin.getTime () > 0 && nowTime.getTime () - end.getTime () < 0){
        return true;
    }else{
        return false;
    }
}

/**
 * 验证输入的内容是否为数字
 * @param id
 * @return
 */
function validateNum(id){
	    var textId="#"+id+"_label";
 	    var labelField=$(textId).text();
	    var values= $.trim($("#"+id).val());
	    var re = /^\d*\.?\d{1,2}$/;
	    if(re.test(values)){
			var vl = values.indexOf(".");
			if(vl != -1 && vl != 0){
				var vlval = values.substr(0,1);
				if(vlval == 0){
	    			layer_alert("请在"+labelField+"服务项处输入数字");
					return false;
				}else{
					return true;
				}
			}else{
				if(values.length > 1){
					var vlval = values.substr(0,1);
					if(vlval == 0){
		    			layer_alert("请在"+labelField+"服务项处输入数字");
						return false;
					}else{
						return true;
					}
				}
			}
			return true;
		}else{
			layer_alert("请在"+labelField+"服务项处输入数字");
			return false;
		}
}

function validateMobile(mobile){
    var textId="#"+mobile+"_label";
	var labelField=$(textId).text();
    var values= $.trim($("#"+mobile).val());
    var re = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
    if(!re.test(values)){
    	layer_alert("请在"+labelField+"服务项处输入完整的手机号码！");
		return false;
	}
    return true;
}

/**
 * 获取html页面间传递参数的方法
 * 例子:getUrlParam(terminalId)   获取终端ID参数的值
 * @param name
 * @return
 */
function getUrlParam(name){  
    //构造一个含有目标参数的正则表达式对象  
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");  
    //匹配目标参数  
    var r = window.location.search.substr(1).match(reg);  
    //返回参数值  
    if (r!=null) return unescape(r[2]);  
    return null;  
}
/**
 * 获取html页面间传递参数的方法
 * @param name 中文取值 decodeURI(findUrlParam("userName"));
 * @returns
 */
function findUrlParam(name){
	var loca=String(window.document.location.href);
	var rs=new RegExp("(^|)"+name+"=([^&]*)(&|$)","gi").exec(loca),tmp;
	if(tmp=rs){
		return tmp[2];
	} 
	return null;
	
}




function FormatDate (strTime) {
	    var date = new Date(strTime);
	    var nowMonth = String((date.getMonth()+1));
    	var nowDay = String(date.getDate());				   
    	var nowHours = String(date.getHours());	
    	var nowMinutes = String(date.getMinutes());	
    	var nowSeconds = String(date.getSeconds());
	    if(nowMonth.length==1) nowMonth = "0"+nowMonth; 
    	if(nowDay.length==1) nowDay = "0"+nowDay;		    
    	if(nowHours.length==1) nowHours = "0"+nowHours;		
    	if(nowMinutes.length==1) nowMinutes = "0"+nowMinutes;		
    	if(nowSeconds.length==1) nowSeconds = "0"+nowSeconds; 
	    return date.getFullYear()+"-"+nowMonth+"-"+nowDay+" "+nowHours+":"+nowMinutes+":"+nowSeconds;
}



/**
 * 创建下拉列表框数据
 * @param sid       select下拉框ID
 * @param store     数据store
 * @param valPro    val对应的字段 enum 为“code” ， obj为“id”
 * @param textPro   text 显示值  “name”
 */
function createSelectOption(sid,store,valPro,textPro){
	valPro = valPro || "code",textPro = textPro || "name";
	if(sid != null){
		$("#"+sid).empty();
		if(store!=null && store.length>0){
			$.each(store,function(index,data){
				$("<option></option>").val(data[valPro]).text(data[textPro]).appendTo($("#"+sid));
			});
			$("#"+sid).val(null);
		}
	}
	
}



/**
 * 将form对象参数序列化 并转换为json对象
 * @returns {___anonymous120_121}
 */
jQuery.prototype.serializeObject=function(){  
    var a,o,h,i,e;  
    a=this.serializeArray();  
    o={};  
    h=o.hasOwnProperty;  
    for(i=0;i<a.length;i++){  
        e=a[i];  
        if(!h.call(o,e.name)){  
            o[e.name]=e.value;  
        }  
    }  
    return o;  
};  

/**
 * 打开或隐藏搜索条件的面板
 * @return
 */
function openSearch(){
    if($("#searchItem").css("display") == "block"){
        $("#searchItem").css("display", "none");
    } else {
        $("#searchItem").css("display", "block");
    }
}

/**
 * 点击空白处隐藏搜索条件弹出层
 * @return
 */
function hideSearch(){
	$(document).bind("click",function(e){
		var target  = $(e.target);
		if(!target.hasClass("dropdown-toggle")&&!target.closest("#searchItem").hasClass("search-more")&&!target.hasClass("layui-layer-btn0")){    //判断鼠标点击的区域是不是非确定按钮
			$("#searchItem").css("display", "none");
		}
		e.stopPropagation();
	});
}

//根据客户手机号码获取车辆信息
function findCarByMobile(mobile,skxbTerminalId,fn){
	if(mobile){
		$.ajax({
			async:true,
			type:'POST',
	        url: request_url+'/callinfo/findCarList.do?ds='+new Date().getTime(),
			dataType: 'json',
			cache:false,
			data:{"mobile":mobile,"skxbTerminalId":skxbTerminalId},
			success: function(result){
				if(result.success){
					if (fn && typeof fn === "function"){
						fn(result.data);
					}
				}
				
			},
			error:function(){}
		});
	}
}

function findCarByTerminalId(terminalId,fn){
	if(cid){
		$.ajax({
			async:true,
			type:'POST',
	        url: request_url+'/car/findCarListByTerminalId.do?ds='+new Date().getTime(),
			dataType: 'json',
			cache:false,
			data:{"terminalId":terminalId},
			success: function(result){
				if(result.success){
					if (fn && typeof fn === "function"){
						fn(result.data);
					}
				}
				
			},
			error:function(){}
		});
	}
}


//根据服务类型 获取技师信息
function findTechnicianList(serveType,fn){
	if(serveType){
		$.ajax({
			async:true,
			type:'POST',
	        url: request_url+'/technician/findTechnicianListByServeType.do?ds='+new Date().getTime(),
			dataType: 'json',
			cache:false,
			data:{"serveType":serveType},
			success: function(result){
				if (fn && typeof fn === "function"){
					fn(result);
				}
				
			},
			error:function(){}
		});
	}
}

/**
  * 初始化短信分类下拉框
  */
 function initSmsVerifySelectOption(val){
		$.ajax({
				async:true,
				type:'GET',
	            url: parent.request_url+'/smsVerify/list.do',
				dataType: 'json',
				cache:false,
				success: function(response){
					var data = response.rows;
					
					if(null != data && data.length > 0){
						$('#'+val).empty();
							$.each(data,function(index,obj){
								$("<option></option>").val(obj.id).text(obj.name).appendTo($('#'+val));
							});
							$('#'+val).val(null);
						}
				},error: function (XMLHttpRequest, textStatus, errorThrown) {
       			parent.layer_msg_b("获取分类数据失败！");
              }
		});
}
