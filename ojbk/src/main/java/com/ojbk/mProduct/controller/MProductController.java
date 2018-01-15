package com.ojbk.mProduct.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.iboss.common.bean.Message;
import com.ojbk.base.BaseController;
import com.ojbk.base.Response;
import com.ojbk.mProduct.bean.MProduct;
import com.ojbk.mProduct.service.MProductService;
@Controller
@RequestMapping(value="/mao/product")
public class MProductController extends BaseController{
	private static final Logger logger = LoggerFactory.getLogger(MProductController.class);
	@Autowired
	private MProductService service;
	
	@RequestMapping(value = {"save.do"},method ={ RequestMethod.GET , RequestMethod.POST})
	public @ResponseBody JSONObject save(MProduct bean){
		JSONObject json=new JSONObject();
		if(bean!=null){
			
			try{
				service.save(bean);
				json.put("success", true);
				json.put("message", "����ɹ�!");
			}catch (Exception e) {
				logger.info("����mao��Ʒ����"+e.getMessage(),e);
				json.put("success", false);
				json.put("message", e.getMessage());
			}
		}else{
			json.put("success", false);
			json.put("message", "����Ϊ��,����ʧ��!");
		}
		return json;
	}	
	
	
	@RequestMapping(value = {"list.do"},method ={ RequestMethod.GET , RequestMethod.POST})
	public @ResponseBody Response list(@RequestParam(required = false, defaultValue="1") int page,
			@RequestParam(required = false, defaultValue="10") int rows,
			@RequestParam(required = false) String order,MProduct bean){
		
		Response response = null;
		this.startPage(page, rows, order);
		try {
			List<MProduct> list=service.findList(bean);
			response = succeedResponse(list);
		}catch(Exception ex) {
			logger.error("��ѯmao��Ʒ����: "+ex.getMessage(),ex);
			response = new Response();
			response.setCode(Message.IS_FAILED);
			response.setMessage("��ѯmao��Ʒ����");
		}		
        return response;
	}
	
	
	
	
	/**
	 * ��ѯ����ʦ
	 * @param id
	 * @return
	 */
	@RequestMapping(value = {"get.do"},method ={ RequestMethod.GET , RequestMethod.POST})
	public @ResponseBody Map<String,Object> get(Integer id){
		logger.info("��ѯmao��Ʒ��ʼ������id------>"+id);
		Map<String, Object> map =new HashMap<String, Object>();
		if(id!=null && id>0){
			try{
				MProduct product = service.get(id);
				map.put("success", true);
				map.put("data",product);
			}catch (Exception e) {
				map.put("success", false);
				map.put("message","��ѯ����!");
			}
			
		}else{
			map.put("success", false);
			map.put("message","����ID����Ϊ��!");
		}
		
			
		return map;
	}
	
	/**
	 * ɾ��
	 * @param ids
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = {"delete.do"},method ={ RequestMethod.GET , RequestMethod.POST})
	public Map<String, Object> delete(@RequestParam(required = true)Integer id){
		Map<String, Object> map =new HashMap<String, Object>();
		try {
			service.deleteById(id);
			map.put("success", true);
		} catch (Exception e) {
			logger.error("ɾ��product�쳣��"+e.getMessage(), e);
			map.put("success", false);
			map.put("message","ɾ��product�쳣��");
		}
		return map;
	}
}
