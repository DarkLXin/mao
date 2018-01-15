//查询并加载Grid数据
$(function (){  
	
        $("#table_list").jqGrid({
            url: '../mao/product/list.do',//组件创建完成之后请求数据的url
            contentType : "application/json",
            datatype: "json",//从服务器端返回的数据类型，默认xml。可选类型：xml，local，json，jsonnp，script，xmlstring，jsonstring，clientside
            height: 400,
            caption:"mao的终极bacon",
            autowidth: true,
            multiselect: true,
            multiboxonly:true,
            shrinkToFit: false,
            autoScroll: false,
            rowNum: 10,//一页显示多少条
            rowList: [10, 20, 30,40,50],//可供用户选择一页显示多少条
            pager: "#pager_list",//表格页脚的占位符(一般是div)的id
            viewrecords: true,
            add: true,
            edit: true,
            addtext: "Add",
            emptyrecords: "暂无数据",//当返回的数据行数为0时显示的信息
            mtype: "post",//向后台请求数据的ajax的类型。可选post,get
            edittext: "Edit",
            hidegrid: true,
            colNames: ['编号','名称','价格','备注','创建时间','图片','详情'],
            colModel: [
               {name: "id",index: "id",editable: false,sortable: true,width: $(this).width()*(0.06)},
               {name: "name",index: "name",editable: false,sortable: true,width: $(this).width()*(0.12)}, 
               {name: "price",index: "price",editable: false,sortable: true,width: $(this).width()*(0.10)},
               
            	{name: "remark",index: "remark",editable: false,sortable: true,width: $(this).width()*(0.10)},
               {name: "createDate",index: "createDate",editable: false,sortable: true,width: $(this).width()*(0.15)},
               {name: "pic",index: "pic", width: 30, align: "center",width: $(this).width()*(0.25), sortable: false, editable: false, formatter: alarmFormatter},
               {name: "id",index: "id",width: $(this).width()*(0.12),
               formatter:function(val,opt,row){
	                	return "<button type='button' class='btn btn-primary btn-sm' onclick='detail("+val+")'><i class='fa fa-copy'></i>详情</button>  "
	                	}
	                }
            ],
			loadComplete: function(xhr){ 
				parent.exceptionHandler(xhr);
			},
			loadError:window.parent.errorExcepHandler
			
        });
        bindResize("table_list","jqGrid_wrapper");
        initTableHeight($("#table_list"));//设置表格高度，兼容屏幕
    });
 
    //条件搜索
    function search() {
	    $("#table_list").jqGrid('setGridParam', {
		    url: "../mao/product/list.do",
		    mtype: 'POST',
		    postData:{
                'name':$.trim($('#name').val()),
                'price':$.trim($("#price").val())
            },
		    page: 1
		}).trigger("reloadGrid");
	}
	

    
	//重置搜索条件
    function form_reset(){
    	$("#name").val("");
    	$("#price").val("");
    	
    }

    function add(){
		parent.layer_iframe_show("添加产品", "edit.html", 800,560);
    }
    
    /**
     * 跳转到编辑页面
     */
    function edit(){
    	var rowId = $("#table_list").jqGrid('getGridParam','selrow');
    	if(null == rowId){
		    parent.layer_msg_b("请选择其中的一条记录！");
		    return;
    	}
    	var rowIds = $("#table_list").jqGrid('getGridParam','selarrrow');
    	if(rowIds.length > 1){   //只能选择其中的一条记录
    		  parent.layer_msg_b("只能选择其中的一条记录！");
  		      return;
    	}
		parent.layer_iframe_show("编辑产品", "edit.html?id="+rowId, 800,560);

    }

    function del(){
    	var rowId = $("#table_list").jqGrid('getGridParam','selrow');
    	if(rowId && rowId!=null){
    		var id = $("#table_list").jqGrid('getRowData',rowId).id;
    		parent.layer_confirm("确定删除所选的产品吗？",function(){
    			remove(id);
        	});
    	}else{
    		parent.layer_msg_b("请选择要删除的记录！");
		    return;
    	}
    }
    
    function remove(id){
	    var l_index = parent.layer.load();//启动加载动画
		$.ajax({
				async:false,
				type:'POST',
	            url: '../mao/product/delete.do',
				dataType: 'json',
				data:{"id":id},
				cache:false,
				success: function(result){
					parent.layer.close(l_index);//关闭加载动画
			        if(result.success){
			        	 parent.layer_msg_b("删除成功!");
						 search();//刷新刷新父窗口
			        }else{
			        	parent.layer_msg_b(result.message);
			        }
				},error: function (XMLHttpRequest, textStatus, errorThrown) {
					parent.layer.close(l_index);//关闭加载动画
           			parent.layer_msg_b("系统错误!");
            }
		});
}

function alarmFormatter(cellvalue, options, rowdata)
{
        return '<img class="alarmimg" src="'+cellvalue+ '" width="140" height="140" />';
}