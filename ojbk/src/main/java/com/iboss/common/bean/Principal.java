package com.iboss.common.bean;

import java.io.Serializable;


public class Principal implements Serializable{
private static final long serialVersionUID = -6168903389798751905L;
	
	private Integer id; // ID
	private String loginName; // 登陆名称
	private String name; // 姓名
	private boolean isAdmin; //admin
	private String photo;//照片

	
	public Principal(Integer id, String loginName, String name, boolean isAdmin) {
		this.id = id;
		this.loginName = loginName;
		this.name = name;
		this.isAdmin = isAdmin;
	}
	public Principal(Integer id, String loginName, String name, boolean isAdmin,String photo) {
		this.id = id;
		this.loginName = loginName;
		this.name = name;
		this.isAdmin = isAdmin;
		this.photo=photo;
	}
	


	public Integer getId() {
		return id;
	}

	public String getLoginName() {
		return loginName;
	}

	public String getName() {
		return name;
	}

	public boolean isAdmin() {
		return isAdmin;
	}

	public void setAdmin(boolean isAdmin) {
		this.isAdmin = isAdmin;
	}
	
	public String getPhoto() {
		return photo;
	}
	
	
	@Override
	public String toString() {
		return id+"_"+loginName+"_"+name;
	}

}
