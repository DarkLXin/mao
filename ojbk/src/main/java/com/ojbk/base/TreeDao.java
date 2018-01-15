package com.ojbk.base;

import java.util.List;

/**
 * DAO支持类实�? */
public interface TreeDao<T extends TreeEntity<T>> extends CrudDao<T> {

	/**
	 * 找到�?��子节�?	 * @param entity
	 * @return
	 */
	public List<T> findByParentIdsLike(T entity);

	/**
	 * 更新�?��父节点字�?	 * @param entity
	 * @return
	 */
	public int updateParentIds(T entity);
	
}