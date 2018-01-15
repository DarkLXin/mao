package com.ojbk.base;

import java.util.HashMap;

public class MapData extends HashMap<String, Object> {

	private static final long serialVersionUID = 1L;
	
	public MapData(){
		put("success", true);
	}
	
	public MapData(Boolean boo,String message){
		put("success", message);
		put("message",message);
	}
	
	public MapData success(){
		return new MapData();
	}
	
	public MapData fail(){
		return fail(null);
	}
	
	public MapData fail(String message){
		MapData data=new MapData();
		data.put("success", false);
		data.put("message", message);
		return data;
	}
	
	
	public MapData put(String key,Object value){
		super.put(key, value);
		return this;
	}
	
}
