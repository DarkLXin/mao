package com.ojbk.base;

import java.util.List;

/**
 * DAOæ¯æç±»å®ç? */
public interface TreeDao<T extends TreeEntity<T>> extends CrudDao<T> {

	/**
	 * æ¾å°æ?å­èç?	 * @param entity
	 * @return
	 */
	public List<T> findByParentIdsLike(T entity);

	/**
	 * æ´æ°æ?ç¶èç¹å­æ®?	 * @param entity
	 * @return
	 */
	public int updateParentIds(T entity);
	
}