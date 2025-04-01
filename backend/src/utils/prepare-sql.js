const { toLogico } = require("./parser");
const SnakeCamelSwitcher = require("./snake-camel-switcher");

class PrepareSql {

  /**
   * 
   * @param {Array<string>} filterStringOptions 
   * @param {Map} filterStringMap 
   * @param {Array<string>} filterIdOptions 
   * @param {Map} filterIdMap 
   * @param {Array<string>} filterBoolOptions 
   * @param {Map} filterBoolMap 
   * @param {Request} req 
   */
  initFilters(filterStringOptions, filterStringMap, filterIdOptions, filterIdMap, filterBoolOptions, filterBoolMap, req) {
    for (const [key, value] of Object.entries(req.query)) {
      if (filterStringOptions.includes(key)) {
        filterStringMap.set(key, value);
      }

      if (filterIdOptions.includes(key)) {
        filterIdMap.set(key, value);
      }

      if (filterBoolOptions.includes(key)) {
        filterBoolMap.set(key, value);
      }
    }
  }

  prepareCustomQuery(sql, filterTextMap, filterIdMap, filterBoolMap, sortColumn, limit, offset) {
    let customQuery = { stringSql: '', paramValues: [] };
    customQuery.stringSql = sql;

    customQuery = this.addFilterTextToSql(customQuery, filterTextMap);
    customQuery = this.addFilterIdToSql(customQuery, filterIdMap);
    customQuery = this.addFilterBoolToSql(customQuery, filterBoolMap);
    customQuery = this.addOrderParamToSql(customQuery, sortColumn);
    
    customQuery.stringSql = customQuery.stringSql.replace('$replaceLimitIndex', `$${customQuery.paramValues.length + 1}`);
    customQuery.stringSql = customQuery.stringSql.replace('$replaceOffsetIndex', `$${customQuery.paramValues.length + 2}`);

    customQuery.paramValues.push(limit);
    customQuery.paramValues.push(offset);

    return customQuery;
  }

  addFilterTextToSql(customQuery, filterMap) {
  
    let filterText = "";
    if (filterMap.size > 0)
    filterText += " AND ";
    
    filterMap.forEach(function (value, key) {
      let normalizedParam = SnakeCamelSwitcher.camelToSnakeString(key);
      customQuery.paramValues.push("%" + value.toUpperCase() + "%");
      filterText += `upper(${normalizedParam}::varchar) like $${customQuery.paramValues.length}`;
      if (customQuery.paramValues.length < filterMap.size) filterText += " AND ";
    });
    
    customQuery.stringSql = customQuery.stringSql.replace('$replaceFilterText', `${filterText}`);
    return customQuery;
  
  }
  
  addFilterIdToSql(customQuery, filterMap) {
    let filterId = "";
    if (filterMap.size > 0)
      filterId += " AND ";
      
      filterMap.forEach(function (value, key) {
        let normalizedParam = SnakeCamelSwitcher.camelToSnakeString(key);
        customQuery.paramValues.push(value);
        filterId += `${normalizedParam} = $${customQuery.paramValues.length}`;
        if (customQuery.paramValues.length <= filterMap.size) {
          filterId += " AND ";
        }
      });
      
    filterId = (filterId.substring(filterId.length - 4) == 'AND ') ? filterId.substring(0, filterId.length-4): filterId;
  
    customQuery.stringSql = customQuery.stringSql.replace('$replaceFilterId', `${filterId}`);
    return customQuery;
  }

  addFilterBoolToSql(customQuery, filterMap) {
    let filterId = "";
    if (filterMap.size > 0)
      filterId += " AND ";
      
      filterMap.forEach(function (value, key) {
        value = toLogico(value);
        
        let normalizedParam = SnakeCamelSwitcher.camelToSnakeString(key);
        customQuery.paramValues.push(value);
        filterId += `${normalizedParam} = $${customQuery.paramValues.length}`;
        if (customQuery.paramValues.length <= filterMap.size) {
          filterId += " AND ";
        }
      });
      
    filterId = (filterId.substring(filterId.length - 4) == 'AND ') ? filterId.substring(0, filterId.length-4): filterId;
  
    customQuery.stringSql = customQuery.stringSql.replace('$replaceFilterBool', `${filterId}`);
    return customQuery;
  }
  
  addOrderParamToSql(customQuery, orderColumn) {
    let normalizedParam = orderColumn[0];

    if (!Number.isInteger(orderColumn[0])) {
      normalizedParam = SnakeCamelSwitcher.camelToSnakeString(orderColumn[0]);
    }

    customQuery.stringSql = customQuery.stringSql.replace('$replaceOrderColumn', `${normalizedParam} ${orderColumn[1]}`);
    return customQuery;
  }

  initFilters(filterStringOptions, filterStringMap, filterIdOptions, filterIdMap, filterBoolOptions, filterBoolMap, req) {
    for (const [key, value] of Object.entries(req.query)) {
      if (filterStringOptions.includes(key)) {
        filterStringMap.set(key, value);
      }

      if (filterIdOptions.includes(key)) {
        filterIdMap.set(key, value);
      }

      if (filterBoolOptions.includes(key)) {
        filterBoolMap.set(key, value);
      }
    }
  }
}

module.exports = PrepareSql;
