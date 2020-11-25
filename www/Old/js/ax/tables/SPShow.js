var Type_SPShow = function() {
  TableBuffer.apply(this, arguments);
  this.setName = function() {
    this.SPName = _name
  }


}
Type_SPShow._new = function() {
  var ret = new Type_SPShow();
  ret.tableName = 'SPShow';
  return ret;
};
Type_SPShow.prototype = TableBuffer.prototype;
Type_SPShow.prototype.constructor = Type_SPShow;
Type_SPShow.prototype._getNull = function() {
  return Type_SPShow._new();
};
var SPShow = Type_SPShow;