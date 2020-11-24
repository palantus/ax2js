var SPBusinessLogic = function() {
  var show;
  this.fillShows = function() {
    var newname;
    var i;
    Info("Existing chosen show: " + show.SPName);
    console.log("ttsbegin");
    for (i = 0; i < 2; i++) {
      newname = strfmt("Hej %1", int2str(i));
      show = SPShow.find(newname);
      if (!show) {
        show.initvalue();
        show.SPType = SPType.Type1;
        show.SPName = newname;
        show.insert()
      }
    };
    console.log("ttscommit")
  }
  this.new = function() {
    show = SPShow.find("Hej 1")
  }
  this._getNull = function() {
    return null;
  };
}