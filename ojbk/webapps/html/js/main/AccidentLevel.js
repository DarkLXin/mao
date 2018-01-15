/**
 * 事故 级别处理类 
 */

var AccidentLevel=function(config){
	config=config||{};
	this.levelTabDiv="levelTab_div";
	
	
	this.tmplList={
			Guide_Tmpl:{name:"急救指导模板",tmpId:"item_tmpl_one",data:{title:"急救指导",btnName:"联系医生",content:"请确认车主是否需要急救指导",fn:"guideWin()"}},
			Accident_Tmpl:{name:"事故指导模板",tmpId:"item_tmpl_one",data:{title:"事故指导",btnName:"派单",content:"指导车主解决事故纠纷，保护车主利益",fn:"guideWin()"}},
			Life_Tmpl:{name:"生命救援模板",tmpId:"item_tmpl_one",data:{title:"生命救援",btnName:"派单",content:"车主受伤严重，请联系120和交警",fn:"rescueWin('LIFE')"}},
			Road_Tmpl:{name:"道路救援模板",tmpId:"item_tmpl_one",data:{title:"道路救援",btnName:"派单",content:"车辆侧翻，建议为车主提供拖车服务",fn:"rescueWin('WAY')"}},
			Police_Tmpl:{name:"联系交警模板",tmpId:"item_tmpl_one",data:{title:"联系交警",btnName:"联系交警",content:"交警电话：110",fn:"policeWin()"}},
			Insurer_Tmpl:{name:"联系保险模板",tmpId:"item_tmpl_one",data:{title:"联系保险",btnName:"联系保险",content:"保险电话：95511",fn:"insureWin()"}},
			
			Family_Tmpl:{name:"联系家人模板",tmpId:"item_tmpl_two",data:{title:"联系家人",btnName:"联系家人",phone:"",linkName:"",fn:"familyWin(this)"}}
			
	}
	
	
	
	this.levelItemList=[
	                    {code:'1',tabId:"tab-1",name:"一级事故",tmpls:[
                                                   this.tmplList.Life_Tmpl,
	                                               this.tmplList.Family_Tmpl,
	                                               this.tmplList.Insurer_Tmpl,
	                                               this.tmplList.Road_Tmpl
	                                                               	]},
	                    {code:'2',tabId:"tab-2",name:"二级事故",tmpls:[
	                                               this.tmplList.Guide_Tmpl,                
                                                   this.tmplList.Life_Tmpl,
	                                               this.tmplList.Family_Tmpl,
	                                               this.tmplList.Insurer_Tmpl,
	                                               this.tmplList.Road_Tmpl      
	                                                               
	                                                               ]},
	                    {code:'3',tabId:"tab-3",name:"三级事故",tmpls:[
													this.tmplList.Guide_Tmpl,                
													this.tmplList.Life_Tmpl,
													this.tmplList.Family_Tmpl,
													this.tmplList.Insurer_Tmpl,
													this.tmplList.Road_Tmpl                  
	                                                               
	                                                               ]},
	                    {code:'4',tabId:"tab-4",name:"四级事故",tmpls:[
													this.tmplList.Guide_Tmpl,                
													this.tmplList.Police_Tmpl,
													this.tmplList.Family_Tmpl,
													this.tmplList.Insurer_Tmpl,
													this.tmplList.Road_Tmpl                 

	                                                               ]},
	                    {code:'5',tabId:"tab-5",name:"五级事故",tmpls:[            
													this.tmplList.Police_Tmpl,
													this.tmplList.Accident_Tmpl,
													this.tmplList.Insurer_Tmpl,
													this.tmplList.Road_Tmpl                     
	                                                               
	                                                               ]}
	                                                               
	                    ];
	
	
	
	this.show=function(callData){
		callData=callData||{}
		//获得事故等级标记
		var levelCode = callData.accidentLeve || null;
		
		var li=$("#"+this.levelTabDiv).find("li[class=active]");
		if(li && li.length>0){
			li.removeClass("active");
		}
		
		
		$.each(this.levelItemList,function(index,levelItem){
			$("#"+levelItem.tabId).removeClass("active");
			$("#"+levelItem.tabId+" .panel-body").empty();
			$.each(levelItem.tmpls,function(i,tmpl){
				$("#"+tmpl.tmpId).tmpl(tmpl.data).appendTo("#"+levelItem.tabId+" .panel-body");
			});
		});
		$("#"+this.levelTabDiv).show();
		if(levelCode!=null && levelCode>0){
			this.activeTab(levelCode);
		}else{
			this.hideTab();
		}
		
		
	}
	
	
	this.activeTab=function(code){
		$("#li_tab_"+code).addClass("active");
		$("#li_tab_"+code).tab('show');
		$("#tab-"+code).addClass("active");
		if($("#levelItmes_div").css("display")=="none"){
			$("#levelItmes_div").css("display","block");
		}
		this.initUpDownFlag("up");
	}
	this.hideTab=function(){
		var li=$("#"+this.levelTabDiv).find("li[class=active]");
		if($("#levelItmes_div").css("display")=="block"){
			$("#levelItmes_div").css("display","none");
		}
		if(li && li.length>0){
			li.removeClass("active");
		}
		this.initUpDownFlag("down");
	}
	
	this.initUpDownFlag=function(flag){
		var i=$("#upDownFlag_div").find("i");
		if(flag=="up"){
			i.removeClass("fa-chevron-down");
			i.addClass("fa-chevron-up");
		}else if(flag=="down"){
			i.removeClass("fa-chevron-up");
			i.addClass("fa-chevron-down");
		}
	}
	
	
	
	this.render=function(){
		
	}
}