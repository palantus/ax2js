var Global = function() {
  this.AOSClientMode = function() {
    return classfactory.AOSClientMode()
  }
  this.binary2cryptoblob = function() {
    var i;
    var cryptoBlob;
    if (_binary && ) {
      for (i = 0; i < _binaryLength; i++) {};
      return cryptoBlob
    }
  }
  this.BitReset = function() {
    return
  }
  this.BitSet = function() {
    return
  }
  this.BitTest = function() {
    return
  }
  this.buf2Buf = function() {
    var dicttable = new Dicttable(_from.TableId);
    var FieldId = dicttable.fieldnext(0);
  }
  this.Buf2Con = function() {
    var c = [common.TableId];
    var dicttable = new Dicttable(common.TableId);
    var FieldId = dicttable.fieldnext(0);
    var dictfield;
    return c
  }
  this.bufCmp = function() {
    return b1.equal(b2)
  }
  this.charMax = function() {
    var charMax = classfactory.GlobalCache().get(funcname(), 0, '');
    if (!charMax) {
      charMax = appl.charMax();
      classfactory.GlobalCache().set(funcname(), 0, charMax)
    };
    return charMax
  }
  this.CheckFailed = function() {
    Infolog.add(Exception.Warning, getprefix() + txt, helpURL, _sysInfoAction, false);
    return false
  }
  this.checkPercentage = function() {
    if (_value < ) {
      return CheckFailed("@SYS113615")
    };
    return true
  }
  this.checkSign = function() {
    var len = strlen(s);
    var check = function() {
      var pos = strscan(s, sign, 1, len);
      var posE = strscan(s, 'e', 1, len);
      if (!pos) {
        return true
      };
      if () {
        return false
      };
      s = strrem(s, sign);
      if () {
        return false
      };
      return true
    };
    if (!check('-')) {
      return false
    };
    if (!check('+')) {
      return false
    };
    return true
  }
  this.CheckTime = function() {
    if (timeSec < ) {
      return CheckFailed("@SYS25363")
    };
    return true
  }
  this.ClassId2Name = function() {
    var dictClass = new DictClass(_classid);
    if (dictClass) {
      return dictClass.name()
    };
    return ''
  }
  this.className2Id = function() {
    return new Dictionary().className2Id(_classname)
  }
  this.clientKind = function() {
    var cache = classfactory.GlobalCache();
    var clientType;
    var session;
    if (cache.isSet(classstr(Global), funcname())) {
      clientType = cache.get(classstr(Global), funcname(), ClientType.Client)
    };
    return clientType
  }
  this.clientmode = function() {
    var aosSession;
    var session;
    session = new Session();
    aosSession = new AOSSessionInfo(session.sessionid());
    if (aosSession) {
      return aosSession.clientmode()
    };
    return AOSClientMode.NotAOS
  }
  this.CLRSystemDateTime2UtcDateTime = function() {
    return CLRInterop.getAnyTypeForObject(_systemDateTime)
  }
  this.con2ArraySource = function() {
    var dictType = new DictType(_arrayfieldTypeid);
    var s = strfmt('%1 c2a(container _arrayData) \n', dictType.name());
    return s
  }
  this.Con2Buf = function() {
    var FieldId;
    var i;
    var dicttable;
    if () {
      dicttable = new Dicttable(common.TableId);
      FieldId = dicttable.fieldnext(0);
      i = 2;
    }
  }
  this.con2List = function() {
    var list = null;
    var i;
    var Types;
    var TypesIsOk = true;
    if (conlen(_con)) {
      Types = typeof(conpeek(_con, 1))
    };
    for (i = 2;; i++) {
      if () {
        TypesIsOk = false
      }
    };
    if (TypesIsOk) {
      list = new List(Types);
      for (i = 1;; i++) {
        list.addEnd(conpeek(_con, i))
      }
    };
    return list
  }
  this.Con2Str = function() {
    var idx = 0;
    var len = conlen(c);
    var tmp;
    var retStr;
    return retStr
  }
  this.configurationkeyId2Name = function() {
    var dictConfigurationKey = new DictConfigurationKey(_configurationKeyid);
    if (dictConfigurationKey) {
      return dictConfigurationKey.name()
    };
    return ''
  }
  this.configurationkeyId2pName = function() {
    var dictConfigurationKey = new DictConfigurationKey(_configurationKeyid);
    if (dictConfigurationKey) {
      return dictConfigurationKey.label()
    };
    return ''
  }
  this.configurationkeyName2Id = function() {
    var dict = new Dictionary();
    return dict.configurationkeyName2Id(_name)
  }
  this.containerFromXMLNode = function() {
    var retval, containerToInsert;
    var recordToInsert;
    var attrs;
    var typeAttr, element, recordNode, containerNode;
    var elemNo = 1;
    if () {
      return retval
    };
    element = n.firstChild();
    return retval
  }
  this.conView = function() {
    var formrun = classfactory.formrunClass(new Args(formstr(SysconView)));
    var design;
    if (_lookup) {
      formrun.setLookup(true)
    };
    formrun.init();
    if (!prmisdefault(_caption)) {
      design = formrun.design();
      design.caption(_caption)
    };
    formrun.setContainer(_containerToShow);
    if (_lookup) {
      return formrun
    };
    formrun.run();
    formrun.detach();
    return null
  }
  this.cryptoblob2binary = function() {
    var b = new Binary(conlen(_cryptoBlob));
    var i;
    if () {
      for (i = 0; i < conlen(_cryptoBlob); i++) {
        b.byte(i, conpeek(_cryptoBlob, i + 1))
      };
      return b
    }
  }
  this.cryptoblob2str = function() {
    var b;
    if () {
      b = cryptoblob2binary(_cryptoBlob);
      return b.wString(0)
    }
  }
  this.curExt2dataareaid = function() {
    var dicttable = new Dicttable(_TableId);
    var common;
    if (!dicttable) {
      return ''
    };
    common = dicttable.makeRecord();
    return common.DataAreaid
  }
  this.currentAOLayer = function() {
    var cache = classfactory.GlobalCache();
    var value;
    if (cache.isSet(classstr(Global), funcname())) {
      value = cache.get(classstr(Global), funcname());
      return value
    };
    value = Infolog.currentAOLayer();
    cache.set(classstr(Global), funcname(), value);
    return value
  }
  this.Date2Qtr = function() {
    return ()
  }
  this.Date2StrUsr = function() {
    return date2str(transDate, )
  }
  this.date2StrXpp = function() {
    return Num2Str0(dayofmth(_date), 2) + '\\' + Num2Str0(mthofyr(_date), 2) + '\\' + Num2Str0(year(_date), 4)
  }
  this.dateEndMth = function() {
    return
  }
  this.DateEndQtr = function() {
    if () {
      transDate = nextmth(transDate)
    };
    if () {
      transDate = nextmth(transDate)
    };
    return endmth(transDate)
  }
  this.DateEndWk = function() {
    return
  }
  this.dateEndYr = function() {
    return
  }
  this.dateInterval = function() {
    return strfmt('%1 - %2', dateFrom, dateTo)
  }
  this.DateMax = function() {
    return maxdate()
  }
  this.DateMthFwd = function() {
    var day = dayofmth(transDate);
    var month = mthofyr(transDate);
    var yr = year(transDate);
    month = month + qty;
    return mkdate(day, month, yr)
  }
  this.DateNull = function() {
    return new Date(1900, 1, 1)
  }
  this.DateStartMth = function() {
    return +1
  }
  this.DateStartQtr = function() {
    if () {
      transDate = prevmth(transDate)
    };
    if () {
      transDate = prevmth(transDate)
    };
    return DateStartMth(transDate)
  }
  this.DateStartWk = function() {
    return
  }
  this.DateStartYr = function() {
    return +1
  }
  this.datetobeginUtcDateTime = function() {
    return DateTimeUtil.newDateTime(currDate, 0, tz)
  }
  this.DeleteTable = function() {
    var dictionary = new Dictionary();
    var con = new Connection();
    var tableHandle = dictionary.tableName2Id(tablename);
    var anyRecord;
    var dicttable;
    var common;
    if (!dictionary.tableSql(tableHandle)) {
      return
    };
    dicttable = new Dicttable(tableHandle);
    if () {
      return
    };
    dicttable = new Dicttable(tableHandle);
    anyRecord = dicttable.makeRecord();
    common = dicttable.makeRecord();
    console.log("ttsbegin");
    common.skipDeleteMethod(true);
    common.skipDeleteActions(true);
    var common;
    console.log("ttscommit");
    if () {
      Dictionary.dataFlush(dicttable.id())
    }
  }
  this.dictionaryFlush = function() {
    var dictionary = new Dictionary();
    dictionary.enumFlush();
    dictionary.typeFlush();
    dictionary.tableFlush();
    dictionary.classFlush()
  }
  this.domainAccess = function() {
    return !((new) && useDomains())
  }
  this.DynaKey2Record = function() {
    var qrun;
    var qB;
    var q;
    var fstr;
    var i;
    var FieldId;
    var record;
    if (!keystr) {
      return null
    };
    q = new Query();
    qB = q.addDataSource(TableId);
    qrun = new QueryRun(q);
    qrun.next();
    record = qrun.get(TableId);
    return record
  }
  this.endLengthyOperation = function() {
    if (!Infolog) {
      return
    };
    if (prmisdefault(endALL)) {
      Infolog.endLengthyOperation()
    }
  }
  this.enum2int = function() {
    return e
  }
  this.enum2Symbol = function() {
    var de = new DictEnum(_id);
    return de.value2Symbol(_val)
  }
  this.Enum2Value = function() {
    var test;
    var t = typeof(E);
    var len;
    if () {};
    test = strfmt('%1', E);
    len = strlen(test);
    if () {
      return int2str(E)
    };
    return test
  }
  this.EnumId2Name = function() {
    var dictEnum = new DictEnum(id);
    if (dictEnum) {
      return dictEnum.name()
    };
    return ''
  }
  this.enumId2pName = function() {
    var dictEnum = new DictEnum(id);
    if (dictEnum) {
      return dictEnum.label()
    };
    return ''
  }
  this.enumInit = function() {
    var dictEnum = new DictEnum(id);
    var i;
    if (dictEnum) {
      for (i = 0; i < dictEnum.values(); i++) {
        if (isConfigurationkeyEnabled(dictEnum.value2ConfigurationKey(i))) {
          return i
        }
      }
    };
    return 0
  }
  this.enumName2Id = function() {
    var dict = new Dictionary();
    return dict.enumName2Id(enumname)
  }
  this.Error = function() {
    return Infolog.add(Exception.Error, getprefix() + txt, helpUrl, _sysInfoAction, false)
  }
  this.ExceptionTextFallThrough = function() {}
  this.existLayer = function() {
    var utilfile = new Utilfile(_old ? 'old' : 'aod');
    var layers = utilfile.layers();
    return
  }
  this.ExtendedTypeId2DisplayName = function() {
    return ''
  }
  this.ExtendedTypeId2name = function() {
    var dictType = new DictType(id);
    if (dictType) {
      return dictType.name()
    };
    return ''
  }
  this.extendedTypeId2pname = function() {
    var dictType = new DictType(id);
    if (dictType) {
      return dictType.label()
    };
    return ''
  }
  this.extendedTypeId2Type = function() {
    var d = new DictType(_id);
    if () {
      return Types.AnyType
    }
  }
  this.extendedTypeName2Id = function() {
    var dict = new Dictionary();
    return dict.typename2id(_typename)
  }
  this.Factorial = function() {
    if () {
      return
    }
  }
  this.FieldExt2Id = function() {
    return ()
  }
  this.FieldExt2Idx = function() {
    return ()
  }
  this.FieldId2Ext = function() {
    return ()
  }
  this.FieldLabelValue = function() {
    var dictfield = new Dictfield(t_TableId, f_FieldId);
    if () {
      return ""
    }
  }
  this.fileNameNext = function() {
    var i;
    var filename;
    var filenameType;
    var filePath;
    [filePath;filename;filenameType] = fileNameSplit(_filename);
    return _filename
  }
  this.fileNameTrim = function() {
    var path;
    var name;
    var extention;
    [path;name;extention] = fileNameSplit(_filename);
    if (!name) {
      return ''
    };
    return path + name + extention
  }
  this.FindProperty = function() {
    var propertyPos = findPropertyPos(_properties, _property);
    var j;
    var k;
    var propertyvalue;
    if (propertyPos) {
      j = strscan(_properties, '#', propertyPos, ) + 1;
      k = strscan(_properties, '\n', j, );
      propertyvalue = substr(_properties, j, )
    };
    return propertyvalue
  }
  this.findPropertyPos = function() {
    var propertyPattern = ' ' + _property + ' ';
    var propertyPos = strscan(_properties, propertyPattern, 1, strlen(_properties));
    if (propertyPos && ()) {
      propertyPos++;
      return propertyPos
    };
    return 0
  }
  this.FirstLine = function() {
    var i = strfind(txt, '\n', 1, strlen(txt));
    return i ? substr(txt, 1, ) : txt
  }
  this.firstWeekOfYear = function() {
    var ret;
    var calendarWeekRulevalue;
    var dateTimeformatInfo;
    var calendarWeekRule;
    dateTimeformatInfo = .get_CurrentInfo();
    calendarWeekRule = dateTimeformatInfo.get_CalendarWeekRule();
    calendarWeekRulevalue = ClrInterop.getAnyTypeForObject(calendarWeekRule);
    return ret
  }
  this.formCaption = function() {
    var form = new form(formname);
    if (form && form.design()) {
      return form.design().caption()
    };
    return ''
  }
  this.formControlValue = function() {
    if () {
      return null
    };
    return null
  }
  this.formDataSourceArrayFieldExtObjects = function() {
    var mapfieldObjects;
    var dictfield;
    var extFieldId;
    var x;
    if () {
      return null
    };
    mapfieldObjects = new Map(Types.Integer, Types.Class);
    dictfield = new Dictfield(_formdataSource.table(), _FieldId);
    for (x = 1;; x++) {
      extFieldId = FieldId2Ext(_FieldId, x);
      mapfieldObjects.insert(extFieldId, _formdataSource.object(extFieldId))
    };
    return mapfieldObjects
  }
  this.formDataSourceHasMethod = function() {
    if () {
      return false
    };
    return form.formObjectSetHasMethod(_formdataSource, _methodname)
  }
  this.formDataSourceRefresh = function() {
    var formObjectSet;
    if (_common.dataSource()) {
      formObjectSet = _common.dataSource();
      formObjectSet.refresh()
    }
  }
  this.formGetParentDatasource = function() {
    var i;
    if (!formdataSource) {
      return null
    };
    for (i = 1;; i++) {
      if () {
        return formdataSource.formrun().dataSource(i)
      }
    };
    return null
  }
  this.formHasMethod = function() {
    if () {
      return false
    };
    return Sysformrun.hasMethod(fr, methodname)
  }
  this.formName2Pname = function() {
    var mf;
    if (mf) {
      if (mf.label()) {
        return mf.label()
      }
    };
    return formCaption(formname)
  }
  this.getPrimaryKey = function() {
    var dicttable = new Dicttable(common.TableId);
    var dictIndex = new DictIndex(dicttable.id(), dicttable.indexUnique());
    var FieldId;
    var sysDictfield;
    var key, s;
    var i;
    for (i = 1;; i++) {
      FieldId = dictIndex.field(i);
      sysDictfield = new SysDictfield(dicttable.id(), FieldId);
    };
    return key
  }
  this.getXmlNodeValue = function() {
    var re = new('^[ \r\n\t]*((.|\n)*?)[ \r\n\t]*$');
    var m = re.Match(_node.text());
    var result;
    result = m.Result('$1');
    return result
  }
  this.GuidFromString = function() {
    return str2guid(_value)
  }
  this.hasFieldAccess = function() {
    var dictfield = new Dictfield(_TableId, _FieldId);
    if (dictfield) {
      return
    };
    return false
  }
  this.hasGUI = function() {
    var cache = classfactory.GlobalCache();
    var hasGUI = cache.get(staticmethodstr(Global, hasGUI), 0, false);
    if (cache.isSet(staticmethodstr(Global, hasGUI), 0)) {
      return hasGUI
    };
    hasGUI = false;
    if (new) {
      hasGUI = true
    };
    cache.set(staticmethodstr(Global, hasGUI), 0, hasGUI);
    return hasGUI
  }
  this.hasMenuItemAccess = function() {
    var ret = false;
    var sysDictMenu = SysDictMenu.newMenuItem(name, type);
    if (sysDictMenu) {
      ret = sysDictMenu.isVisible()
    };
    return ret
  }
  this.hasMenuItemSecurityAccess = function() {
    if (_menu) {
      if (_menu.configurationKey()) {
        if (!isConfigurationkeyEnabled(_menu.configurationKey())) {
          return false
        };
        if (!isConfigurationkeyEnabled(_menu.countryConfigurationkey())) {
          return false
        };
        if (!isConfigurationkeyEnabled(_menu.webConfigurationkey())) {
          return false
        }
      };
      if (_menu.securityKey()) {
        if (!hasSecuritykeyAccess(_menu.securityKey(), _menu.neededAccesslevel())) {
          return false
        }
      }
    };
    return true
  }
  this.hasProperty = function() {
    if (findPropertyPos(_properties, _property)) {
      return true
    };
    return false
  }
  this.hasSecureWebNodeAccess = function() {
    if (node) {
      return node.checkAccessRights()
    };
    return false
  }
  this.hasSecuritykeyAccess = function() {
    var dsk = new DictSecurityKey(securityKeyid);
    if () {
      return false
    }
  }
  this.hasTableAccess = function() {
    var dicttable = new Dicttable(_TableId);
    if (dicttable) {
      return
    };
    return false
  }
  this.Hex2Int = function() {
    var res = 0;
    var d = strlen(hex);
    var i = 1;
    var char;
    var largeA = char2num('A', 1);
    var largeF = char2num('F', 1);
    var zero = char2num('0', 1);
    var nine = char2num('9', 1);
    hex = strupr(hex);
    return res
  }
  this.Info = function() {
    return Infolog.add(Exception.Info, getprefix() + txt, helpUrl, _sysInfoAction, false)
  }
  this.InRange = function() {
    var t;
    var q;
    var qbdS;
    var qbR;
    var qR;
    if (_checkNull) {
      if () {
        return false
      }
    };
    q = new Query();
    qbdS = q.addDataSource(t.TableId);
    qbR.value(_rangevalue);
    t.insert();
    qR = new QueryRun(q);
    qR.setCursor(t);
    return qR.next()
  }
  this.int642int = function() {
    if () {
      if (_throwIfError && ) {};
      return any2int(_value)
    };
    if (_throwIfError && _value < IntMin()) {};
    return any2int(_value)
  }
  this.int64Max = function() {
    return 0x7fffffffffffffff
  }
  this.int64Min = function() {
    return 0x8000000000000000
  }
  this.IntMax = function() {
    return maxint()
  }
  this.IntMin = function() {
    return minint()
  }
  this.isAOS = function() {
    return xGlobal.isAOS()
  }
  this.isClientThin = function() {
    return
  }
  this.isConfigMode = function() {
    var cache = classfactory.GlobalCache();
    var value;
    if (cache.isSet(classstr(Global), funcname())) {
      return cache.get(classstr(Global), funcname())
    };
    value = appl.isConfigMode();
    cache.set(classstr(Global), funcname(), value);
    return value
  }
  this.isConfigurationkeyEnabled = function() {
    return DictConfigurationKey.enabledByid(configurationkey)
  }
  this.isGuest = function() {
    return xGlobal.isGuest()
  }
  this.isInteger = function() {
    return Str2IntOk(txt)
  }
  this.isNative = function() {
    return !appl.isSqlConnected()
  }
  this.isRunningMode = function() {
    var cache = classfactory.GlobalCache();
    var mode;
    if (cache.isSet(classstr(Global), funcname())) {
      return cache.get(classstr(Global), funcname())
    };
    if (!appl) {
      return false
    };
    mode = appl.isRunningMode();
    cache.set(classstr(Global), funcname(), mode);
    return mode
  }
  this.isRunningOnServer = function() {
    return
  }
  this.isSysId = function() {
    return
  }
  this.IsTableUserEnabled = function() {
    var dt = new Dicttable(TableId);
    if () {
      return false
    }
  }
  this.isType = function() {
    var dictType;
    if (!_extendedTypeid) {
      return false
    };
    if () {
      return true
    };
    dictType = new DictType(_extendedTypeid);
    if () {
      return Global.isType(dictType.extend(), _isExtendedTypeid)
    }
  }
  this.IsTypeTime = function() {
    return Global.isType(TypeId2ExtendedTypeId(id), TypeId2ExtendedTypeId(typeid(timeOfDay)))
  }
  this.isValidAOTName = function() {
    var i, len;
    var c;
    for (i = 1;;) {
      c = substr(sText, i, 1);
      if (!() && !() && !() && !()) {
        return false
      }
    };
    return true
  }
  this.isValidURL = function() {
    var permission;
    var ret;
    var urlFilter;
    var regEx;
    var regMatch;
    permission = new InteropPermission(InteropKind.ClrInterop);
    permission.assert();
    urlFilter = "^(http(s?)\:\/\/)?[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&;%\$#_]*)?$";
    regEx = new(urlFilter);
    regMatch = regEx.Match(url);
    ret = regMatch.get_Success();
    return ret
  }
  this.languageList = function() {
    return xGlobal.languageList()
  }
  this.layerExists = function() {
    var newUtil = new Utilfile('aod');
    var layers = newUtil.layers();
    var j;
    return false
  }
  this.loadArrayFromXML = function() {
    var attrs;
    var elementNode = n;
    var s;
    var indexvalue;
    if () {
      return 0
    };
    elementNode = n.firstChild();
    return 0
  }
  this.loadListFromXML = function() {
    var elementNode;
    var s;
    if () {
      return 0
    };
    elementNode = n.firstChild();
    return 0
  }
  this.loadMapFromXML = function() {
    var elementNode;
    var keyNode, valueNode;
    var keyvalue, valuevalue;
    if () {
      return 0
    };
    elementNode = n.firstChild();
    return 0
  }
  this.loadSetFromXML = function() {
    var elementNode;
    var res;
    if () {
      return 0
    };
    elementNode = n.firstChild();
    return 0
  }
  this.loadStructFromXML = function() {
    var elementNode;
    var attrs;
    var fieldType;
    var FieldName;
    var res;
    if () {
      return 0
    };
    elementNode = n.firstChild();
    return 0
  }
  this.maxRecId = function() {
    return 0x7fffffffffffffff
  }
  this.maxUInt = function() {
    return 4294967295.0
  }
  this.maxUIPercent = function() {
    return 99999999999999.99
  }
  this.menuItemTypeStr2Type = function() {
    return MenuItemType.Display
  }
  this.MinOne = function() {
    if (!value) {
      return 1
    };
    return value
  }
  this.minRecId = function() {
    return 0
  }
  this.Modulo10 = function() {
    var idx;
    var control;
    var sumvalue;
    var lengthTxt;
    if (calculateControl) {
      numeralsTxt = numeralsTxt + '0'
    };
    lengthTxt = strlen(numeralsTxt);
    idx = lengthTxt;
    control = ;
    return control
  }
  this.Modulo11 = function() {
    var numerals;
    var vector;
    var sumNumerals;
    vector = 2;
    sumNumerals = 0;
    numeralsTxt = strkeep(numeralsTxt, '0123456789');
    sumNumerals = str2int(substr(numeralsTxt, 999, ));
    numeralsTxt = strdel(numeralsTxt, 999, );
    return ()
  }
  this.NaDate = function() {
    return DateMax()
  }
  this.NaInt = function() {
    return IntMin()
  }
  this.Name2Alias = function() {
    return strrem(_name, ' .,;/-:\\+')
  }
  this.NaReal = function() {
    return RealMin()
  }
  this.NaStr = function() {
    return num2char(255)
  }
  this.nullValue = function() {
    return nullValueBaseType(typeof(a))
  }
  this.nullValueBaseType = function() {
    var common;
    return 0
  }
  this.nullValueFromType = function() {
    return 0
  }
  this.num2expstr = function() {
    var log = (r ? log10(abs(r)) : 0);
    var decs = real2int(log);
    var factor;
    var i;
    if () {};
    if () {
      factor = decs < 0 ? 10 : 0.1;
      for (i = 1;; i++) {
        r =
      };
      return num2str(r, 0, NumOfDec(r), 1, 0) + (decs ? 'e' + int2str(decs) : '')
    };
    return num2str(r, 0, NumOfDec(r), _separator1, _separator2)
  }
  this.Num2Str0 = function() {
    var curTxt;
    var negative = false;
    if (value < 0.0) {
      value = ;
      negative = true;
    };
    curTxt = num2str(value, 0, NumOfDec, sepDec, sep1000);
    curTxt = strrep('0', ) + curTxt;
    if (negative) {
      curTxt = '-' + curTxt
    };
    return curTxt
  }
  this.numberOfProcessors = function() {
    var systemInfo;
    var numberOfProcessors;
    systemInfo = WinAPI.getSystemInfo();
    numberOfProcessors = conpeek(systemInfo, 6);
    return numberOfProcessors
  }
  this.numeralsToTxt = function() {
    var numOfPennies = ;
    var test = ;
    var numOfTenths;
    var, , hundreds, thousands, millions, billions, trillions;
    var temp;
    var returntxt;
    var modOperator = function() {
      var tmpi;
      var tmp1, tmp2;
      tmp1 = ;
      tmpi = real2int(tmp1);
      tmp2 = tmpi;
      return
    };
    var checkPower = function() {
      var numOfPower;
      if () {
        numOfPower = ;
        if () {
          temp = ;
          returntxt = returntxt + ' ' + +' ' + hundreds;
          numOfPower =
        };
        if () {
          temp = ;
          returntxt = returntxt + ' ' + ;
          numOfPower =
        };
        if () {
          returntxt = returntxt + ' ' + ;
          numOfPower =
        };
      };
      return _test
    }; = "@SYS26620"; = "@SYS26621"; = "@SYS26622"; = "@SYS26626"; = "@SYS26627"; = "@SYS26628"; = "@SYS26629"; = "@SYS26630"; = "@SYS26631"; = "@SYS26632"; = "@SYS26633"; = "@SYS26634"; = "@SYS26635"; = "@SYS26636"; = "@SYS26637"; = "@SYS26638"; = "@SYS26639"; = "@SYS26640"; = "@SYS26641"; = 'Not used'; = "@SYS26643"; = "@SYS26644"; = "@SYS26645"; = "@SYS26646"; = "@SYS26647"; = "@SYS26648"; = "@SYS26649"; = "@SYS26650";
    hundreds = "@SYS26651";
    thousands = "@SYS26652";
    millions = "@SYS26653";
    billions = "@SYS26654";
    trillions = "@SYS101697";
    test = checkPower(test, 1000000000000);
    test = checkPower(test, 1000000000);
    test = checkPower(test, 1000000);
    test = checkPower(test, 1000);
    test = checkPower(test, 100);
    if () {
      numOfTenths = ;
      returntxt = returntxt + ' ' + ;
      numOfTenths = ;
      test =
    };
    if () {
      numOfTenths = real2int(test);
      returntxt = returntxt + ' ' +
    };
    if (numOfPennies) {
      returntxt = '***' + returntxt + ' ' + "@SYS5534" + ' ' + num2str(numOfPennies, 0, 0, 0, 0) + '/100'
    };
    return returntxt
  }
  this.NumOfDec = function() {
    var s = num2str(frac(abs(r)), 0, 16, 1, 0);
    return
  }
  this.objectFromXMLNode = function() {
    var dc;
    var retval;
    var hasCreateFromxmlMethod = function() {
      var i;
      for (i = 1;; i++) {
        if () {
          return true
        }
      };
      return false
    };
    if () {
      return null
    };
    dc = new DictClass(className2Id(n.nodename()));
    if (dc) {
      if (hasCreateFromxmlMethod(dc)) {
        retval = dc.callStatic('createFromxml', n)
      }
    };
    return retval
  }
  this.OperatingSystem = function() {
    var OperatingSystem = '';
    var majorversion, minorversion, buildNumber, platformid;
    var dummy;
    var con;
    con = WinAPI.getversion();
    if () {
      [majorversion;minorversion;buildnumber;platformid;dummy] = con;
    };
    return OperatingSystem
  }
  this.Percent = function() {
    if (base) {
      return
    };
    return 0
  }
  this.PhysicalMemory = function() {
    var memorystatus;
    var memoryInMB;
    memorystatus = WinAPI.getMemorystatus();
    if () {
      memoryInMB = round(1) + 1;
      return real2int(memoryInMB)
    };
    return 0
  }
  this.PickDataArea = function() {
    var formrun;
    var args;
    args = new Args(formstr(SysPick));
    args.parm(' 6');
    formrun = classfactory.formrunClass(args);
    formrun.init();
    formrun.run();
    formrun.wait();
    return formrun.selection()
  }
  this.pickDomain = function() {
    var formrun;
    var args;
    args = new Args(formstr(SysPick));
    args.parm('10');
    formrun = classfactory.formrunClass(args);
    formrun.init();
    formrun.run();
    formrun.wait();
    return formrun.selection()
  }
  this.PickField = function() {
    var formrun;
    var args;
    args = new Args(formstr(SysPick));
    args.parm(' 2' + int2str(TableId));
    formrun = classfactory.formrunClass(args);
    formrun.init();
    formrun.run();
    formrun.wait();
    if (formrun.selection()) {
      return formrun.selection()
    };
    return 0
  }
  this.PickIndex = function() {
    var formrun;
    var args;
    args = new Args(formstr(SysPick));
    args.parm(' 3' + int2str(indexid));
    formrun = classfactory.formrunClass(args);
    formrun.init();
    formrun.run();
    formrun.wait();
    if (formrun.selection()) {
      return formrun.selection()
    };
    return 0
  }
  this.pickList = function() {
    var formrun;
    var args;
    args = new Args(formstr(SysPick));
    args.parm(' 0');
    args.parmObject(_map);
    formrun = classfactory.formrunClass(args);
    formrun.init();
    formrun.run();
    formrun.setColumnHeader(_columnHeader);
    formrun.setCaption(_title);
    formrun.wait();
    if (formrun.selection()) {
      return formrun.selection()
    };
    return ''
  }
  this.PickUser = function() {
    var formrun;
    var args;
    args = new Args(formstr(SysPick));
    args.parm(' 4');
    args.parmObject(_map);
    formrun = classfactory.formrunClass(args);
    formrun.init();
    formrun.run();
    formrun.wait();
    return formrun.selection()
  }
  this.PickUserGroup = function() {
    var formrun;
    var args;
    args = new Args(formstr(SysPick));
    args.parm(' 5' + userid);
    formrun = classfactory.formrunClass(args);
    formrun.init();
    formrun.run();
    formrun.wait();
    return formrun.selection()
  }
  this.primaryLanguageId = function() {
    return
  }
  this.ProcessorInfo = function() {
    var systemInfo;
    var ProcessorInfo = '';
    var processorArchitecture, processorlevel, processorRevision;
    var processorRevisionFamily, processorRevisionStepping;
    systemInfo = WinAPI.getSystemInfo();
    if () {
      processorArchitecture = conpeek(systemInfo, 1);
      processorlevel = conpeek(systemInfo, 9);
      processorRevision = conpeek(systemInfo, 10);
      if () {}
    };
    return ProcessorInfo
  }
  this.QueryDeleteDynalinks = function() {
    SysQuery.deletedynalinks(q, initQ, initQdsNo)
  }
  this.queryIsPackedOk = function() {
    return SysQuery.ispackedOk(packed)
  }
  this.QueryMergeRanges = function() {
    SysQuery.mergeranges(q, initQ, initQdsNo, alwaysaddDataSource, addSamefieldrange)
  }
  this.queryName2Pname = function() {
    var mf;
    var Query;
    if (mf) {
      return mf.label()
    };
    Query = new Query(Queryname);
    if (Query) {
      return Query.title()
    };
    return ''
  }
  this.queryNotValue = function() {
    return SysQuery.valueNot(a)
  }
  this.queryRange = function() {
    return SysQuery.range(_From, _To)
  }
  this.queryRangeConcat = function() {
    if (_queryRange) {
      return _queryRange + ',' + QueryValue(_value)
    };
    return QueryValue(_value)
  }
  this.QueryValue = function() {
    return SysQuery.value(a)
  }
  this.real2int = function() {
    return any2int(_realvalue)
  }
  this.real2UnsignedInt = function() {
    var rmaxInt = maxint();
    if (r < 0) {
      return 0
    };
    if () {
      return 0
    };
    if () {
      return any2int(+maxint())
    };
    return any2int(r)
  }
  this.RealMax = function() {
    return 9.999999999999999e127
  }
  this.RealMin = function() {
    return
  }
  this.record2DynaKey = function() {
    var TableId = rec.TableId;
    var dicttable = new Dicttable(TableId);
    var indexid = dicttable.indexUnique();
    var dictIndex = dicttable.indexObject(indexid);
    var buf;
    var indexCnt;
    var fieldsInIndex;
    var FieldId;
    var any2strLocal = function() {
      return t
    };
    if () {
      return '[' + int2str(fieldnum(Common, Recid)) + ':' + int642str(rec.Recid) + ']'
    };
    return buf
  }
  this.recordFromXMLNode = function() {
    var table;
    var field;
    var dt;
    var df;
    var fieldNode;
    var FieldName;
    var content;
    var tablename;
    var t;
    var extendedfieldIndex;
    if () {
      return null
    };
    if (prmisdefault(c)) {
      tablename = n.attributes().getnamedItem('name');
      if () {
        tablename = n.attributes().getnamedItem('table')
      };
      if () {
        table = tableName2Id(tablename.nodevalue());
        dt = new Dicttable(table);
        c = dt.makeRecord()
      }
    };
    fieldNode = n.firstChild();
    return c
  }
  this.reportHasMethod = function() {
    var ret = false;
    var sysreportRun;
    if (SysDictClass.isequalOrSuperclass(classidget(rr), classnum(SysreportRun))) {
      sysreportRun = rr;
      ret = sysreportRun.reportHasMethod(methodname)
    };
    return ret
  }
  this.reportName2Pname = function() {
    var mf;
    var report;
    if (mf && mf.label()) {
      return mf.label()
    };
    report = new report(reportname);
    if (report && report.design()) {
      return report.design().caption()
    };
    return ''
  }
  this.RoundDown = function() {
    var roundedvalue;
    roundedvalue = round(value, unit);
    if () {
      return value
    };
    return round(unit) + roundedvalue
  }
  this.RoundDownDec = function() {
    var unit = 1;
    return RoundDown(value, unit)
  }
  this.RoundUp = function() {
    var roundedvalue;
    roundedvalue = round(value, unit);
    if () {
      return value
    };
    return round(+, unit) + roundedvalue
  }
  this.RoundUpDec = function() {
    var unit = 1;
    return RoundUp(value, unit)
  }
  this.RoundZero = function() {
    if () {
      return RoundDown(value, unit)
    };
    return RoundUp(value, unit)
  }
  this.RoundZeroDec = function() {
    var unit = 1;
    if () {
      return RoundDown(value, unit)
    };
    return RoundUp(value, unit)
  }
  this.SAX2Supported = function() {
    var objDoc;
    var InfoItem = Infolog.line();
    var retval = true;
    return retval
  }
  this.securitykeyId2Name = function() {
    var dictSecurityKey = new DictSecurityKey(_securityKeyid);
    if (dictSecurityKey) {
      return dictSecurityKey.name()
    };
    return ''
  }
  this.SecurityKeyName2Id = function() {
    var dict = new Dictionary();
    return dict.SecurityKeyName2Id(_name)
  }
  this.selectMultiple = function() {
    var args;
    var formrun;
    var obj;
    args = new Args(formstr(SysListSelect));
    args.caller(_caller);
    formrun = classfactory.formrunClass(args);
    formrun.init();
    formrun.design().visible(true);
    obj = formrun;
    obj.Infotxt(_Info);
    obj.choices(_choices);
    obj.headers(_headers);
    formrun.run();
    obj.setCaption(_caption);
    formrun.wait();
    return [formrun.closedOk();obj.selected()]
  }
  this.selectSingle = function() {
    var args;
    var formrun;
    var obj;
    args = new Args(formstr(SysListSelect));
    args.caller(_caller);
    formrun = classfactory.formrunClass(args);
    formrun.init();
    formrun.design().visible(true);
    obj = formrun;
    obj.Infotxt(_Info);
    obj.choices(_choices);
    obj.headers(_headers);
    obj.selectSingle();
    formrun.run();
    obj.setCaption(_caption);
    formrun.wait();
    return [formrun.closedOk();conpeek(obj.selected(), 1)]
  }
  this.ShowHelp = function() {
    var helpGenerator = Infolog.helpGenerator();
    helpGenerator.showURL(_url)
  }
  this.sign = function() {
    return
  }
  this.SmartHeapMemorySizeUp = function() {
    var hc;
    var i, pageSize, newPageSize, physMem, minPageSize;
    var memstatus;
    memstatus = WinAPI.getMemorystatus();
    physMem = ;
    minPageSize = min(32768, );
    setprefix(funcname());
    if (!_silent) {
      Info(strfmt('Physical Memory = %1 MB', physMem));
      Info(strfmt('Minimum page size = %1 Bytes', minPageSize))
    };
    hc = new HeapCheck();
    i = hc.poolCount();
  }
  this.sqrt = function() {
    return power(a, 0.5)
  }
  this.startLengthyOperation = function() {
    if (Infolog) {
      Infolog.startLengthyOperation()
    }
  }
  this.Str2Capital = function() {
    return strupr(substr(_str, 1, 1)) + strlwr(substr(_str, 2, 999999))
  }
  this.str2CapitalWord = function() {
    var n;
    _str = Str2Capital(_str);
    n = strscan(_str, ' ', 1, strlen(_str));
    return _str
  }
  this.str2con = function() {
    var length = strlen(_value);
    var i = 1;
    var j = strscan(_value, _sep, 1, length);
    var ret;
    var add2Ret = function() {
      if (match('<:d+>', _current)) {}
    };
    add2Ret(substr(_value, i, +1));
    return ret
  }
  this.str2cryptoblob = function() {
    var b = new Binary();
    if (_data) {
      b.wString(0, _data);
      return binary2cryptoblob(b, )
    }
  }
  this.Str2DateDMY = function() {
    return str2date(_str, 123)
  }
  this.str2HashKey = function() {
    var i, hash;
    var len = strlen(_str);
    for (i = 1;; i++) {
      hash = () + hash + char2num(_str, i)
    };
    return hash
  }
  this.Str2IntOk = function() {
    var retval;
    var permission;
    var re;
    permission = new InteropPermission(InteropKind.ClrInterop);
    permission.assert();
    re = new('^\\s*[+\\-]?\\s*[0-9]+\\s*$');
    retval = CLRInterop.getAnyTypeForObject(re.IsMatch(_str));
    return retval
  }
  this.str2NumOk = function() {
    var retval;
    var permission;
    var re;
    permission = new InteropPermission(InteropKind.ClrInterop);
    permission.assert();
    re = new('^\\s*[+\\-]?\\s*[0-9]+(\\.[0-9]+)?([+\\-]?[Ee][+\\-]?[1-9][0-9]*)?\\s*$');
    retval = CLRInterop.getAnyTypeForObject(re.IsMatch(_tempStr));
    return retval
  }
  this.str2recId = function() {
    return str2int64(_recidStr)
  }
  this.strEndsWith = function() {
    if () {
      return true
    };
    return false
  }
  this.strFmtLB = function() {
    var i = strscan(_str, '\\n', 1, strlen(_str));
    return _str
  }
  this.StringFromGuid = function() {
    return guid2str(_value)
  }
  this.StrLFix = function() {
    return substr(_str, 1, _length) + strrep(_char, )
  }
  this.StrLRTrim = function() {
    return strltrim(strrtrim(_str))
  }
  this.strMax = function() {
    var dt;
    var len;
    if (!prmisdefault(_id)) {
      dt = new DictType(TypeId2ExtendedTypeId(_id));
      if () {
        len = 1000
      }
    };
    return strrep(charMax(), len)
  }
  this.StrMin = function() {
    return ''
  }
  this.strRemoveCr = function() {
    return StrReplace(s, '\n', ' ')
  }
  this.StrReplace = function() {
    var charNum;
    var fromLength = strlen(_fromStr);
    var toLength = strlen(_toStr);
    if () {
      charNum = strscan(_str, _fromStr, 1, strlen(_str));
      if () {}
    };
    return _str
  }
  this.strReplaceChars = function() {
    return StrReplace(_str, _char, strrep(_char, _cnt))
  }
  this.strReverse = function() {
    var ret;
    var i;
    for (i = strlen(_str);;) {};
    return ret
  }
  this.StrRFix = function() {
    return strrep(_char, ) + substr(_str, 1, _length)
  }
  this.strSplit = function() {
    var list = new List(Types.String);
    var oldPos = 1;
    var pos;
    var strLength = strlen(_stringToSplit);
    return list
  }
  this.strStartsWith = function() {
    if () {
      return true
    };
    return false
  }
  this.SumDigits = function() {
    var charNum;
    var charMax;
    var SumDigits;
    var chars;
    chars = int2str(number);
    charMax = strlen(chars);
    charNum = 0;
    return SumDigits
  }
  this.symbol2Enum = function() {
    var de = new DictEnum(_id);
    return de.symbol2value(_symbol)
  }
  this.tableHasInstanceMethod = function() {
    var s;
    if () {
      return false
    };
    s = new SysMethodInfo(UtilElementType.tableInstanceMethod, dt.id(), methodname);
    return s && s.compiledOk()
  }
  this.tableHasMethod = function() {
    return SysDicttable.hasMethod(dt, methodname)
  }
  this.tableHasStaticMethod = function() {
    var s;
    if () {
      return false
    };
    s = new SysMethodInfo(UtilElementType.tableStaticMethod, dt.id(), methodname);
    return s && s.compiledOk()
  }
  this.tableId2Name = function() {
    var dicttable = new Dicttable(_TableId);
    if (dicttable) {
      return dicttable.name()
    };
    return ''
  }
  this.tableName2Id = function() {
    return new Dictionary().tableName2Id(_tablename)
  }
  this.Time2StrHM = function() {
    return num2str(2, 0, 0, 0) + ':' + Num2Str0(2, 0, 0, 0)
  }
  this.time2StrHMLeadingZero = function() {
    var hourStr;
    hourStr = num2str(2, 0, 0, 0);
    hourStr = StrReplace(hourStr, ' ', '0');
    return hourStr + ':' + Num2Str0(2, 0, 0, 0)
  }
  this.time2StrHMS = function() {
    return num2str(2, 0, 0, 0) + ':' + Num2Str0(2, 0, 0, 0) + ':' + Num2Str0(2, 0, 0, 0)
  }
  this.timeMax = function() {
    return DateTimeUtil.time(DateTimeUtil.maxvalue())
  }
  this.TypeId2EnumId = function() {
    if () {};
    return
  }
  this.TypeId2ExtendedTypeId = function() {
    if () {};
    return
  }
  this.typeId2Type = function() {
    return extendedTypeId2Type(TypeId2ExtendedTypeId(_id))
  }
  this.units2mm = function() {
    var convertedMeasurement;
    if (_measurement) {};
    return convertedMeasurement
  }
  this.unsignedInt2Real = function() {
    var rmaxInt = maxint();
    var rminInt = minint();
    var r = i;
    if (i < 0) {
      return
    };
    return i
  }
  this.useDomains = function() {
    return isConfigurationkeyEnabled(configurationkeynum(sysDomain))
  }
  this.utcDateTime2SystemDateTime = function() {
    return CLRInterop.getObjectForAnyType(_utcDateTime)
  }
  this.utcDateTimeNull = function() {
    return new Date("1900-01-01T00:00:00")
  }
  this.Warning = function() {
    return Infolog.add(Exception.Warning, getprefix() + txt, helpUrl, _sysInfoAction, false)
  }
  this.webFormHasMethod = function() {
    if () {
      return false
    };
    return SysformWebrun.hasMethod(fr, methodname)
  }
  this.webletPropertyManager = function() {
    var cache = Infolog.GlobalCache();
    var webletPropertyManager;
    if (cache.isSet(classstr(Global), funcname())) {
      return cache.get(classstr(Global), funcname())
    };
    webletPropertyManager = new webletPropertyManager();
    cache.set(classstr(Global), funcname(), webletPropertyManager);
    return webletPropertyManager
  }
  this.webReportHasMethod = function() {
    if () {
      return false
    };
    return TreeNode.findNode('\\Web\\Web reports\\' + rr.name() + '\\methods\\' + methodname) ? true : false
  }
  this.webSession = function() {
    var webSession;
    if (!xGlobal.hasClient()) {
      return null
    };
    if (company && ) {
      appl.setDefaultcompany(company)
    };
    webSession = webSessionClient(appname, initnew);
    return webSession
  }
  this.webSessionClient = function() {
    var mon;
    var webSession;
    if (!initnew) {
      webSession = Infolog.webSession();
      if (webSession) {
        return webSession
      }
    };
    if () {
      mon = new AxaptaCOMConnectorMonitor();
      if (mon.isAxaptaInternetConnector()) {
        webSession = new webSession(appname);
        Infolog.webSession(webSession)
      }
    };
    return webSession
  }
  this.webSessionClientRemove = function() {
    Infolog.webSession(null)
  }
  this.XMLGetTypeFromSpelling = function() {
    return Types.void
  }
  this.XMLString = function() {
    var r;
    var o;
    var record;
    var legalXMLString = function() {
      var i, len;
      var noProblem = ;
      var res;
      if (noProblem) {
        res = s
      };
      return res
    };
    var typetoString = function() {
      return 'unknown'
    };
    var containerxml = function() {
      var result;
      var i;
      var t;
      var contents;
      result = strrep(' ', _indent) + '<container>\n';
      for (i = 1;; i++) {
        t = typeof(conpeek(c, i));
        if () {
          contents = conpeek(c, i);
          if () {}
        }
      };
      return result
    };
    var blobxml = function() {
      var result;
      if () {
        return result
      }
    };
    r = strrep(' ', indent);
    return r
  }
  this.yearDiff = function() {
    var boundary;
    var offset;
    if (d1 < d2) {
      boundary = mkdate(dayofmth(d1), mthofyr(d1), year(d2));
      offset = () < 0 ? : 0
    };
    return
  }
  this._getNull = function() {
    return null;
  };
}