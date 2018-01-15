package com.ojbk.base;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.iboss.common.utils.Reflections;

/**
 * 数据Entity�? */
public abstract class TreeEntity<T> extends DataEntity<T> {

	private static final long serialVersionUID = 1L;

	protected T parent;	// 父级编号
	protected String parentIds; // �?��父级编号
	protected String name; 	// 机构名称
	protected Integer sort;		// 排序
	
	protected String parentName;
	
	public TreeEntity() {
		super();
		this.sort = 30;
	}
	
	public TreeEntity(Integer id) {
		super(id);
	}
	
	/**
	 * 父对象，只能通过子类实现，父类实现mybatis无法读取
	 * @return
	 */
	@JsonBackReference
	@NotNull
	public abstract T getParent(); 

	/**
	 * 父对象，只能通过子类实现，父类实现mybatis无法读取
	 * @return
	 */
	public abstract void setParent(T parent);

	public String getParentIds() {
		return parentIds;
	}

	public void setParentIds(String parentIds) {
		this.parentIds = parentIds;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getSort() {
		return sort;
	}

	public void setSort(Integer sort) {
		this.sort = sort;
	}
	
	public String getParentName() {
		return parentName;
	}

	public void setParentName(String parentName) {
		this.parentName = parentName;
	}
	
	public Integer getParentId() {
		Integer id = null;
		if (parent != null){
			id = (Integer)Reflections.getFieldValue(parent, "id");
		}
		return id!=null ? id : 0;
	}
	
}
