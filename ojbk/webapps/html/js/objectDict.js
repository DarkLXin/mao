/**
 * 处理对象store数据
 */
var ObjectDict={
		storeMap:{},
		storeTypeList:{
			fatigue_accompany_store:{name:"FATIGUE_ACCOMPANY_STORE",url:request_url+"/dict/findSysServeBillState.do"},
			accident_guide_store:{name:"ACCIDENT_GUIDE_STORE",url:request_url+"/dict/findSysServeBillState.do"},
			peccancy_serve_store:{name:"PECCANCY_SERVE_STORE",url:request_url+"/dict/findSysServeBillState.do"},
			//爱车故障
			car_trouble_advice_store:{name:"CAR_TROUBLE_ADVICE_STORE",url:request_url+"/dict/findSysServeBillState.do"}
			
		},
		
		getStoreType:function(name){
			var storeType=null;
			if(name!=null){
				$.each(this.storeTypeList,function(index,data){
					if(data.name==name){
						storeType=data;
						return false;
					}
				});
			}
			return storeType;
		},
		
		//主方法：获取store对象
		getObjStore:function(storeTypeName,params){
			if(storeTypeName!=null){
				params=params || {};
				var storeType=this.getStoreType(storeTypeName);
				if(storeType!=null){
					return this.getStore(storeType.name,storeType.url,params);
				}
			}
			return null;
		},
		
		//主方法：根据Id获取store对应的属性值
		getTextByObjStore:function(storeTypeName,id,propName){
			var text="";
			var store=this.getObjStore(storeTypeName);
			if(store!=null){
				propName = propName || "name";
				$.each(store, function(item,data) {
					if(data.id == id){
						text = data[propName];
						return false;
					}
				});
			}
			return text;
		},
		
		getStore:function(storeTypeName,url,params){
			var store=null;
	
			if(params!=null && Object.keys(params).length>0){
				store=this.getAjaxStore(url,params);
			}else{
				store=this.storeMap[storeTypeName];
				if(!store){
					store=this.getAjaxStore(url,params);
					if(store!=null && store.length>0){
						this.storeMap[storeTypeName]=store;
					}
				}
			}
			return store;
		},
		
		getAjaxStore:function(url,params){
			params = params || {};
			var store=null;
			if(url!=null){
				$.ajax({
			  		async: false,
			      	type:'POST',
			      	url:url+"?ds="+new Date().getTime(),
			      	data:params,
			  		cache:false,
			  		timeout:3000,
			  		dataType: 'json',
			  		success: function(result){
			  			store=result;
			  		}
				});
			}
			return store;
		}
		
		
}