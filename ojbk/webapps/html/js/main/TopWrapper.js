
var loadLayer_Index;
var TopWrapper=function(config){
	config=config||{};
	this.renderId=config.renderId || "top_wrapper";
	
	 //重连次数
	this.reConnectCount=0;
	//排队等待客户数
	this.customerWaitingSum = 0;
	//示忙时长
	this.busyTimes = 0;
	//示闲时长
	this.freeTimes = 0;

	//临时计时
	this.lonTime = 0;
	
	//按钮id 标记前缀
	this.topBtn_Flag="topBtn_";
	
	this.topIdList={
			customerWaitingSum:"customerWaitingSum_",
			busyDuration:"busyDuration_",
			freeDuration:"idleDuration_",
			currentState:"currentState_",
			pcStatus:"pcStatus_",

	};

	
	this.buttonList={
			FREEBTN:{code:'free',name:'示闲',btnCls:'btn-success',translate:"translate_004",disabled:true},//disabled 不可用
			BUSYBTN:{code:'busy',name:'示忙',btnCls:'btn-success',translate:"translate_003",disabled:true},
			ANSWERBTN:{code:'answer',name:'应答',btnCls:'btn-success',translate:"translate_001",disabled:true},
			DISCONBTN:{code:'discon',name:'挂断',btnCls:'btn-success',translate:"translate_002",disabled:true},
			BACKPHONE:{code:'backphone',name:'回拨',btnCls:'btn-primary',translate:'',disabled:false}

	};
	

	this.getButtonByCode=function(code){
		var part=this;
		var btn=null;
		$.each(part.buttonList,function(index,data){
			if(data.code==code){
				btn=data;
				return false;
			}
		});
		return btn;
	};
	
	this.createButton=function(btnData){
		var btnClass='btn btn-sm '+(btnData.btnCls || 'btn-success');
		var btnHtml="<li class='hidden-xs'>";
		btnHtml+="<button id='"+this.topBtn_Flag+btnData.code+"' type='button' class='"+btnClass+"' ";
		if(btnData.disabled){
			btnHtml+=" disabled='disabled' ";
		}
		btnHtml+=">";
		btnHtml+=btnData.name;
		btnHtml+="</button>";
		btnHtml+="</li>";
		return 	btnHtml;
		
	}
	
	
	this.initButtons=function(){
		var btnArr = new Array(); 
		var part=this;
		$.each(this.buttonList,function(index,data){
			btnArr.push(part.createButton(data)); 
		});
		
		return btnArr.join('');
	};
	
//	this.init=function(){
//		
//		var html=[];
//		
//		html.push('<nav class="navbar navbar-static-top" role="navigation" style="margin-bottom: 0">');
//		
//		html.push('<div class="navbar-header">');
//		html.push('<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="#"><i class="fa fa-bars"></i> </a>');
//		html.push('<div class="tim">');
//		html.push('<label>示忙时长：</label><span id="'+this.topIdList.busyDuration+'">00:00:00</span>');
//		html.push('<label>示闲时长：</label><span id="'+this.topIdList.idleDuration+'">00:00:00</span>');
//		html.push('<label>排队：</label><span id="'+this.topIdList.customerWaitingSum+'">0</span>');
//		html.push('<label>当前状态：</label><span id="'+this.topIdList.currentState+'">无</span>');
//		html.push('<label>PC连接状态：</label><span id="'+this.topIdList.pcStatus+'">连接断开</span>');
//		html.push('</div>');
//		html.push('</div>');
//		html.push('<ul class="nav navbar-top-links navbar-right" id="top_ul">');
//		html.push(this.initButtons());
//		html.push('<li class="dropdown hidden-xs">');
//		html.push('<a class="right-sidebar-toggle" aria-expanded="false"><i class="fa fa-tasks"></i> 主题</a>');
//		html.push('</li>');
//		html.push('</ul>')
//		html.push('</nav>');
//		return html.join('');
//		
//		
//	};
	
	this.render=function(){
		$("#"+this.renderId).prepend(this.initButtons());
		$(".right-sidebar-toggle").click(function () {
	        $("#right-sidebar").toggleClass("sidebar-open")
	    })
		this.initEvent();
	};
}

TopWrapper.prototype.initEvent=function(){
	var part=this;
	$("#"+this.renderId+" li>button").click(function(){
		var btnId=$(this).attr("id");
		if(btnId){
			var code=btnId.substr(part.topBtn_Flag.length);
			part.buttonEvent(code);
		}
	});
	
}
//点击按钮事件
TopWrapper.prototype.buttonEvent=function(code){
	console.log("获得点击按钮：code="+code);
	switch(code){
		//示闲 
		case this.buttonList.FREEBTN.code:
			PageUtil.ivs.onChangeStatus(this.buttonList.FREEBTN.translate,function(da){
				//判断成功还是失败
				console.log("点击示闲返回结果："+da);
				
			});
			
			break;
		//示忙	
		case this.buttonList.BUSYBTN.code:
			PageUtil.ivs.onChangeStatus(this.buttonList.BUSYBTN.translate,function(da){
				//判断成功还是失败
				console.log("点击示忙返回结果："+da);
				
			});
			break;
		//应答	
		case this.buttonList.ANSWERBTN.code:
			//this.onAnswer_Event();
			if(PageUtil.callInfo.call_Data !=null){
				var idCode=PageUtil.callInfo.call_Data.idCode;
				PageUtil.ivs.onAnswer(PageUtil.callInfo.call_Data.mobile,PageUtil.callInfo.IOSessionId,idCode);
			}
			
			
			break;
		//挂断
		case this.buttonList.DISCONBTN.code:
			if(PageUtil.callInfo.call_Data !=null){
				loadLayer_Index=layer.msg('正在挂断电话...', {
					  icon: 16,
					  time:3000,
					  shade: 0.01
				});
				PageUtil.ivs.onDiscon(PageUtil.callInfo.call_Data.mobile,PageUtil.callInfo.IOSessionId,PageUtil.callInfo.call_Data.idCode);
			}
			//this.onDiscon_Event();
			break;
			
		//回拨电话	
		case this.buttonList.BACKPHONE.code:
			
			PageUtil.backPhone();
			break;
	}
}
/**
 * 监听按钮状态
 * @param code
 */
TopWrapper.prototype.listenerButtonStatus=function(code){
	switch(code){
	//示闲
	case this.buttonList.FREEBTN.code:
		this.onFree_Event();
		break;
	//示忙	
	case this.buttonList.BUSYBTN.code:
		this.onBusy_Event();
		break;
	//应答	
	case this.buttonList.ANSWERBTN.code:
		this.onAnswer_Event();
		break;
	//挂断
	case this.buttonList.DISCONBTN.code:
		this.onDiscon_Event();
		break;
}
}




//验证用户socket 连接状态 
TopWrapper.prototype.verifyConnStatus=function(connection){
	if(connection){
		//建立连接(默认示忙)
		this.onBusy_Event();
	}else{
		//连接断开（所有按钮都不可用）
		this.onSocketDiscon_Event();
	}
};


//示闲按钮事件
TopWrapper.prototype.onFree_Event=function(){
	this.btnIsEnable(this.buttonList.FREEBTN.code, false);
	this.btnIsEnable(this.buttonList.BUSYBTN.code, true);
	this.updateSeatStatus(BaseData.seatStatusList.FREESTATUS.id);
};
//示忙
TopWrapper.prototype.onBusy_Event=function(){
	this.btnIsEnable(this.buttonList.FREEBTN.code, true);
	this.btnIsEnable(this.buttonList.BUSYBTN.code, false);
	this.updateSeatStatus(BaseData.seatStatusList.BUSYSTATUS.id);
};

TopWrapper.prototype.onAnswer_Event=function(){
	
};

//socket连接断开的情况
TopWrapper.prototype.onSocketDiscon_Event=function(){ 
	this.btnIsEnable(this.buttonList.FREEBTN.code, false);
	this.btnIsEnable(this.buttonList.BUSYBTN.code, false);
	this.btnIsEnable(this.buttonList.ANSWERBTN.code, false);
	this.btnIsEnable(this.buttonList.DISCONBTN.code, false);
};


//挂断
TopWrapper.prototype.onDiscon_Event=function(){ 
	this.btnIsEnable(this.buttonList.FREEBTN.code, false);
	this.btnIsEnable(this.buttonList.BUSYBTN.code, true);
	this.btnIsEnable(this.buttonList.ANSWERBTN.code, false);
	this.btnIsEnable(this.buttonList.DISCONBTN.code, false);
	this.updateSeatStatus(BaseData.seatStatusList.FREESTATUS.id);
};

//来电振铃按钮显示
TopWrapper.prototype.ringingStatus=function(){
	this.btnIsEnable(this.buttonList.FREEBTN.code, false);
	this.btnIsEnable(this.buttonList.BUSYBTN.code, false);
	this.btnIsEnable(this.buttonList.ANSWERBTN.code, true);
	this.btnIsEnable(this.buttonList.DISCONBTN.code, true);
	this.updateSeatStatus(BaseData.seatStatusList.RINGINGSTATUS.id);
}

//通话状态按钮显示
TopWrapper.prototype.answerStatus=function(){
	this.btnIsEnable(this.buttonList.FREEBTN.code, false);
	this.btnIsEnable(this.buttonList.BUSYBTN.code, false);
	this.btnIsEnable(this.buttonList.ANSWERBTN.code, false);
	this.btnIsEnable(this.buttonList.DISCONBTN.code, true);
	this.updateSeatStatus(BaseData.seatStatusList.ANSWERSTATUS.id);
};

//救援误报状态
TopWrapper.prototype.rescuePromptStatus=function(){
	this.btnIsEnable(this.buttonList.FREEBTN.code, false);
	this.btnIsEnable(this.buttonList.BUSYBTN.code, false);
	this.btnIsEnable(this.buttonList.ANSWERBTN.code, false);
	this.btnIsEnable(this.buttonList.DISCONBTN.code, true);
	this.updateSeatStatus(BaseData.seatStatusList.RESCUEPROMPT.id);
	
}


//回拨状态处理
TopWrapper.prototype.backConnection=function(code){
	var connObj=BaseData.getBackConnectionStatusObj(code);
	if(connObj){
		this.changeBackConnection(connObj.code);
		$("#"+this.topIdList.currentState).text(connObj.name).css('color',connObj.color);
		layer_msg_b("<span style='color:red;'>"+connObj.name+"</span>");
	}
	
}


//回拨连接等待中的状态
TopWrapper.prototype.changeBackConnection=function(code){
	if(code==BaseData.backConnectionStatus.CONNECTING.code){
		this.btnIsEnable(this.buttonList.FREEBTN.code, false);
		this.btnIsEnable(this.buttonList.BUSYBTN.code, false);
		this.btnIsEnable(this.buttonList.ANSWERBTN.code, false);
		this.btnIsEnable(this.buttonList.DISCONBTN.code, false);
	}else{
		//回拨失败，处理超时 或者 处理错误
		this.btnIsEnable(this.buttonList.FREEBTN.code, true);
		this.btnIsEnable(this.buttonList.BUSYBTN.code, false);
		this.btnIsEnable(this.buttonList.ANSWERBTN.code, false);
		this.btnIsEnable(this.buttonList.DISCONBTN.code, false);
	}

}




/**
 * 设置按钮可用或不可用 
 * @param code     code
 * @param isEnable   true 表示可用，false 表示不可用
 */
TopWrapper.prototype.btnIsEnable=function(code,isEnable){
	if(isEnable){
		$("#"+this.topBtn_Flag+code).removeAttr("disabled");
	}else{
		$("#"+this.topBtn_Flag+code).attr("disabled","disabled");
	}
	
}

//更新排队等待客户数量
TopWrapper.prototype.updateCustomerWatingSum=function(num){
	if(num==null || num<0){
		num=0;
	}
	$("#"+this.topIdList.customerWaitingSum).text(num);
};
/**
 * 更新状态
 * @param statusId
 */
TopWrapper.prototype.updateSeatStatus=function(statusId){
	var seatStatus=BaseData.getSeatStatusObj(statusId);
	if(seatStatus!=null){
		var statusName=seatStatus.name;
		if(statusId==BaseData.seatStatusList.FREESTATUS.id || statusId==BaseData.seatStatusList.BUSYSTATUS.id){
			//this.startCount(seatStatus.code);
		}else if(statusId==BaseData.seatStatusList.ANSWERSTATUS.id){
			//通话中 停止计时
//			if(this.timerID){
//				try{
//					this.stopCount();
//				}catch(e){
//					
//				}
//			}
		}else if(statusId==BaseData.seatStatusList.RECONNECTING.id){//重连
			this.reConnectCount+=1;
			if(this.reConnectCount>15){
				PageUtil.ivs.onCloseConnect();
				statusName="连接失败(刷新重试)";
			}else{
				statusName="正在第"+this.reConnectCount+"次重连......";
			}
		}else if(statusId==BaseData.seatStatusList.RECONNECTSUCCESS.id){//重连成功
			this.reConnectCount=0;
		}
		$("#"+this.topIdList.currentState).text(statusName).css('color',seatStatus.color);
	}
};
//更新PC连接状态
TopWrapper.prototype.updatePCConnectionStatus=function(code){
	if(code){
		var part=this;
		$.each(BaseData.pcStatusList,function(index,data){
			if(data.code==code){
				$("#"+part.topIdList.pcStatus).text(data.name).css('color',data.color);
				return false;
			}
		});
	}
};

//开始计时
TopWrapper.prototype.startCount = function(code){
	this.stopCount(); 
	this.showCountTime(code);
}

/**
 * 显示 示闲示忙 时长
 * @param code   free 示闲 busy 示忙
 */
TopWrapper.prototype.showCountTime = function(code){
	var times=0;
	if(code == BaseData.seatStatusList.FREESTATUS.code){
		this.freeTimes+=1;
		times=this.freeTimes;
	}else if(code== BaseData.seatStatusList.BUSYSTATUS.code){
		this.busyTimes+=1;
		times=this.busyTimes;
	}
	var showId = (code==BaseData.seatStatusList.FREESTATUS.code ? this.topIdList.freeDuration : this.topIdList.busyDuration);
	$("#"+showId).text(shapeTimeformat(times*1000));
	this.timerID = setTimeout("PageUtil.topWrapper.showCountTime('"+code+"')",1000);
	
}

 
//停止计时
TopWrapper.prototype.stopCount = function(){
	if(this.timerID){
		clearTimeout(this.timerID);
	}
}
