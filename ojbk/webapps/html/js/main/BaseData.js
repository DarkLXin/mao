/**
 * 基础公共数据定义
 */
var BaseData={
		
		//救援预判 sosType值
		heraldFlag:4,
		//通话状态
		callingStatusList:{
				formationTips:{code:1,text:'救援预警提醒',color:'#FF0000'},
				ringCall:{code:2,text:'来电振铃中',color:'#FF0000'},
				answerCall:{code:3,text:'正在通话',color:'#008000'},
				endCall:{code:4,text:'电话已挂断',color:'#FF0000'},
				waitConnect:{code:5,text:'等待客户连接',color:'#FF0000'},
				cancelRescue:{code:6,text:'客户取消救援',color:'#FF0000'}
		},
		//坐席当前连接状态
		seatStatusList:{
				FREESTATUS:{id:1,code:'free',name:'示闲',color:'#008000'},//绿色
				BUSYSTATUS:{id:2,code:'busy',name:'示忙',color:'#FF0000'},//红色
				RINGINGSTATUS:{id:3,code:'ringing',name:'振铃中',color:'#FF0000'},//红色
				ANSWERSTATUS:{id:4,code:'answer',name:'通话中',color:'#0000CC'},//蓝色
				DISCONSTATUS:{id:5,code:'discon',name:'连接断开',color:'#FF0000'},//红色
				RESCUEPROMPT:{id:6,code:'rescuePrompt',name:'救援预判处理',color:'#FF0000'},//红色
				RESCUECONNECT:{id:7,code:'rescueConnect',name:'救援连接中......',color:'#008000'},//绿色
				VERIFYFAIL:{id:8,code:'verifyFail',name:'坐席验证失败',color:'#FF0000'},
				RECONNECTING:{id:9,code:'reconnecting',name:'正在重连......',color:'#FF0000'},
				RECONNECTSUCCESS:{id:10,code:'reconnectSuccess',name:'重连成功',color:'#008000'},
				TICOUTUSRE:{id:11,code:'loginOut',name:'其他位置登陆',color:'#FF0000'},
				BACKCONNECTING:{id:12,code:'backConnection',name:'回拨连接中',color:'#FF0000'}
		},
		backConnectionStatus:{
			CONNECTING:{code:'connecting',name:'回拨连接中',color:'#FF0000'},
			CANCEL:{code:'cancel',name:'回拨连接取消',color:'#FF0000'},
			TIMEOUT:{code:'timeout',name:'回拨连接超时',color:'#FF0000'},
			ERROR:{code:'error',name:'回拨连接处理异常',color:'#FF0000'}
		},
		
		
		//坐席手机端连接状态
		pcStatusList:{
				CONNECT_STATUS:{code:'connect',name:'连接正常',color:'#008000'},
				DISCON_STATUS:{code:'discon',name:'连接断开',color:'#FF0000'}
		},
		//触发方式
		sosReqTypeList:[
			{"code":0,"name":"主动触发","color":"#009688"},
			{"code":1,"name":"被动检测","color":"#FF0000"}
		],
		//地图类型
		mapType:{
			BDMAP:{code:5,name:"百度"},
			GDMAP:{code:8,name:"高德"}
		},
		//信息点类型
		poiType:{
			COMPANY:{code:0,name:"公司"},
			HOME:{code:1,name:"家"}
		},
		
		getBackConnectionStatusObj:function(code){
			var obj=null;
			if(code && code!=null){
				$.each(this.backConnectionStatus,function(index,data){
					if(data.code==code){
						obj=data;
						return false;
					}
				});
			}
			return obj;
		},
		
		//获得通话状态
		getCallingStatusObj:function(code){
			var callingStatus=null;
			if(code && code!=null){
				$.each(this.callingStatusList,function(index,data){
					if(data.code==code){
						callingStatus=data;
						return false;
					}
				});
			}
			return callingStatus;
		},
		//获取坐席状态对象
		getSeatStatusObj:function(id){
			var seatStatus=null;
			if(id && id!=null){
				$.each(this.seatStatusList,function(index,data){
					if(data.id==id){
						seatStatus=data;
						return false;
					}
				});
			}
			return seatStatus;
		},
		
		//是否属于救援服务
		isExistRescueServer:function(sosType){
			
			var serverTypeArr=["LIFE_RESCUE"];
			return this.checkServerType(sosType,serverTypeArr);
		},
		//是否为导航服务
		isExistNaviServer:function(sosType){
			var serverTypeArr=["ONEKEY_NAVI"];
			return this.checkServerType(sosType, serverTypeArr);
		},
		
		/**
		 * 判断sostype是否属于某个服务
		 * sosType  code值
		 * serverTypeArr 服务数组["ONEKEY_NAVI","LIFE_RESCUE"]
		 */
		checkServerType:function(sosType,serverTypeArr){
			var boo=false;
			if(sosType && serverTypeArr && (serverTypeArr instanceof Array)){
				var sosTypeStore=Dict.getEnumStore(Dict.enumClazzList.SosTypeEnum);
				if(sosTypeStore){
					$.each(sosTypeStore,function(index,data){
						if(data.code==sosType && data.sysServeType!=null && jQuery.inArray(data.sysServeType,serverTypeArr)>=0){
							boo=true;
							return false;
						}
					});				
				}
			}
			return boo;
		},
		getSosReqType:function(code){
			var store=null;
			$.each(this.sosReqTypeList,function(index,data){
				if(data.code==code){
					store=data;
					return false;
				}
			});
			return store;
		}
		
		
		
		
}