/**
 * 来电信息
 */

var CallInfo=function(config){
	config=config||{};
	this.renderId=config.renderId||"callInfo_div";
	this.call_Data=null;
	this.IOSessionId=null;//会话Id（通话的时候才会有）
	this.call_state_bar="call_state_bar";
	this.localImg="local_img";
	this.callingStatus=null;//通话状态
	
	/**
	 * 后台获取客户数据
	 * phone ：电话号码
	 * sessionId ：会话ID
	 * idCode    imei
	 * sosType  
	 * fn ： 回调函数
	 */
	this.ajaxCallInfo=function(phone,sessionId,idCode,sosType,fn){
		console.log("1-1-1-1:获取来电客户资料数据phone:"+phone+" ,sessionId:"+sessionId+" ,idCode:"+idCode);
		if(sessionId!=null && sessionId!=""){
			var part=this;
			$.ajax({
				type: 'POST',
		      	url:request_url+"/callinfo/getCallInfo.do?ds=" + new Date().getTime(),
		  		dataType: 'json',
		  		data: {"mobile" : phone,"sessionId":sessionId,"idCode":idCode,"sosType":sosType},
		  		success: function(result){
		  			console.log("2-2-2.获得来电信息");
		  			console.log(result);
					if(result.code=='0'){
						part.call_Data=result.data || {};
						//页面上显示客户资料
						part.showCallInfo(part.call_Data);
						if (fn && typeof fn === "function"){
							fn(part.call_Data);
						}
						
					}else{
						console.log("x-1.获得来电信息异常");
						part.showCallInfoByMobile(phone, sessionId,idCode);
						
					}
					
		  		},
		  		error:function(XMLHttpRequest, textStatus, errorThrown){
		  			console.log("x-2.获得来电信息错误");
		  			part.showCallInfoByMobile(phone, sessionId,idCode);
		  			
		  		}
		    });	
		}	
		
	}
	//该方法 当客户数据查询失败的时候调用
	this.showCallInfoByMobile=function(mobile,sessionId,idCode){
		this.call_Data={"mobile":mobile,"sessionId":sessionId,"idCode":idCode};
		this.showCallInfo(this.call_Data);
	}
	
	//显示客户来电数据
	this.showCallInfo=function(data){
		$("#noCall_div").hide();
		$("#callinfo_div").show();
		$("#save_call_name").hide();
		$("#save_call_mobile").hide();
		
		$("#call_name_span").val(data.customerName || null);
		
		
		$("#call_mobile_span").val(data.mobile);
		$("#call_memberName_span").text(data.memberName);
		$("#call_validityDate_span").text(data.validityDate);
		//请求类型
		var sosTypeText=Dict.getEnumName(Dict.enumClazzList.SosTypeEnum,data.sosType) || "";
		$("#call_sosType_span").text(sosTypeText!=null?sosTypeText:"");
		//来电设备类型
		var callFrom=Dict.getDictName(Dict.dictTypeList.CallFrom,data.callFrom) || "";
		$("#call_terminalType_span").text(callFrom);
		
		
		$("#"+this.localImg).show();
	}
	
	this.clearCallInfo=function(){
		$("#noCall_div").show();
		$("#callinfo_div").hide();
		$("#call_name_span").val(null);
		$("#call_mobile_span").val(null);
		$("#call_terminalType_span").text("");
		$("#call_memberName_span").text("");
		$("#call_validityDate_span").text("");
		$("#call_sosType_span").text("");
		$("#call_times_span").text("00:00:00");
		$("#"+this.localImg).hide();
		$("#save_call_name").hide();
		$("#save_call_mobile").hide();
		this.call_Data=null;
	}
	
	
	
	//更新通话状态
	this.updateCallingStatus=function(code){
		this.callingStatus=code;
		
		var da=BaseData.getCallingStatusObj(code);
		
		if($("#"+this.call_state_bar)){
			if(da!=null){
				$("#"+this.call_state_bar).text(da.text).css("background",da.color);
			}else{
				$("#"+this.call_state_bar).text("");
			}
		}
	}
	
	this.updateIOSession=function(IOSessionId){
		this.IOSessionId=IOSessionId || null;
	}
	
	this.init=function(){

		
	}

}

//开始通话计时
CallInfo.prototype.startCallTime = function(){
	this.startTime = (new Date()).getTime();
	this.stopCallTime();
	this.showCallTime();
}

//显示通话时长
CallInfo.prototype.showCallTime = function(){
	var now = (new Date()).getTime() - this.startTime;
	if(now < 0){
		now = 0;
		this.startTime = (new Date()).getTime();
	}
	$("#call_times_span").text(shapeTimeformat(now));
	this.timerID = setTimeout("PageUtil.callInfo.showCallTime()",1000);
}
//停止通话计时
CallInfo.prototype.stopCallTime = function(){
	if(this.timerID){
		try{
			clearTimeout(this.timerID);
		}catch (e) {
		}
	}
}

/**********************0.救援误报提醒*********************************************/
CallInfo.prototype.onRescuePrompt = function(data,fn){
	console.log("救援误报提醒开始获取客户资料");
	console.log(data);
	var sessionid=data!=null?data.sessionid:null;
	
	if(sessionid!=null && sessionid!=""){
		var idCode=data.idCode || null;
		var sosType=BaseData.heraldFlag;
		this.ajaxCallInfo(data.mobile,sessionid,idCode,sosType,fn);
		this.updateCallingStatus(BaseData.callingStatusList.formationTips.code);
		
	}
}
//等待客户连接
CallInfo.prototype.onWaitRescueConnect=function(){
	this.updateCallingStatus(BaseData.callingStatusList.waitConnect.code);
	
}
//客户取消救援连接
CallInfo.prototype.onCancelRescueConnect=function(){
	this.updateCallingStatus(BaseData.callingStatusList.cancelRescue.code);
	
}

/**********************1.来电弹屏(振铃)*********************************************/
////fn 将查询到的客户信息回调出去 加载地图
CallInfo.prototype.onCallRing = function(data,fn){
	var sessionid=data!=null?data.sessionid:null;
	if(sessionid!=null && sessionid!=""){
		this.call_Data=null;
		//1.获取来电信息，fn回调 显示当前位置，碰撞数据等信息
		var sosType=data.sosType || null;
		this.ajaxCallInfo(data.mobile,sessionid,data.idCode,sosType,fn);
		this.updateIOSession(data.IOSessionId);
		this.updateCallingStatus(BaseData.callingStatusList.ringCall.code);
		$("#call_times_span").text("00:00:00");
	}
	
	
}
//2.视频电话接通{"sessionid":"1111","mobile":"133xxxxxxx","type":"callType"}

CallInfo.prototype.onAnswerCall=function(data,fn){
	var mobile=data!=null?data.mobile:null;
	if(mobile!=null && mobile!=""){
		
		this.updateIOSession(data.IOSessionId);
		
		this.updateCallingStatus(BaseData.callingStatusList.answerCall.code);
		//1.开始计时
		this.startCallTime();

		//3.更新客户接触数据
		//this.answerByUpdateCallLog(data);

		
	}
}
//电话未挂断，刷新页面重新接入电话
CallInfo.prototype.onReplayAnswerCall=function(data,fn){
	//console.log("2.电话接入获得来电信息");
	var sessionid=data!=null?data.sessionid:null;
	
	if(sessionid!=null && sessionid!=""){
		//1.获取来电信息
		var sosType=data.sosType || null;
		this.ajaxCallInfo(data.mobile,sessionid,data.idCode,sosType,fn);
		this.updateIOSession(data.IOSessionId);
		this.updateCallingStatus(BaseData.callingStatusList.answerCall.code);
		
		//2.开始计时
		this.startCallTime();
;
		//4.更新客户接触数据
		//this.answerByUpdateCallLog(data);
		
	}
	
}
//3.视频通话结束（挂断）
CallInfo.prototype.onCallEnd =function(data){

	this.updateIOSession(null);
	//在通话中的时候才处理
	if(this.call_Data!=null){
		//停止通话计时
		this.stopCallTime();
		this.updateCallingStatus(BaseData.callingStatusList.endCall.code);

		//3.更新来电数据
		//this.callEndByUpdateCallLog(this.call_Data);
		
		
	}
	
}

//4.socket连接断开时调用(非正常断开)
CallInfo.prototype.onCallDiscon=function(){
	this.updateIOSession(null);
	if(this.call_Data!=null){
		var da={'mobile':this.call_Data.CPhone,'sessionid':this.call_Data.sessionid || ""}
		//this.updateCallLog(da,this.call_Data);
		//this.removeCallInfo(this.call_Data.CPhone);
		//this.clearCallInfo();
	}
	
}

/**
 * 
 * 来电振铃 开始保存客户接触数据
 */
CallInfo.prototype.saveCallLog=function(call_Data){
	console.log("保存客户接触开始");
	console.log(this.call_Data);
	call_Data=call_Data || this.call_Data;
	var params={};
	params["mobile"]=call_Data.mobile;
	params["sessionId"]=call_Data.sessionId;//标识（用作缓存处理）
	params["cid"]=call_Data.cid || null;
	params["lng"]=call_Data.longitude || null;//经度
	params["lat"]=call_Data.latitude || null;//纬度
	params["sosReqType"]=call_Data.sosReqType||null;//触发方式
	params["sosType"]=call_Data.sosType || null;//来电类型

	if(CurrentUser){
		params["userId"]=CurrentUser.id;
	}
	console.log(params);
	setTimeout("PageUtil.callInfo.startSaveCallLogInfo("+JSON.stringify(params)+")",500);

}

CallInfo.prototype.startSaveCallLogInfo=function(params){
	if(params){
		var part=this;
		this.ajaxSaveCallLog("../callLog/saveCallLog.do", params,function(result){
			console.log("---------客户接触保存完成返回数据----------");
			console.log(result);
			if(result.success){
				if(part.call_Data!=null){
					part.call_Data.callLogId=result.data.id;
				}
			}
		});
	}
}


/**
 * 
 * 电话接通的时候 更新客户接触数据
 */
CallInfo.prototype.answerByUpdateCallLog=function(data){
	console.log("电话接通更新客户接触");
	var params={};
	params["mobile"]=data.mobile;
	params["sessionId"]=data.sessionid;//标识（用作缓存处理）
	if(this.call_Data!=null){
		params["cid"]=this.call_Data.cid || null;
		params["lng"]=this.call_Data.longitude || null;//经度
		params["lat"]=this.call_Data.latitude || null;//纬度
		params["sosReqType"]=this.call_Data.sosReqType||null;//触发方式
		params["sosType"]=this.call_Data.sosType || null;//来电类型
		params["id"]=this.call_Data.callLogId || null;
	}
	if(CurrentUser){
		params["userId"]=CurrentUser.id;
	}
	
	setTimeout("PageUtil.callInfo.startUpdateCallLogInfo("+JSON.stringify(params)+")",2000);
	
	
}

CallInfo.prototype.startUpdateCallLogInfo=function(params){
	if(params){
		part=this;
		this.ajaxSaveCallLog("../callLog/answerBySaveCallLog.do", params,function(result){
			if(result.success){
				if(part.call_Data!=null){
					part.call_Data.callLogId=result.data.id;
				}
			}
		});
	}
}

/**
 * 电话挂断 更新客户接触数据
 */
CallInfo.prototype.callEndByUpdateCallLog=function(call_Data){
	console.log("电话挂断更新客户接触");
	var params={};
	if(call_Data!=null && call_Data.mobile){
		params["mobile"]=call_Data.mobile;
		params["sessionId"]=call_Data.sessionId;//标识（用作缓存处理）
		
		params["cid"]=call_Data.cid || null;
		params["lng"]=call_Data.longitude || null;//经度
		params["lat"]=call_Data.latitude || null;//纬度
		params["sosReqType"]=call_Data.sosReqType||null;//触发方式
		params["sosType"]=call_Data.sosType || null;//来电类型
		params["id"]=call_Data.callLogId || null;
		if(CurrentUser){
			params["userId"]=CurrentUser.id;
		}
		
		
		setTimeout("PageUtil.callInfo.startEndUpdateCallLogInfo("+JSON.stringify(params)+")",2000);
		
		
	}
}

CallInfo.prototype.startEndUpdateCallLogInfo=function(params){
	
	this.ajaxSaveCallLog("../callLog/callEndByUpdateCallLog.do", params);
}



/**
 * ajax 请求后台数据
 * @param url
 * @param params
 * @param fn
 */
CallInfo.prototype.ajaxSaveCallLog=function(url,params,fn){
	console.log(url);
	console.log(params);
	if(url && params){
		$.ajax({
	  		async:true,
	      	type:'POST',
	      	url:url+"?ds="+new Date().getTime(),
	      	data:params,
	  		cache:false,
	  		dataType: 'json', 
	  		success: function(result){
	  			if (fn && typeof fn === "function"){
	  				fn(result);
	  			}
			},
	        error: function(){}
		});
	}
}

