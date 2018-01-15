package com.ojbk.base;

import java.io.Serializable;
import java.util.Map;

import javax.xml.bind.annotation.XmlTransient;

import org.apache.commons.lang3.builder.ReflectionToStringBuilder;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.common.collect.Maps;

/**
 * Entity支持�? */
public abstract class BaseEntity<T> implements Serializable {

	private static final long serialVersionUID = 1849599124821802320L;

	/**
	 * 实体编号（唯�?��识）
	 */
	protected Integer id;
	
	protected String ids;
	
	/**
	 * 自定义SQL（SQL标识，SQL内容�?	 */
	protected Map<String, String> sqlMap;
	
	/**
	 * 是否是新记录（默认：false），调用setIsNewRecord()设置新记录，使用自定义ID�?	 * 设置为true后强制执行插入语句，ID不会自动生成，需从手动传入�?
	 */
	protected boolean isNewRecord = false;

	public BaseEntity() {
		
	}
	
	public BaseEntity(Integer id) {
		this();
		this.id = id;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}
	
	public String getIds() {
		return ids;
	}

	public void setIds(String ids) {
		this.ids = ids;
	}
	
	@JsonIgnore
	@XmlTransient
	public Map<String, String> getSqlMap() {
		if (sqlMap == null){
			sqlMap = Maps.newHashMap();
		}
		return sqlMap;
	}

	public void setSqlMap(Map<String, String> sqlMap) {
		this.sqlMap = sqlMap;
	}
	
	/**
	 * 插入之前执行方法，子类实�?	 */
	public abstract void preInsert();
	
	/**
	 * 更新之前执行方法，子类实�?	 */
	public abstract void preUpdate();
	
    /**
	 * 是否是新记录（默认：false），调用setIsNewRecord()设置新记�?     * @return
     */
	public boolean getIsNewRecord() {
        return isNewRecord || id==null;
    }

	/**
	 * 是否是新记录（默认：false），调用setIsNewRecord()设置新记录，使用自定义ID�?	 * 设置为true后强制执行插入语句，ID不会自动生成，需从手动传入�?
	 */
	public void setIsNewRecord(boolean isNewRecord) {
		this.isNewRecord = isNewRecord;
	}

    @Override
    public boolean equals(Object obj) {
        if (null == obj) {
            return false;
        }
        if (this == obj) {
            return true;
        }
        if (!getClass().equals(obj.getClass())) {
            return false;
        }
        BaseEntity that = (BaseEntity) obj;
        return null == this.getId() ? false : this.getId().equals(that.getId());
    }
    
    @Override
    public String toString() {
        return ReflectionToStringBuilder.toString(this);
    }
    
	/**
	 * 删除标记�?：正常；1：删除；2：审核；�?	 */
	public static final String DEL_FLAG_NORMAL = "0";
	public static final String DEL_FLAG_DELETE = "1";
	public static final String DEL_FLAG_AUDIT = "2";
	
}
