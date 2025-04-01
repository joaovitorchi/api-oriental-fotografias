var db, prive, field;

class DatabasePrepare {

  constructor() {
    db = this;
  }

  async pgPrepare(sql, params) {
    var length = params.length;

    for (var i = length - 1; i >= 0; i--) {
      if (typeof (params[i]) === 'object') {
        if (params[i] instanceof Date) {
          field = params[i].toISOString();
        } else {
          field = params[i];
        }
      } else {
        field = params[i].toString();
      }
      
      sql = DatabasePrepare.param(sql, i);
    }

    sql = DatabasePrepare.sujarComDolarNumero(sql);

    return sql;
  }

  static param(sql, i) {
    prive = false;
    if (field !== null && typeof (field) === 'object') {
      DatabasePrepare.arrayParam();
    } else {
      DatabasePrepare.higienizarSimboloMonetario();
      DatabasePrepare.higienizarDolarNumero();
      DatabasePrepare.priveWords();
      if (!prive) {
        field = field.split(`'`).join(`''`);
      }
    }

    return sql.split(`$${(++i)}`).join(prive ? field : `'${field}'`);
  }

  static arrayParam() {
    var sub = [];
    var length = field.length;
    for (var i = 0; i < length; i++) {
      sub = DatabasePrepare.arraySubParam(sub, i, field[i]);
    }

    if (sub.length > 0) {
      field = sub.join(',');
    } else {
      field = field.join("','");
    }

    DatabasePrepare.priveWords();
  }

  static arraySubParam(sub, ky, vl) {
    if (typeof (vl) === 'object') {
      var length = vl.length;
      for (var i = 0; i < length; i++) {
        vl[i] = vs.split("'").join("''");
      }
      sub[ky] = "('" + vl.join("','") + "')";
    } else {
      field[ky] = vl.toString().split("'").join("''");
    }

    return sub;
  }

  static sujarComDolarNumero(text) {
    if (text == null || text.indexOf('##$##') < 0) return text;

    const repl = /##\$##/gi;
    return text.replace(repl, '$');
  }

  static higienizarSimboloMonetario() {
    if (field == null || field.indexOf('R$') < 0) return;

    const regexSimbolo = /(R\$)([0-9])/g;
    field = field.replace(regexSimbolo, '$1 $2');
  }

  static higienizarDolarNumero() {
    if (field === null || field.indexOf('$') < 0) return;

    const regexSimbolo = /\$/g;
    field = field.replace(regexSimbolo, '##$##');
  }

  static priveWords() {
    var words = ['vnd.', 'now(', 'cast(', 'select ', '('];
    var length = words.length;

    for (var i = 0; i < length; i++) {
      if (field === null || field.indexOf(words[i]) === 0) {
        prive = true;
      }
    }
  }
}

module.exports = new DatabasePrepare();