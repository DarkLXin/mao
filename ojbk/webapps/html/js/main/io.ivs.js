io.ivs = function(config){
	this.config=config || {};
	this.socket;
	
	this.isConnect = function(){
		if(this.socket != undefined)
			return this.socket.connected;
	} 
	this.getSocket = function(){
		return this.socket;
	}
	this.init = function(event){
		var part=this;
		if(!config.loginName || config.loginName==null || config.loginName==""){
			return;
		}
		
		if(!this.isConnect()){
			this.connect();
		}
		var token=this.token =this.token || Dict.getDictName(Dict.dictTypeList.socket_url,"token");
		
		
		var loginName=this.config.loginName || null;
		var sessionId=this.config.sessionId || null;
		var part = this;
		//1.客户端连接服务端后进行用户验证
		this.socket.on('connect', function(){
			console.log("客户端成功连接到socket服务...");
			console.log("开始验证客户端信息：namespace="+loginName+",access_token="+token+",sessionId="+sessionId);
			if(loginName!=null && token!=null && sessionId!=null){
				part.socket.emit("verifyNameSpace",{namespace:loginName,access_token:token,sessionId:sessionId});
			}else{
				event.onVerifyNameSpace({success:false});
			}
			
		});
		
		//2.客户端监听服务后台验证结果
		this.socket.on('verifyNameSpace',function(data,fn){
			console.log("返回服务器验证结果数据...");
			console.log(data);
			event.onVerifyNameSpace(data);
			part.onReturnFlag(fn);
			
		});
		//坐席状态变更
		this.socket.on("pushState",function(data,fn){
			console.log("状态返回监听");
			console.log(data);
			event.onPushState(data);
			part.onReturnFlag(fn);
			
		});
		//排队等待用户数量
		this.socket.on("waite",function(data,fn){
			console.log("排队用户");
			console.log(data);
			event.onWaiting(data);
			part.onReturnFlag(fn);
		});
		//电话振铃
		this.socket.on("ringing",function(data,fn){
			console.log("电话振铃开始");
			console.log(data);
			event.onPhoneRinging(data);
			part.onReturnFlag(fn);
			
		});
		
		//电话接通
		this.socket.on("answer",function(data,fn){
			console.log("坐席电话接通");
			console.log(data);
			event.onPhoneAnswer(data);
			part.onReturnFlag(fn);
		});
		
		this.socket.on("reAnswer",function(data,fn){
			console.log("坐席重新接入电话");
			console.log(data);
			event.onPhoneReAnswer(data);
			part.onReturnFlag(fn);
		});
		
		//电话挂断
		this.socket.on("discon",function(data,fn){
			console.log("电话挂断");
			console.log(data);
			event.onPhoneDiscon(data);
			part.onReturnFlag(fn);
			
		});
		
		//救援误报提醒功能
		this.socket.on("rescuePrompt",function(data,fn){
			console.log("救援误报提醒");
			console.log(data);
			if(data){
				event.onRescuePrompt(data);
				part.onReturnFlag(fn);
			}
			
			
		});
		
		this.socket.on("rescueCancel",function(data,fn){
			console.log("取消救援请求");
			console.log(data);
			if(data){
				event.onRescueCancel(data);
				part.onReturnFlag(fn);
			}
			
		});
		
		this.socket.on("backConnection",function(data,fn){
			console.log("回拨连接状态数据....");
			console.log(data);
			if(data){
				event.onBackConnection(data);
				part.onReturnFlag(fn);
			}
		});
		
		
		//连接断开
		this.socket.on('disconnect', function(){
			console.log("检测到socket连接断开....");
			event.onDisconnect();
		});
		this.socket.on('reconnecting',function(){
			console.log("正在重新连接...");
			event.onReconnection();
			
		});
		this.socket.on('connecting',function(){
			console.log("正在连接...");
		});
		this.socket.on('reconnect',function(){
			console.log("成功重连");
			event.onReconnectSuccess();
		});
		this.socket.on('reconnect_failed',function(){
			console.log('重连失败')
		});
		
		//PC端连接状态
		this.socket.on("pushPCState",function(code,fn){
			console.log("PC状态监听");
			console.log(code);
			event.onPushPCState(code);
			part.onReturnFlag(fn);
		});
	}
	this.onReturnFlag=function(fn){
		if (fn && typeof fn === "function"){
			fn({"flag":true});
		}
	}
	this.connect = function(){
		if(this.socket == undefined || !this.isConnect()){
			
			
			//var host = Dict.getDictName(Dict.dictTypeList.socket_url,"host");
			//var port = Dict.getDictName(Dict.dictTypeList.socket_url,"port");
			
			//10.10.21.100外网地址 119.145.167.180  
			//119.29.165.121腾讯云 地址
	/*		var host="192.168.171.42";
			var port=29092;
			var url = 'http://'+host+':'+port+"/webSpace";
			console.log(url);
			this.socket =  io.connect(url);*/
			
		
			var part=this;
			this.findTcpConfig(function(result){
				if(result.success){
					var data=result.data;
					var url = 'http://'+data.ip+':'+data.port+"/webSpace";
					console.log(url);
					part.socket=io.connect(url);
				}else{
					layer_alert(result.message);
				}
			});
			
		}
	}
	
	//示闲,示忙，事件
	this.onChangeStatus = function(translate){
		var loginName=this.config.loginName;
		if(this.isConnect()){
			console.log("客户端点击按钮事件：loginName="+loginName+",translate="+translate);
			this.socket.emit("pushState",{seatId:loginName,translate:translate});
		}
	}
	//坐席应答
	this.onAnswer=function(mobile,IOSessionId,idCode){
		var loginName=this.config.loginName;
		if(this.isConnect()){
			console.log("客户端点击[应答]按钮：loginName:"+loginName+",mobile:"+mobile+",IOSessionId:"+IOSessionId+",idCode:"+idCode);
			this.socket.emit("trigger",{event:"ReplyEvent",iphone:mobile,IOSessionId:IOSessionId,idCode:idCode});
		}
	}
	//坐席挂断
	this.onDiscon=function(mobile,IOSessionId,idCode){
		var loginName=this.config.loginName;
		if(this.isConnect()){
			console.log("客户端点击[挂断]按钮：loginName:"+loginName+",mobile:"+mobile+",IOSessionId:"+IOSessionId+",idCode:"+idCode);
			this.socket.emit("discon",{seatId:loginName,mobile:mobile,IOSessionId:IOSessionId,idCode:idCode});
		}
	}
	//确认救援接入
	this.onConfirmRescue=function(mobile,IOSessionId,idCode,fn){
		console.log("坐席点击[确认救援]按钮：mobile:"+mobile+",IOSessionId:"+IOSessionId+",idCode:"+idCode);
		if(this.isConnect()){
			this.socket.emit("trigger",{event:"RescueOk",iphone:mobile,IOSessionId:IOSessionId,idCode:idCode},function(data){
				if (fn && typeof fn === "function"){
					fn(data);
				}
			});
		}
	}
	//取消救援接入
	this.onCancelRescue=function(mobile,IOSessionId,idCode,fn){
		console.log("坐席点击[取消救援]按钮：mobile:"+mobile+",IOSessionId:"+IOSessionId+",idCode:"+idCode);
		if(this.isConnect()){
			this.socket.emit("trigger",{event:"RescueDistort",iphone:mobile,IOSessionId:IOSessionId,idCode:idCode},function(data){
				if (fn && typeof fn === "function"){
					fn(data);
				}
			});
		}
	}
	
	this.onBackConnecting=function(params,fn){
		console.log("发起回拨连接命令.....");
		console.log(params);
		if(this.isConnect()){
			var loginName=this.config.loginName;
			params["seatName"]=loginName;
			var timeout=true;
			
			var tipIndex = layer.msg("正在执行回拨操作,请稍等...",{icon: 16,shade: 0.2,time:10000},function(){
				if(timeout){
					layer_msg_b("处理超时......");
				}
				
			});
			
			this.socket.emit("command",params,function(data){
				timeout=false;
				layer.close(tipIndex);
				if (fn && typeof fn === "function"){
					fn(data);
				}
			});
		}
	}
	
	//终端显示提醒数据
	this.onSendPromptInfo=function(mobile,IOSessionId,idCode,data){
		console.log("坐席发送救援进度数据：mobile:"+mobile+",IOSessionId:"+IOSessionId+",idCode:"+idCode);
		console.log(data);
		if(this.isConnect()){
			this.socket.emit("trigger",{event:"RescueState",iphone:mobile,IOSessionId:IOSessionId,idCode:idCode,data:data});
			layer_msg_c("救援进度数据已发送!");
		}else{
			layer_msg_c("连接异常,发送救援进度数据失败!");
		}
	}
	//关闭连接
	this.onCloseConnect=function(){
		console.log("关闭连接................");
		this.socket.close();
		
	}
	
	this.parseJSON = function(data){
		if(data != undefined && typeof(data) == "string") 
			return jQuery.parseJSON(data);
		return data; 
	}
	this.findTcpConfig =function(fn){
		console.log("获取连接的IP和端口数据....");
		$.ajax({
	  		async: false,
	      	type:'POST',
	      	url:request_url+"/dict/findTcpConfig.do?ds="+new Date().getTime(),
	  		cache:false,
	  		timeout:10000,
	  		dataType: 'json',
	  		success: function(result){
	  			if (fn && typeof fn === "function"){
					fn(result);
				}
	  		},
	  		error:function(){
	  			layer_alert("获取SOCKET连接IP错误，请按F5刷新页面重试!");
	  		}
		});
	}
	
}







