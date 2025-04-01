const PrepareSql = require("./prepare-sql");

module.exports = {
  /**
   * 
   * @param {Array<string>} filterStringOptions 
   * @param {Array<string>} filterIdOptions 
   * @param {Array<string>} filterBoolOptions 
   * @param {Array<string>} sortOptions 
   * @param {Array<string>} sort 
   * @param {Array<string>} validDirections 
   * @param {integer} page 
   * @param {Function} method 
   * @param {Request} req 
   * @returns {Promise<any>}
   */
  async flexibleSearch(
    filterStringOptions,
    filterIdOptions,
    filterBoolOptions,
    sortOptions,
    sort,
    validDirections,
    page,
    method,
    req
  ) {
    const filterStringMap = new Map();
    const filterIdMap = new Map();
    const filterBoolMap = new Map();

    if ((Array.isArray(sort) && sort.length > 0) && (Array.isArray(sortOptions) && sortOptions.length > 0)) {
      sort = sort.split(",");
      const [field, direction] = sort;
      const isValidField = sortOptions.includes(field);
      const isValidDirection = validDirections.includes(direction);

      if (!isValidField || !isValidDirection) {
        throw new Error("O campo de ordenação é inválido");
      }
    } else {
      sort = [1, 'asc'];
    }

    new PrepareSql().initFilters(
      filterStringOptions,
      filterStringMap,
      filterIdOptions,
      filterIdMap,
      filterBoolOptions,
      filterBoolMap,
      req
    );


    page = Math.abs(page) || 1;
    const offset = (page - 1) * process.env.PAGINATION_ROWS_PER_PAGE;

    const result = await method(
      process.env.PAGINATION_ROWS_PER_PAGE,
      offset,
      filterStringMap,
      filterIdMap,
      filterBoolMap,
      sort
    );

    return result;
  }
};