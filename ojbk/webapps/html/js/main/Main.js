var PageUtil={};
/**
 * 初始化入口
 */
PageUtil.initLayout=function(){
	
	console.log("当前用户信息：");
	console.log(CurrentUser);
	
	var topWrapper=PageUtil.topWrapper =new TopWrapper();
	topWrapper.render();
	
	var callInfo=PageUtil.callInfo=new CallInfo();

	initMain();
	
	
}

//显示轨迹
PageUtil.drawMapPathInfo=function(){
	var callData=PageUtil.callInfo.call_Data;
	if(callData){
		var mapPage = document.getElementById("map_page").contentWindow || document.frames["map_page"].contentWindow;
		if(mapPage){
			mapPage.startDrawPath(callData.sessionId);
		}
	}
}


//点击位置小图标重新显示当前位置
PageUtil.showLocal=function(){
	console.log("重新显示当前位置.....");
	var callData=PageUtil.callInfo.call_Data;
	console.log(callData);
	if(callData){
		var mapPage = document.getElementById("map_page").contentWindow || document.frames["map_page"].contentWindow;
		if(mapPage){
			mapPage.initShowMapAndAccidentLevel(callData);
		}
	}
}


/**
 * 切换到主页
 */
PageUtil.switchMainPage=function(){
	$(".J_menuTab").removeClass("active");
	$("#map_page_tab").addClass("active");
	$(".J_iframe").css("display", "none");
	$("#map_page").css("display", "inline");
	$("#services").show();
}




/**
 * 获取来电数据，显示地图当前位置，视频数据，碰撞数据，事故等级
 * callData   客户当前来电数据
 */
PageUtil.initShowByCallData=function(callData){
	if(callData!=null){
		var mapPage = document.getElementById("map_page").contentWindow || document.frames["map_page"].contentWindow;
		if(mapPage){
			mapPage.initShowMapAndAccidentLevel(callData);
			//显示轨迹 延时3秒
			setTimeout(function(){
				mapPage.startDrawPath(callData.sessionId);
			},3000);
		}
		//PageUtil.showHistorRescue(callData);
		showSosTypeContext(callData.sosType,callData.uploadData);

	}
}

/**
 * 刷新历史救援单记录
 */
PageUtil.refreshRescue=function(){
	console.log("点击刷新历史救援单记录");
	layer_alert("当前功能未完成...");
	//PageUtil.showHistorRescue(PageUtil.callInfo.call_Data);
}

PageUtil.showHistorRescue=function(callData){
	if(callData){
		var mobile=PageUtil.callInfo.call_Data.mobile;
		var cid=PageUtil.callInfo.call_Data.cid;
		//PageUtil.historyRescue.show(mobile,cid);
	}
}




/**
 * 还原清空地图数据
 */
PageUtil.clearGaoDeMapInfo=function(){
	var mapWin = document.getElementById("map_page").contentWindow || document.frames["map_page"].contentWindow;
	if(mapWin){
		//mapWin.clearMapInfo();
	}
}
//电话挂断 停止加载视频数据
PageUtil.stopLoadVideo=function(){
	var mapWin = document.getElementById("map_page").contentWindow || document.frames["map_page"].contentWindow;
	if(mapWin){
		mapWin.stopLoadVideo();
	}
}



PageUtil.hideRescueBtnDiv=function(){
	console.log("----------开始隐藏rescueBtnDiv---------")
	var mapWin = document.getElementById("map_page").contentWindow || document.frames["map_page"].contentWindow;
	if(mapWin){
		mapWin.hideRescueBtnDiv();
	}
	
}


/**
 * 保存操作记录
 */
//PageUtil.saveCurrentSchedule=function(content){
//	if(PageUtil.callInfo.call_Data){
//		var mobile=PageUtil.callInfo.call_Data.mobile;
//		var sessionId=PageUtil.callInfo.call_Data.sessionId;
//		PageUtil.schedule.saveSchedule(mobile,sessionId,content);
//	}
//	
//}


/**
 * 高德地图发送接口
 */
PageUtil.gdMapSend=function(navigateMode,poi){
	console.log("发送信息点数据：");
	console.log(poi);
	var callData=PageUtil.callInfo.call_Data;
	var callingStatus=PageUtil.callInfo.callingStatus;//通话状态
	console.log("通话状态callingStatus="+callingStatus);
	//正在通话中才能下发信息点
	if(callData && callData!=null && (callingStatus!=null && callingStatus!=BaseData.callingStatusList.endCall.code)){
		var sosType=callData.sosType;
		//当sosType=1的时候 为一键通导航
		if(sosType!=null && sosType=="1"){
			var params={'mobile':callData.mobile,'sessionId':callData.sessionId};
			params['imei']=callData.imei;
			params['cid']=callData.cid;
			params['callLogId']=callData.callLogId
			params['latitude']=poi.location.lat;//lat纬度
			params['longitude']=poi.location.lng;//lng经度
			params['mapType']=BaseData.mapType.GDMAP.code;//下发地图(高德地图 为“8”，对应数据字典'com.ecar.skxb.poi.enums.MapTypeEnum')
			params['navigateMode']=navigateMode;//导航方式（数据字典：Navigate_mode）
			params['poiName']=poi.name;//内容（信息点名称）
			params['poiAddress']=poi.cityName || poi.address;//地址
//			if(CurrentUser){
//				params['createBy.id']=CurrentUser.id;
//			}
			PageUtil.sendMapInfo(params);
		}else{
			layer.alert("非一键通导航无法下发信息点!",{icon:2,title:['提示','text-align:left'],skin:'layui-layer-molv'});
		}
	}else{
		layer.alert("只能在客户来电的时候下发信息点！",{icon:2,title:['提示','text-align:left'],skin:'layui-layer-molv'});
	}
	
}

PageUtil.sendMapInfo=function(params){
	console.log("发送信息点：");
	console.log(params);
	if(params){
		var tipIndex = layer.msg("正在下发信息点...",{icon: 16,shade: 0.2,time:15000}); 
		$.ajax({
			url: request_url+'/poiSendRecord/sendPoi.do?ds='+new Date().getTime(),
			type: 'POST',
			timeout: 15000,
			async:false,
			cache:false,
			dataType: "json",
			data:params , 
			success:function(result){
				console.log(result);
				layer.close(tipIndex);
				if(result.success){
					layer.alert("信息点下发成功!",{icon:1,title:['提示','text-align:left'],skin:'layui-layer-molv'},function(index){
						layer.close(index);
						//自动挂断电话
//						if(PageUtil.callInfo.call_Data !=null){
//							//PageUtil.ivs.onDiscon(PageUtil.callInfo.call_Data.mobile,PageUtil.callInfo.IOSessionId,PageUtil.callInfo.call_Data.idCode);
//				
//						}
					});
				}else{
					layer.alert("信息点下发失败!",{icon:2,title:['提示','text-align:left'],skin:'layui-layer-molv'});
				}
				
			},
			error:function(xhr, textStatus, errorThrown){
				layer.close(tipIndex);
				errorExcepHandler(xhr, textStatus, errorThrown);
			}
		});
		
	}else{
		layer.alert("参数为空，发送信息点失败!",{icon:2,title:['提示','text-align:left'],skin:'layui-layer-molv'});
	}
	
}
/**
 * 添加常用信息点
 * contentType 信息点类型
 */
PageUtil.savePoiCommon=function(contentType,poi){
	
	console.log("设置常用信息点");
	var callData=PageUtil.callInfo.call_Data;
	//callData={"mobile":"18827602854"}
	var callingStatus=PageUtil.callInfo.callingStatus;//通话状态
	if(callData && callData!=null && (callingStatus!=null && callingStatus!=BaseData.callingStatusList.endCall.code)){
		var tipIndex = layer.msg("正在设定常用地址...",{icon: 16,shade: 0.2,time:15000});
		var params={'mobile':callData.mobile};
		params['imei']=callData.imei;
		params['content']=poi.name;
		params['posX']=poi.location.lat;//lat纬度
		params['posY']=poi.location.lng;//lng经度
		params['map_Type']=BaseData.mapType.GDMAP.code;//(默认高德地图)
		params['content_Type']=contentType;//信息点类型 (0:上班 1:下班 2:外出)
		params['content_Info']=poi.address;
		
		console.log(params);
		
		$.ajax({
			url: request_url+'/poiCommon/save.do',
			type: 'POST',
			timeout: 10000,
			async:false,
			cache:false, 
			data:params, 
			dataType:"json",
			success:function(result){
				layer.close(tipIndex);
			    if(result && result.success){
			    	layer.alert("常用地址设置成功!",{icon:1,title:['提示','text-align:left'],skin:'layui-layer-molv'});
			    	//PageUtil.poiCommon.show(callData.CPhone);
			    }else{
			    	layer.alert("常用地址设置失败!",{icon:2,title:['提示','text-align:left'],skin:'layui-layer-molv'});
			    }
			},
			error: function(xhr, textStatus, errorThrown) {
				layer.close(tipIndex);
				errorExcepHandler(xhr, textStatus, errorThrown);
			}
		});
	}else{
		layer.alert("没有获取到来电信息!",{icon:2,title:['提示','text-align:left'],skin:'layui-layer-molv'});
	}
};

function showSosTypeContext(code,uploadData){
	var text="";
	if(code && code!=null && code!=""){
		text=Dict.getEnumName(Dict.enumClazzList.SosTypeEnum,code);
		text=text==null?"":text;
	}
	
	if(typeof(uploadData)!="undefined" && uploadData==false){
		text+=" （未获取到终端上传数据，系统默认“一键通导航”服务！";
		text+="<a href='#' title='尝试重新获取数据' onclick='reloadCallDataInfo()'> <i class='fa fa-fire fa-lg'></i></a>";
		text+=" ）";
	}
	
	$("#sosType_tips").html(text);
}

//重新获取来电数据
function reloadCallDataInfo(){
	console.log("重新获取来电数据............");
	var callData=PageUtil.callInfo.call_Data;
	if(callData!=null && callingStatus!=null && callingStatus!=BaseData.callingStatusList.endCall.code){
		$("#sosType_tips").html("正在重新获取车机上传数据..........");
		PageUtil.switchMainPage();
		PageUtil.callInfo.ajaxCallInfo(callData.mobile,callData.sessionId,callData.idCode,callData.sosType,PageUtil.initShowByCallData);
	}else{
		layer_alert("当前未通话或通话结束,无法重新获取数据!");
	}
	
}


//发送救援进度数据
PageUtil.sendRescueStateInfo=function(cid,data){
	console.log("发送救援进度：cid="+cid);
	console.log(data);
	var callData=PageUtil.callInfo.call_Data;
	var callingStatus=PageUtil.callInfo.callingStatus;//通话状态
	if(callData && callData!=null && (callingStatus!=null && callingStatus!=BaseData.callingStatusList.endCall.code)){
		if(cid==callData.cid){
			PageUtil.ivs.onSendPromptInfo(callData.mobile,PageUtil.callInfo.IOSessionId,callData.idCode,data);
		}else{
			layer_msg_c("救援单客户ID与当前通话客户ID不匹配，无法发送救援进度数据!");
		}
	}else{
		layer_msg_c("当前未通话或通话已结束，无法发送救援进度数据!");
	}
}

//回拨电话
PageUtil.backPhone=function(){
	console.log("-------点击回拨按钮-------");
	$('#backPhone_modal').modal({backdrop:'static',keyboard: false});
	var customerPhone=null,customerName=null,sessionId=null;
	var callData=PageUtil.callInfo.call_Data;
	console.log(callData);
	if(callData!=null){
		customerPhone=callData.mobile || null;
		customerName=callData.customerName || null;
		sessionId=callData.sessionId || null;
	}
	$("#back_customer_phone").val(customerPhone);
	$("#back_customer_name").val(customerName);
	$("#back_sessionId").val(sessionId);
	
}


PageUtil.backConnecting=function(params,fn){
	//params={"terminalId":"翼云终端ID","idCode":"设备IMEI","sosType":"服务类型","tSource":"设备来源"};
	console.log("开始执行回拨连接.......");
	console.log(params);
	var callingStatus=PageUtil.callInfo.callingStatus;
	if(callingStatus==null || callingStatus==BaseData.callingStatusList.endCall.code 
			|| callingStatus==BaseData.callingStatusList.cancelRescue.code){
		
		//var tipIndex = layer.msg("正在执行回拨操作,请稍等...",{icon: 16,shade: 0.2,time:10000});
		
		PageUtil.ivs.onBackConnecting(params,fn);
		
		
		
	}else{
		layer_msg_b("当前正在通话或正在等待通话中,无法发起回拨连接!");
	}
	
	
	
}


//点击确认按钮
function backPhoneInfo(){
	var phone=$.trim($("#back_customer_phone").val());
	var customerName=$.trim($("#back_customer_name").val());
	var sessionId=$("#back_sessionId").val();
	if(phone!=null && phone!=""){
		if((/^1(3|4|5|7|8)\d{9}$/.test(phone))){ 
			console.log("调用回拨接口数据");
			
			var params={"customerName":customerName,"customerPhone":phone,"sessionId":sessionId};
			
			sendBackPhone(params);
			
			
		}else{
			layer_alert("电话号码格式错误!");
		}
	}else{
		layer_alert("客户电话号码不能为空!");
	}
	
}

function sendBackPhone(params){
	console.log(params);
	var tipIndex = layer.msg("正在回拨电话...",{icon: 16,shade: 0.2,time:30000});
	$.ajax({
		url: request_url+'/backPhoneRecord/sendBack.do',
		type: 'POST',
		timeout: 15000,
		async:false,
		cache:false, 
		data:params , 
		dataType:"json",
		success:function(result){
			layer.close(tipIndex);
			console.log("回拨返回结果......");
			console.log(result);
		    if(result && result.success){
		    	layer.alert("回拨电话成功!",{icon:1,title:['提示','text-align:left'],skin:'layui-layer-molv'});
		    	$("#backPhone_modal").modal('hide');
		    }else{
		    	layer.alert(result.message,{icon:2,title:['提示','text-align:left'],skin:'layui-layer-molv'});
		    }
		},
		error: function(xhr, textStatus, errorThrown) {
			layer.close(tipIndex);
			errorExcepHandler(xhr, textStatus, errorThrown);
		}
	});
	
}

function initMain(){
	
	$("#call_name_span").change(function(){
		var val=$.trim($(this).val());
		if(val!=null && val!=""){
			$("#save_call_name").show();
		}else{
			$("#save_call_name").hide();
		}
		
	});
	
	$("#call_mobile_span").change(function(){
		var val=$.trim($(this).val());
		if(val!=null && val!=""){
			$("#save_call_mobile").show();
		}else{
			$("#save_call_mobile").hide();
		}
		
	});
	
	
	
}



function editCustomer(index){
	var callData=PageUtil.callInfo.call_Data;
	if(callData!=null && callData.cid!=null && callData.cid!=""){
		var customerName=null,customerMobile=null;
		if(index==1){
			customerName=$.trim($("#call_name_span").val());
		}else if(index==2){
			customerMobile=$.trim($("#call_mobile_span").val());
			if(!(/^1(3|4|5|7|8)\d{9}$/.test(customerMobile))){ 
				layer_alert("手机号码输入错误!");  
		        return; 
		    } 
		}
	
		var params={'id':callData.cid,'niceName':customerName,'mobile':customerMobile};
		saveCustomerInfo(params,function(result){
			if(result && result.success){
				if(index==1){
					layer.tips('客户姓名更新成功','#call_name_span',{
						tips: [1, '#3595CC']
					});
					PageUtil.callInfo.call_Data.customerName=customerName;
					$("#save_call_name").hide();
				}else if(index==2){
					layer.tips('客户电话更新成功','#call_mobile_span',{
						tips: [1, '#3595CC']
					});
					$("#save_call_mobile").hide();
				}
			}else{
				if(index==1){
					layer.tips('客户姓名更新失败','#call_name_span',{
						tips: [1, '#FF5722']
					});
				}else if(index==2){
					layer.tips('客户电话更新失败','#call_mobile_span',{
						tips: [1, '#FF5722']
					});
				}
			}
		});
	}else{
		layer_alert("没有获取到客户ID,无法更新客户信息!");
		return;
	}
	
}

function saveCustomerInfo(params,fn){

		var tipIndex = layer.msg("正在更新客户数据...",{icon: 16,shade: 0.2,time:30000});
		$.ajax({
			url: request_url+'/customer/saveCustomer.do',
			type: 'POST',
			timeout: 10000,
			async:false,
			cache:false, 
			data:params , 
			dataType:"json",
			success:function(result){
				console.log("更新客户信息返回数据：");
				console.log(result);
				layer.close(tipIndex);
				
				if (fn && typeof fn === "function"){
					fn(result);
				}
				
				
//				if(result && result.success){
//					layer.alert("客户数据更新成功!",{icon:1,title:['提示','text-align:left'],skin:'layui-layer-molv'});
//				}else{
//					layer.alert("客户数据更新失败!",{icon:2,title:['提示','text-align:left'],skin:'layui-layer-molv'});
//				}
				
			},
			error: function(xhr, textStatus, errorThrown) {
				layer.close(tipIndex);
				errorExcepHandler(xhr, textStatus, errorThrown);
			}
		});
			
		
		
	
}




//function remindTitle(title,flag,time){
//	if(flag==1){
//		document.title = title
//		flag=2;
//	}else{
//		document.title = "<span style='color:blue'>"+title+"</span>"; 
//		flag=1;
//	}
//	setTimeout(function(){
//		remindTitle(title,flag,time);
//		
//	},time);
//	
//}



