/**
 * 字典和枚举获取数据对象
 *  用法
 *  var store=Dict.getDictStore(Dict.dictTypeList.socket_url);
 *  var name=Dict.getDictName(Dict.dictTypeList.socket_url,"host");
 *  var emStore=Dict.getEnumStore(Dict.enumClazzList.SeatStatusEnum);
 *  var emName=Dict.getEnumName(Dict.enumClazzList.SeatStatusEnum,"busy");
 *  
 */
var  Dict={
	//数据字典类型配置对象
	dictTypeList:{
		socket_url:"socket_url", //socket连接配置key
		New_Customer_Type:"New_Customer_Type",   //新客户类型
		CUSTOMER_LEVEL:"CUSTOMER_LEVEL",   //客户级别
		DEPARTMENT_TYPE:"DEPARTMENT_TYPE",    //合作伙伴
		cust_user_status:"cust_user_status",    //用户管理产品状态
		MARKET_NAME:"MARKET_NAME",    //市场名称
		terminalType:"terminalType",  //终端类型
		parent_item:"parent_item",  //产品服务项类型
		com_carfactory:"com_carfactory",   //车辆厂商
		com_carmodel:"com_carmodel",  //车辆型号
		COLLISIONWORD:"COLLISIONWORD", //碰撞场景话术字典
		AccidentType:"AccidentType",//事故类型
		CarTroubleType:"CarTroubleType",//车辆故障类型
		ASRescueItem:"ASRescueItem", //安盛救援服务项目
		serviceAbility:"serviceAbility",  //服务能力
		terminal_status:"terminal_status",   //终端状态
		ServerIP:"ServerIP",//服务器IP
		payType:"payType",//支付类型
		payStatus:"payStatus",//支付状态
		simMeal:"simMeal",//SIM卡流量套餐名称
		simStatus:"simStatus",//SIM卡状态
		fileType:"fileType",//视频、图片文件类型
        terminalReplaceType:"terminalReplaceType",//换卡换机类型
        CallFrom:"CallFrom", //来电设备类型
        SMS_GATE_TYPE:"SMS_GATE_TYPE" //第三方短信运营商
	},
	//枚举类型数据配置对象
	enumClazzList:{
		SeatStatusEnum:"com.ecar.skxb.dict.enums.domain.SeatStatusEnum",  //坐席状态枚举
		SosTypeEnum:"com.ecar.skxb.dict.enums.domain.SosTypeEnum",//救援类型标记枚举
		NavigateModeEnum:"com.ecar.skxb.poi.enums.NavigateModeEnum",     //导航类型
		MapTypeEnum:"com.ecar.skxb.poi.enums.MapTypeEnum",          //地图类型
		RescueStatusEnum:"com.ecar.skxb.rescue.enums.RescueStatusEnum",    //救援状态标记枚举
		RescueTypeEnum:"com.ecar.skxb.rescue.enums.RescueTypeEnum",       //救援类型
		PayModelEnum:"com.ecar.skxb.rescue.enums.PayModeEnum", //付费方式
		RescueCompanyEnum:"com.ecar.skxb.rescue.enums.RescueCompanyEnum", //救援公司
		AccidentLeveEnum:"com.ecar.skxb.dict.enums.domain.AccidentLeveEnum",//事故等级
		TriggerTypeEnum:"com.ecar.skxb.rescue.enums.TriggerTypeEnum",   //触发类型
		ServiceTypeEnum:"com.ecar.skxb.rescue.enums.ServiceTypeEnum",    //远盟救援 第三方服务内容
		SysServeBillStateEnum:"com.ecar.skxb.dict.enums.domain.SysServeBillStateEnum",//系统服务单据状态
		SysServeTypeEnum:"com.ecar.skxb.dict.enums.domain.SysServeTypeEnum",//系统服务类型
		ASThirdStatusEnum:"com.ecar.skxb.rescue.enums.ASThirdStatusEnum", //安盛救援第三方回调状态
		SessionFromEnum:"com.ecar.skxb.dict.enums.domain.SessionFromEnum", //会话来源
		JoinTypeEnum:"com.ecar.skxb.dict.enums.domain.JoinTypeEnum", //通话连接方式
		DemoSceneEnum:"com.ecar.skxb.information.enums.DemoSceneEnum",//演示场景
		ActualSceneEnum:"com.ecar.skxb.information.enums.ActualSceneEnum",//真实场景
		SceneSubTypeEnum:"com.ecar.skxb.information.enums.SceneSubTypeEnum",//碰撞场景等级描述
		PoiTypeEnum:"com.ecar.skxb.poi.enums.PoiTypeEnum",//信息点类型
		TradeTypeEnum:"com.ecar.wechat.pay.enums.TradeTypeEnum"//支付类型
			
	},
		
	defaultPropName:'name',
	
	storeMap:{},
	
	addDict:function(type,datas){
		this.storeMap[type]=datas
	},
	/**
	 * 获取数据字典对象
	 * @param {Object} type 字典类型
	 */
	getDictStore:function(type){
		if(type){
			var store=this.storeMap[type];
			if(!store){
				store=this.getAjaxStore(type);
				
			}
			return store;
		}
		return null;
		
	},
	/**
	 * 获取枚举数据对象
	 * @param {Object} clazzName   对应的枚举类
	 */
	getEnumStore:function(clazzName){
		if(clazzName){
			//把clazzName 当类型来处理
			var store=this.storeMap[clazzName];
			if(!store){
				store=this.getAjaxStore(clazzName,true);
				
			}
			return store;
			
		}
		return null;
		
	},
	
	
	/**
	 * 后台方法请求获取数据字典数据
	 * @param {Object} type
	 */
	getAjaxStore:function(type,isEnum){
		var store;
		if(type){
			var url=request_url+"/dict/findDicts.do?type="+type;
			if(isEnum){
				url=request_url+"/dict/findEnums.do?clazzname="+type;
			}
			$.ajax({
		  		async: false,
		      	type:'GET',
		      	url:url,
		  		cache:false,
		  		timeout:3000,
		  		dataType: 'json',
		  		success: function(result){
		  			store=result;
		  		}
			});
		}
		if(store){
			this.addDict(type,store);
		}
		
		return store;
		
	},
	/**
	 * 解析字典并根据code返回name值  页面调用此方法
	 * @param {Object} type 字典类型
	 * @param {Object} code code值
	 */
	getDictName:function(type,code){
		return this.decodeDict(type,code,this.defaultPropName);
	},
	/**
	 * 解析枚举类型数据 根据code返回name 页面调用
	 * @param {Object} clazzName 枚举类clazzName
	 * @param {Object} code      code值
	 */
	getEnumName:function(clazzName,code){
		return this.decodeDictValue(clazzName,code,this.defaultPropName,true,false);
	},
	/**
	 *  解析枚举类型数据 根据code返回 带颜色的html代码 页面调用
	 * @param clazzName
	 * @param code
	 * @returns
	 */
	getEnumNameColor:function(clazzName,code){
		return this.decodeDictValue(clazzName,code,this.defaultPropName,true,true);
	},
	
	/**
	 * 解析数据字典
	 * @param {Object} type   字典类型
	 * @param {Object} code   code值
	 * @param {Object} propName  要返回的属性名数据
	 */
	decodeDict:function(type,code,propName){
		return this.decodeDictValue(type,code,propName,false,false);
	},
	/**
	 * 解析数据字典
	 * @param {Object} type 字典类型 或 枚举clazzName
	 * @param {Object} code  code值
	 * @param {Object} propName  要返回的属性名数据
	 * @param {Object} isEnum  是否为枚举类
	 * @param {Object} isColor 是否带颜色html代码，默认false
	 */
	decodeDictValue:function(type,code,propName,isEnum,isColor){
		var store;
		if(isEnum){
			store=this.getEnumStore(type);
			//枚举只返回name
			propName=this.defaultPropName;
		}else{
			store=this.getDictStore(type);
		}
		var decodeVal=null;
		if(store){
			$.each(store, function(item,data) {
				if(data.code == code){
					decodeVal = data[propName];
					if(isColor){
						//返回带颜色的html代码
						if(data.color && data.color!=null && data.color!=""){
							decodeVal="<span style='color:"+data.color+"'>"+decodeVal+"</span>";
						}
					}
					return false;
				}
			});
		}
		return decodeVal;
		
	}
}