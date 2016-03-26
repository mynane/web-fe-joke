define(function(){
    /*
     * mgtfile
     */
    /*
     * mgt file upload
     */
    function log() {}

    function lab_mgtNotification(data) {
        data.title = data.message;
        alertTip.show(data);
    }

    function mgtuid() {
        var sResult = (typeof (currentUserId) == 'undefined') ? "kp" : currentUserId;
        var result = sResult + '.' + new Date().getTime();
        for (var i = 0; i < 32; i++) {
            result += Math.floor(Math.random() * 16).toString(16).toUpperCase();
        }
        return result;
    };

    function MgtFileuploadPageClass() {
        this.doms = [];
        this.getIframeName = function () {
            var n = "ifr" + mgtuid();
            var ifr = $("#" + n);
            var io = $('<iframe name="' + n + '" id="' + n + '" src="" />');
            io.css({
                position: 'absolute',
                top: '-1000px',
                left: '-1000px'
            });
            io.appendTo('body');

            return n;
        };
        this.submit = function () {
            this.showResult();
            var on = null,
                next = null;
            $.each(this.doms, function (k, v) {
                $.each(v, function (k1, v1) {
                    if (v1.ok == 1) {
                        on = v1;
                    }
                    if (v1.ok == 0 && !next) {
                        next = v1;
                    }
                });
            });
            if (!on && next) {
                next.submit();
            }
        };
        this.setResult = function (idoo, ok, size) {
            var on = null,
                g1 = null;
            $.each(this.doms, function (k, v) {
                $.each(v, function (k1, v1) {
                    if (v1.idoo == idoo) {
                        on = v1;
                    }
                    if (v1.ok == 1) {
                        g1 = v1; //缺点：如何页面有2个文件上传，就可以错位了。
                    }
                });
            });
            if (idoo && idoo != null && idoo != '') {
                if (on) {
                    on.finish(size, ok);
                    this.submit();
                } else if (g1) {
                    g1.finish(size, ok);
                    this.submit();
                }
            }
        };
        this.showResult = function () {
            var r = "";
            $.each(this.doms, function (k, v) {
                $.each(v, function (k1, v1) {
                    r += "idoo:" + v1.idoo;
                    r += "ok:" + v1.ok + "<br/>";
                });
            });
            $("#log").html(r);
        };
        this.getFileName = function (o) {
            var pos = o.lastIndexOf("\\");
            return o.substring(pos + 1);
        };
        this.showSize = function (size) {
            var mb = 1024 * 1024;
            var kb = 1024;
            var temp2;
            if (size >= mb) {
                temp2 = (size / mb) + "";
                if (temp2.indexOf(".") > 0) {
                    temp2 = temp2.substring(0, (temp2.indexOf(".") + 3));
                }
                return temp2 + " MB";
            } else if (size >= kb) {
                temp2 = (size / kb) + "";
                if (temp2.indexOf(".") > 0) {
                    temp2 = temp2.substring(0, (temp2.indexOf(".") + 3));
                }
                return temp2 + " KB";
            } else {
                return size + " B";
            }
        };
    };
    window.mgtFileuploadPage = new MgtFileuploadPageClass(); //

    (function ($) {
        $.fn.mgtfileupload = function (o) {
            var self = this;
            var options = {
                maxFile: 300,
                num: 2000,
                result: false,
                suffix: [],
                showname: '上传附件',
                msg: '请选择正确的图片格式',
                test: false,
                conclude: false,
                selectSystem: false
            };
            var fileUpload_condition = {
                curpage: 1,
                startCount: 0,
                pageMax: 8,
                key: ""
            };
            var tempCurrStart = [];
            var original = $.extend({}, fileUpload_condition); //保存condition的原始状态
            var boxpost = globalCp + "/mgtfileupload/mgtfileuploadfileList.do";
            var formType = 1;

            $.extend(options, o);
            //取附件
            if (options.result) {
                return getFiles();
            }

            // 判断是否存在有效附件
            if (options.conclude) {
                var files = getFiles();
                var flag = false;
                for (index in files) {
                    if (files[index].deleted == 'false' || files[index].deleted == false) {
                        flag = true;
                        break;
                    }
                }
                return flag;
            }
            //是否有即将或者正在上传的文件
            var hasOngoing = function () {
                var arr = self.data("data");
                var r = false;
                $.each(arr, function (k, v) {
                    if (v.ok == 0 || v.ok == 1) { //some file wait to transfer
                        r = true;
                    }
                });
                return r;
            };
            var config = function (o) {
                fileUpload_condition.curpage = o.hasOwnProperty('curpage') ? o.curpage : fileUpload_condition.curpage;
                fileUpload_condition.startCount = o.hasOwnProperty('startCount') ? o.startCount : fileUpload_condition.startCount;
                fileUpload_condition.pageMax = o.hasOwnProperty('pageMax') ? o.pageMax : fileUpload_condition.pageMax;
                fileUpload_condition.key = o.hasOwnProperty('key') ? o.key : fileUpload_condition.key;
            };
            var reset = function () { //还原为初始状态
                config(original);
            };
            if (options.ready) {
                if (hasOngoing()) {
                    if (options.func) {
                        self.data("func", options.func); // register callback
                    }
                    return false;
                }
                return true;
            }

            var maxNum = options.num,
                mgtData = [],
                limitsizename = [],
                mgtSelectDate = [];

            mgtFileuploadPage.doms.push(mgtData);
            self.data("data", mgtData);
            self.empty();

            //是否已经有待选择文件的file选择框了
            var hasAttachButton = function () {
                var r = false;
                $.each(mgtData, function (k1, v1) {
                    if (v1.ok == -1) {
                        r = true;
                    }
                });
                return r;
            };
            var deleteAttachButton = function () {
                    var tempMgtData = [];
                    $.each(mgtData, function (k1, v1) {
                        if (v1.ok == -1) {
                            v1.deleted = true;
                            v1.ok = 4;
                        }
                    });
                }
                //是否有重名文件
            var hasDuplicateAttach = function (fullname) {
                var r = false;
                $.each(mgtData, function (k1, v1) {
                    if ((v1.fullname == fullname) && v1.ok != 4) {
                        for (var i = 0; i < limitsizename.length; i++) {
                            if ((limitsizename[i] == fullname) || (fullname.lastIndexOf(limitsizename[i]) >= 0)) {
                                r = false;
                                return r;
                            } else {
                                r = true;
                            }
                        }
                        if (limitsizename.length == 0) {
                            r = true;
                        }
                    }
                });
                return r;
            };
            // 初始化上传组件
            var domId = self.attr('id');

            var attListDomId = "att_list_" + domId;
            var ul = $('<ul />');
            ul.attr('id', attListDomId);
            ul.addClass('att_cont unstyled');
            self.append(ul);

            $.extend(options, {
                showname: i18n.commonUploadFile,
                attached: domId,
                maxFile: options.fileSize
            });

            if (options.fileSize > 0) {
                var toolbar = $('<div class="oper clearfix" />');
                toolbar.attr('id', 'editor_attachtoolbar_' + domId);
                //attach            
                var attachContainer = $('<div class="add_att" />');
                attachContainer.attr('id', 'editor_attach_' + domId);
                attachContainer.css('font-family', 'Verdana');

                toolbar.append(attachContainer);
                self.append(toolbar);
            } else {
                var tipDiv = $('<div />');
                var tipSpan = $('<span />');
                tipSpan.html(i18n.noFreeSpace); // msg: 您的企业空间容量已经不足，需要先购买空间
                tipDiv.append(tipSpan);
                if (!options.fromClient) {
                    var goBuyA = $('<a />');
                    goBuyA.html(i18n.purchaseNow);
                    goBuyA.attr("href", "#");
                    goBuyA.click(function () {
                        top.location = "/#payment";
                    });
                    tipDiv.append(goBuyA);
                }
                self.append(tipDiv);
            }

            function getFiles() {
                var arr = self.data("data");
                var result = [],
                    file;
                $.each(arr, function (key, item) {
                    if (item.ok == 2 || item.id > 0 || options.test) {
                        file = {};
                        file.id = item.id;
                        file.deleted = item.deleted;
                        file.localPath = item.idoo;
                        file.fileName = item.fileName;
                        file.size = item.size;
                        if (options.test)
                            file.ok = item.ok;
                        result.push(file);
                    }
                });
                return result.reverse();
            }

            function createFile() {
                return {
                    id: 0, //针对已经存在的附件
                    deleted: false,
                    idoo: mgtuid(),
                    formType: 0, //1系统文档2 企业文档
                    pb: null, //progress bar
                    hasSize: false,
                    maxFile: options.maxFile * 1024 * 1024, //允许的文件最大大小
                    ok: -1, //-1: no file seelcted,0:a file is selected,1:uploading, 2: success;3:error;4:deleted
                    containerDiv: null, //最外层div
                    form: null,
                    fileName: null,
                    fullname: '',
                    showDiv: null,
                    formDiv: null,
                    submit: function () {
                        this.ok = 1;
                        this.showDiv.find("span[class=\"status\"]").text("");
                        this.pb.show();
                        this.form.submit();
                        this.pbFunc();
                    },
                    pbFunc: null, //callback when submit

                    finish: function (size, ok) {
                        this.size = size;
                        if (this.ok != 1) { // ajax has dealed
                            return;
                        }
                        if (size == 0) { //error occured
                            this.ok = 3;
                            //msg: 文件内容不能为空
                            this.clear(i18n.fileNotEmpty);
                        } else if (ok && this.setSize(size)) { //上传完成
                            this.ok = 2;
                            this.clear();
                        } else if (ok) {
                            this.ok = 3;
                            this.clear("文件太大"); //msg: 文件太大
                        } else {
                            this.ok = 3;
                            this.clear(i18n.fileUploadFail); // msg: 文件上传失败                     
                        }
                        if (this.ok == 2) {
                            this.showDiv.find("span[class=\"attsize muted\"]").text("(" + mgtFileuploadPage.showSize(size) + ")"); //处理文件实际有大小展示进度条，但字节数显示0 
                            if (!hasOngoing()) {
                                var f = self.data("func"); // get callback
                                if (f) {
                                    f();
                                }
                            }
                        } else {
                            self.removeData("func"); // remove callback
                        }
                    },
                    setSize: function (size) { //true:设置成功
                        this.size = size;
                        if (this.hasSize)
                            return true;

                        this.hasSize = true;
                        this.showDiv.find("span[class=\"attsize muted\"]").text("(" + mgtFileuploadPage.showSize(size) + ")");

                        if (size > this.maxFile) {
                            lab_mgtNotification({
                                message: "<i class='commpic-warn'></i>" + i18n.fileMaxSize + options.maxFile + "M",
                                type: 'error',
                                position: "top-center",
                                closable: false
                            });
                            $(".tooltip").hide();
                            this.deleteme();
                            limitsizename.push(this.fileName);
                            return;
                        }
                        return true;
                    },
                    clear: function (msg) {
                        this.formDiv.remove();
                        if (msg && msg.length > 0) {
                            this.showDiv.find("span[class=\"status\"]").css({
                                "color": "red"
                            }).text(msg);
                            this.showDiv.find("span[class=\"attsize muted\"]").text(""); //post请求先执行：文件内容为空，get请求请求头信息的字节大小B就无法清空
                        } else {
                            this.showDiv.find("span[class=\"status\"]").text("");
                        }
                        this.showDiv.find("div[class=\"bar\"]").parent().remove();
                    },
                    replaceme: function () {
                        this.deleteme();
                        if (this.formType == 1) {
                            _searchFileFromSystem(boxpost);
                        }
                    },
                    deleteme: function () {
                        this.deleted = true;
                        log(" in deleteme func , this.ok:" + this.ok + ", options.attached: " + options.attached);
                        this.ok = 4;
                        if (options.attached) {
                            if (this.formDiv) {
                                log("in 009 " + this.formDiv.find("form").length)
                                var f = this.formDiv.find("form");
                                f.attr("action", globalCp + "/mgtfileupload/status.do?X-Progress-ID=abort");
                                f.attr("method", "get");
                                f.submit();
                                this.formDiv.remove();
                            }
                            $(this.showDiv[0].parentNode).remove();
                        } else {
                            this.containerDiv.remove();
                        }
                        maxNum = maxNum + 1;
                        createNew();
                    }
                };
            }

            function createShowDiv() {
                var showDiv;
                if (!options.attached) {
                    showDiv = $("<div style=\"display:none\"></div>");
                    showDiv.html("<span class=\"name\" style=\"color:#333;\"></span><span style=\"margin:0 0 0 10px;color:#999;\" class=\"attsize muted\"></span><span style=\"margin:0 10px 0 10px;\" class=\"status\">正在等待</span>" +
                        "<a href='javascript:void(0)' class=\"mgtfile-delete\" style=\"color:#06c\">删除</a><div style=\"display:none;width:100px;height:11px;margin-top:2px;padding:0;\" class=\"progress\"><div class=\"bar\" style=\"width: 0%;\"></div></div>");
                } else {
                    var attListDomId = "att_list_" + options.attached;
                    var attsContainer = $("#" + attListDomId);
                    if (!attsContainer) {
                        attsContainer = $('<ul class="att_cont" />');
                        attsContainer.attr('id', attListDomId);
                    }

                    showDiv = $('<div style="display:none;" />');
                    showDiv.append("<span class=\"name\" style=\"color:#333;\"></span><span style=\"margin:0 0 0 10px;color:#999;\" class=\"attsize muted\"></span><span style=\"margin:0 10px 0 10px;\" class=\"status\">正在等待</span>" +
                        "<a href='javascript:void(0)' class=\"mgtfile-delete\" style=\"color:#06c\">删除</a>&nbsp;&nbsp;<span style=\"color:red;display:none;padding-left:5px;\"  class=\"mgt_attFileMark\" >" + i18n.fileLoseEfficacyNs + "<span class=\"mgt_attReSeect\" >" + i18n.fileReSelect + "</span></span><div style=\"display:none;width:100px;height:11px;margin-top:2px;padding:0;\" class=\"progress\"><div class=\"bar\" style=\"width: 0%;\"></div></div>");
                    var li = $('<li style="display:none;" />');
                    li.append(showDiv);
                    attsContainer.append(li);
                }
                return showDiv;
            }
            //add
            function initDefualFiles(aFile) {
                if (aFile == null) {
                    return;
                }
                var fileListTable = $("#fileUploudFileListTable");
                tempCurrStart[aFile.currPage] = aFile.start;
                fileUpload_condition = {
                    curpage: aFile.currPage,
                    startCount: aFile.start,
                    pageMax: 8,
                    key: aFile.key
                };
                var items = aFile.items;
                fileListTable.html("");
                if (items.length > 0) {
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        fileListTable.append(_createFileItem(item));
                    }
                } else {
                    var fileListTableTr = $("<tr></tr>");
                    if (aFile.key == '') {
                        fileListTableTr.append($("<td class='w-auto w-ws100'>" + i18n.fileNoResult + "</td>"));
                    } else {
                        fileListTableTr.append($("<td class='w-auto w-ws100'>" + i18n.fileNoResultStart + fileNameEscape(aFile.key) + i18n.fileNoResultEnd + "</td>"));
                    }
                    fileListTable.append(fileListTableTr);
                }
                _createPageing(aFile);
                $("#btn_fileuploud_ok_add").unbind().bind("click", function () {
                    var str = mgtSelectDate.toString();
                    var temlist = new Array();
                    for (i = 0; i < items.length; i++) { //有bug
                        if (str.indexOf(items[i].url) > -1) {
                            temlist.push(items[i]);
                        }
                    }
                    _checkFilesFormat(temlist);
                });
            };

            function _closeFileSelectBox() {
                $('#mgtAjaxWarnId').modal('hide').remove();
            };

            function _createFileItem(aFileItem) {
                var fileListTableTr = $("<tr></tr>");
                fileListTableTr.append($("<td><input type=\"checkbox\" class=\"att-upload-ck\" value=\"" + aFileItem.url + " \" name=\"selectFile_Url\" ></td>"));
                fileListTableTr.append($("<td><span class=\"att-upload-file att_upload_" + aFileItem.icon + "\"></span></td>"));
                fileListTableTr.append($("<td class=\"w-auto\"><a href=\"" + globalCp + aFileItem.downUrl + "\" class=\"att-upload-a\" target=\"_blank\">" + fileNameEscape(aFileItem.fileName) + "</a></td>"));
                fileListTableTr.find("input[name=\"selectFile_Url\"]").on("change", function () {
                    _getSelectDate();
                });
                return fileListTableTr;
            };

            function _getSelectDate() {
                mgtSelectDate = [];
                $("input[name='selectFile_Url']:checkbox").each(function () {
                    if ($(this).attr("checked")) {
                        mgtSelectDate.push($(this).val());
                    }
                });
                $(".att-upload-3").html(mgtSelectDate.length);
            };

            function _createPageing(aFile) {
                var fileupload_preBtn = $("#fileUpload_prePageButton").addClass("att-upload-9").unbind();
                var fileupload_nxtBtn = $("#fileUpload_nextPageButton").addClass("att-upload-9").unbind();
                if (aFile.hasNextPage == true) {
                    fileupload_nxtBtn.removeClass("att-upload-9");
                    fileupload_nxtBtn.bind("click", function () {
                        fileUpload_condition.curpage = fileUpload_condition.curpage + 1;
                        _fileSearch(fileUpload_condition);
                    });
                }
                if (aFile.currPage > 1) {
                    fileupload_preBtn.removeClass("att-upload-9");
                    fileupload_preBtn.bind("click", function () {
                        if (fileUpload_condition.curpage > 1) {
                            fileUpload_condition.curpage = fileUpload_condition.curpage - 1;
                            fileUpload_condition.startCount = 0;
                        } else {
                            fileUpload_condition.curpage = 0;
                        }
                        _fileSearch(fileUpload_condition);
                    });
                }
            };

            function _SearchFile() {
                reset();
                tempCurrStart = [];
                config({
                    key: $("#fileupload_searchname_text").val()
                });
                _fileSearch(fileUpload_condition);
            };

            function _fileSearch(condition) {
                condition.startCount = tempCurrStart[condition.curpage - 1] || 0;
                $.post(globalCp + "/mgtfileupload/mgtfileuploadfilesearch.do", condition, function (data) {
                    initDefualFiles(data);
                    _getSelectDate();
                })
            };
            var _checkFilesFormat = function (files) {
                var fileName = "";
                var errorType = 0;
                var failList = [];
                if (files == null || files.length < 1) {
                    lab_mgtNotification({
                        message: "<i class='mpic-notify-error'></i>" + i18n.fileNoSelectd,
                        type: 'error',
                        position: "top-center",
                        closable: false
                    });
                    return;
                } else {
                    //判断是否可以添加
                    if (maxNum - files.length < -1) {
                        lab_mgtNotification({
                            message: "<i class='mpic-notify-error'></i>" + i18n.fileOverLimitNum,
                            type: 'error',
                            position: "top-center",
                            closable: false
                        });
                        return;
                    }
                    $('.att-modalClose').mouseup();
                    if ($('#editor_attach_' + options.attached)) {
                        $('#editor_attach_' + options.attached).html("");
                        deleteAttachButton();
                        maxNum++;
                    }
                    for (var i = 0; i < files.length; i++) {
                        var errorType = _checkFileItemFormat(files[i]);
                        if (errorType == 0) {
                            var aFile = createFile(),
                                file = files[i];
                            aFile.formType = formType
                            aFile.id = -1;
                            aFile.idoo = file.url;
                            aFile.deleted = false;
                            aFile.fileName = file.fileName;
                            aFile.size = file.filesize;
                            aFile.ok = 2;
                            mgtData.push(aFile);
                            aFile.showDiv = createShowDiv();
                            showFileName(aFile, true);
                            aFile.showDiv.find("span[class=\"status\"]").text("");
                            aFile.showDiv.find("span[class=\"attsize muted\"]").text("(" + mgtFileuploadPage.showSize(aFile.size) + ")");
                            maxNum--;
                        }
                    }
                    createNew();
                }
            };
            var _checkFileItemFormat = function (file) {
                var format = false,
                    fright = false;
                var fname = file.fileName;
                var f1 = fname.split(".");
                var fsuffix = f1[f1.length - 1];
                if (options.suffix.length > 0) {
                    $.each(options.suffix, function (k1, v1) {
                        if (fsuffix.toLowerCase() == v1.toLowerCase()) {
                            fright = true;
                        }
                    });
                    if (!fright) {
                        return 3; //不支持类型
                    }
                }
                if (f1[0].length > 216) {
                    return 1; //文件名超过最大限度
                } else if (hasDuplicateAttachNew(file)) {
                    return 2; //有同名文件
                } else {
                    return 0 //可以添加
                }

            };

            //是否有重名文件
            var hasDuplicateAttachNew = function (item) {
                var r = false;
                $.each(mgtData, function (k1, v1) {
                    if ((v1.idoo == item.url) && v1.ok != 4) {
                        r = true;
                    }
                });
                return r;
            };

            function _showSelectWay(url, item) {
                var _selectWayUL = $('<ul id="att-upload-dropdown-div" class="att-upload-dropdown" style="display:block"></ul>');
                var _wayFormSystem = $('<li id="mgtFileButtonSystem"><span class="">' + i18n.fileSelectFormSystem + '</span></li>');
                var _wayFormCent = $('<li><span>' + i18n.fileSelectFormCent + '</span></li>');
                _selectWayUL.append(_wayFormSystem);
                //_selectWayUL.append(_wayFormCent);
                _wayFormSystem.on("click", function () {
                    _searchFileFromSystem(url)
                });
                $(document.body).append(_selectWayUL);
                _selectWayUL.css({
                    display: 'block',
                    position: 'absolute',
                    zIndex: beginIndex ? beginIndex : 10000
                });
                place(item, _selectWayUL);

                $(window).scroll(function () {
                    place(item, _selectWayUL);
                });
                $(window).resize(function () {
                    place(item, _selectWayUL);
                });
                $(document).bind("mousedown", function (e) {
                    var target = $(e.target);
                    if (target.closest("#att-upload-triangle-button").length == 0 && target.closest("#att-upload-dropdown-div").length == 0) {
                        destroy();
                    }
                });

            }
            var _searchFileFromSystem = function (url) {
                destroy();
                mgtSelectDate = []
                reset();
                $.post(url + "?t=" + new Date().getTime(), fileUpload_condition, function (html) {
                    $(document.body).append(html);
                    var fileupload_defual_Data = $("#fileupload_defual_Data").val();
                    initDefualFiles($.parseJSON(fileupload_defual_Data));
                    $("#fileupload_defual_Data").remove();
                    $("#att-upload-modal-title").text(i18n.fileFormSystem);
                    $("#fileupload_searchname_btn").on("click", _SearchFile);
                    lab_modal($("#uploudSeachFileModal"), {
                        backdrop: "static"
                    });
                });
            }

            function place(item, showdev) {
                var offset = item.offset();
                var y = 0;
                var window_height = $(window).height();
                var fixed_offset = item[0].getBoundingClientRect();
                var absolute_offset = item.offset();
                var pop_height = showdev[0].offsetHeight;
                if (window_height - fixed_offset.bottom <= pop_height) {
                    y = absolute_offset.top + item[0].offsetHeight - pop_height - 20
                } else {
                    y = absolute_offset.top + item[0].offsetHeight;
                }
                showdev.offset({
                    top: y,
                    left: offset.left + 75
                });
            }
            var fileNameEscape = function (val) {
                return val.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/  /g, ' &nbsp;');
            }

            function destroy() {
                $('.att-upload-dropdown').remove();
                $(document).unbind('mousedown');
            }
            //add end
            function showFileName(aFile, isSystem) {
                aFile.showDiv.show();
                aFile.showDiv.parent().show();

                aFile.formDiv && aFile.formDiv.hide();

                aFile.showDiv.find("a[class=\"mgtfile-delete\"]").bind("click", function () {
                    log(" in aFile.deleteme ");
                    var k = aFile.ok;
                    aFile.deleteme();
                    if (k == 1) {
                        mgtFileuploadPage.submit();
                    }
                });
                if (isSystem) {
                    aFile.showDiv.find("span[class=\"mgt_attReSeect\"]").wrap("<a></a>").css({
                        "color": "blue",
                        "cursor": "pointer"
                    }).bind("click", function () {
                        aFile.replaceme();
                    });
                    aFile.showDiv.find("span[class=\"mgt_attFileMark\"]").addClass("mgt_attFileMark_" + aFile.idoo).css({
                        "display": "none"
                    });
                }
                var showfileLength = 18,
                    s = aFile.showDiv.find("span[class=\"name\"]");

                if (aFile.fileName.length <= showfileLength) {
                    s.text(aFile.fileName);
                } else {
                    s.text(aFile.fileName.substring(0, showfileLength - 3) + "...");
                    s.attr("title", aFile.fileName);
                }
            }

            var createNew = function () {
                if (/(iPhone|iPad|iPod)/i.test(navigator.userAgent)) {
                    return;
                };
                //如果已经有了afile对象或者可以上传的数量为0，则返回
                if (hasAttachButton() || maxNum <= 0) {
                    return;
                }
                //可用数量-1
                maxNum = maxNum - 1;

                var aFile = createFile();
                mgtData.push(aFile);

                var pb;

                //展示附件区域
                var showDiv = createShowDiv();
                aFile.showDiv = showDiv;

                var furlpost = globalCp + "/mgtfileupload/post.do?idoo=" + aFile.idoo + "&X-Progress-ID=" + aFile.idoo;
                var furlstatus = globalCp + "/mgtfileupload/status.do?X-Progress-ID=" + aFile.idoo;

                var uploadDiv = $("<div><form action=\"" + furlpost + "\" method=\"post\" style=\"margin:0;padding:0;\" enctype=\"multipart/form-data\" ></form></div>");
                var form = uploadDiv.find("form");

                var attachDiv = $('#editor_attach_' + domId);
                if (!options.attached) {
                    var containerDiv = $("<li style=\"list-style:none;\"></li>");
                    containerDiv.append(showDiv).append($("<div class=\"cb\"></div>")).append(uploadDiv);
                    attachDiv.append(containerDiv);
                    aFile.containerDiv = containerDiv;
                } else {
                    attachDiv.append(uploadDiv);
                }
                aFile.formDiv = uploadDiv;
                aFile.form = form;
                var formInner = $('<div style="width: 70px; height: 20px; overflow:hidden;float:left;" class="upatt vertical-middle"></div>');
                var title = i18n.fileMaxSize + options.maxFile + "MB"; //msg: 单个文件上传大小不能超过？MB
                //formInner.tooltip({title: title, trigger:"hover", placement:"right"});
                formInner.bind("mouseover", function () {
                    if ($(".att-upload-dropdown").length > 0) {
                        destroy();
                    }
                });
                formInner.append($('<i class="icon-link mid-icon"></i>'));

                var outerSpan = $('<span style="position:relative;display:inline-block;color:#0066cc;" class="mid-text"></span>');
                var innerSpan = $('<span></span>');
                innerSpan.css({
                    'position': 'absolute',
                    'top': '0px',
                    'left': '0px',
                    'cursor': 'pointer',
                    'width': '50px',
                    'height': '15px',
                    'overflow': 'hidden',
                    'opacity': '0',
                    'z-index': '1',
                    'background-color': 'rgb(255, 255,255)'
                });

                var bottomAnchor = $('<a href="javascript:;" onclick="return false;" onmousedown="return false;" style="font-family:Verdana;color:#0066cc;">' + options.showname + '</a>');
                var input = $('<input type="file" id="mgtfile" name="file" tabindex="-1"/>');
                var ua = navigator.userAgent.toLowerCase();
                var ie11 = ua.indexOf("trident") > 0;
                input.css({
                    'width': '200px',
                    'height': '200px',
                    'font-family': 'Times',
                    'position': 'absolute',
                    'font-size': '50px',
                    'right': (ie11 || $.browser.msie || $.browser.webkit || ($.browser.mozilla && $.browser.version > 21.0)) ? '0px' : '426px',
                    'cursor': 'pointer'
                });
                $(input).on("click", function () {
                    $(".tooltip").hide();
                });

                if ($.browser.msie) {
                    innerSpan.css({
                        'filter': 'alpha(opacity=0)',
                        'zoom': '1'
                    });
                }
                innerSpan.hover(function () {
                    bottomAnchor.css({
                        'text-decoration': 'underline'
                    });
                }, function () {
                    bottomAnchor.css({
                        'text-decoration': 'none'
                    });
                });
                // 如果公司有存储容量才能上传
                if (options.maxFile > 0) {
                    innerSpan.append(input);
                }
                outerSpan.append(innerSpan);
                outerSpan.append(bottomAnchor);
                formInner.append(outerSpan);
                form.append(formInner);

                if (options.selectSystem) {
                    $.post(globalCp + '/common/getForbiddenModules.do', function (data) { //判断文档模块是否关闭
                        if (data.indexOf('105') == -1) {
                            var moreWayuploud = $('<span class="att-upload-style"></span>');
                            var _spiltline = $('<span class="att-upload-line">|</span>');
                            $('#' + domId).css({
                                display: 'block'
                            });
                            var _selectWayBtn = $('<a href="javascript:void(0);" id="att-upload-triangle-button"><i class="att-upload-triangle"></i></a>');
                            _selectWayBtn.on("click", function () {
                                if ($('.att-upload-dropdown').length > 0) {
                                    destroy();
                                    return;
                                } else {
                                    _showSelectWay(boxpost, $('#' + domId));
                                }
                            });
                            moreWayuploud.append(_spiltline);
                            moreWayuploud.append(_selectWayBtn);
                            form.append(moreWayuploud);
                        }
                    });
                }

                var statusNum = 0;
                aFile.pbFunc = function () {
                    statusNum = statusNum + 1;
                    if (statusNum > 7200)
                        return;

                    $.ajax({
                        dataType: "json",
                        url: furlstatus + '&t=' + statusNum,
                        global: false,
                        success: function (data) {
                            if (aFile.ok != 1) return;
                            if (data.state == "error") return;

                            var again = false;
                            log("data.received: " + data.received + ",data.size: " + data.size);
                            if (data.received && data.received > 0) {

                                var cent = 0;
                                if (data.size > 0)
                                    cent = 100 * data.received / data.size;
                                pb.width(cent + "%");
                                if (aFile.setSize(data.size)) {
                                    if (cent < 100) {
                                        again = true;
                                    }
                                } else {
                                    aFile.ok = 3;
                                    aFile.clear("文件太长了");
                                }
                            } else {
                                again = true;
                            }
                            log("again:" + again);
                            if (again) {
                                setTimeout(aFile.pbFunc, 2000);
                            }
                        }
                    });
                };

                function emptyFile(form) { //alert("zhixing"); 
                    //$('#mgtfile').replaceWith($('#mgtfile').clone(true));
                    form[0].reset();
                }
                var fileupload = function () {
                        var me = $(this);
                        if (me.data("hasactive"))
                            return;
                        me.data("hasactive", "true");

                        var format = false,
                            fright = false;
                        var fname = mgtFileuploadPage.getFileName($(this).val());
                        var f1 = fname.split(".");
                        var fsuffix = f1[f1.length - 1];

                        if (options.suffix.length > 0) {
                            $.each(options.suffix, function (k1, v1) {
                                if (fsuffix.toLowerCase() == v1.toLowerCase()) {
                                    fright = true;
                                }
                            });
                            if (!fright) {
                                lab_mgtNotification({
                                    message: "<i class='commpic-warn'></i>" + options.msg + "！",
                                    type: 'error',
                                    position: "top-center",
                                    closable: false
                                });
                                format = true;
                            }
                        }
                        form[0].target = mgtFileuploadPage.getIframeName();
                        if (f1[0].length > 216) {
                            lab_mgtNotification({
                                message: "<i class='commpic-warn'></i>" + i18n.fileMaxLength, //文件名长度不能超过216字！
                                type: 'error',
                                position: "top-center",
                                closable: false
                            });
                            aFile.deleteme();
                            $(".tooltip").hide();
                            createNew();
                        } else if (hasDuplicateAttach($(this).val())) {
                            lab_mgtNotification({
                                message: "<i class='commpic-warn'></i>" + i18n.fileExist,
                                type: 'error',
                                position: "top-center",
                                closable: false
                            });
                            $(".tooltip").hide();
                            aFile.deleteme();
                            createNew();
                        } else {
                            aFile.ok = 0;
                            aFile.fileName = mgtFileuploadPage.getFileName($(this).val());
                            aFile.fullname = $(this).val();
                            showFileName(aFile);
                            pb = aFile.showDiv.find(".bar");
                            pb.parent().toggle();
                            pb.width("1%");
                            aFile.pb = pb;

                            if (!format) {
                                log("00 1");
                                mgtFileuploadPage.submit();
                            } else {
                                log("00 2");
                                aFile.deleteme();
                            }
                            log("00 3");
                            createNew();
                        }
                    }
                    // 如果企业空间容量大于零，才可以上传文件
                if ($.browser.msie) { //IE浏览器
                    log("in msie ");
                    input.bind("input", fileupload);
                    input.bind("change", fileupload);
                    input.live("change", fileupload);
                } else { //ff浏览器
                    log("in not msie ");
                    input.bind("change", fileupload);
                }
            };

            //取出已经存在的附件
            var domId = options.attached;
            if (domId) {
                var files = document['attachs_' + domId];
                if (files) {
                    for (var i = 0; i < files.length; i++) {
                        var aFile = createFile(),
                            file = files[i];
                        aFile.id = file.id;
                        aFile.idoo = file.localPath ? file.localPath : aFile.idoo;
                        aFile.deleted = file.deleted;
                        aFile.fileName = file.fileName;
                        aFile.size = file.size;
                        aFile.ok = 2;

                        mgtData.push(aFile);
                        aFile.showDiv = createShowDiv();
                        showFileName(aFile);
                        aFile.showDiv.find("span[class=\"status\"]").text("");
                        aFile.showDiv.find("span[class=\"attsize muted\"]").text("(" + mgtFileuploadPage.showSize(aFile.size) + ")");

                        maxNum--;
                    }
                }
            }
            createNew();
        };
    })(jQuery);;
    (function ($) {
        //将字节数转化工具
        var byteUtil = function (size) {
            var mb = 1024 * 1024;
            var kb = 1024;
            var temp2;
            if (size >= mb) {
                temp2 = (size / mb) + "";
                if (temp2.indexOf(".") > 0) {
                    temp2 = temp2.substring(0, (temp2.indexOf(".") + 3));
                }
                return temp2 + " MB";
            } else if (size >= kb) {
                temp2 = (size / kb) + "";
                if (temp2.indexOf(".") > 0) {
                    temp2 = temp2.substring(0, (temp2.indexOf(".") + 3));
                }
                return temp2 + " KB";
            } else {
                return size + " B";
            }
        };

        var oldupload = $.fn.mgtfileupload;

        function addUploadFile(item) {
            var self = $(this);
            var result = $(this).data("data");
            //之前已选中文件
            var temp1 = [];
            $.each(result, function (key, value) {
                temp1.push(value.idoo);
            });
            var file = {};
            //之前未选中 去重
            if ($.inArray(item.localPath, temp1) == -1) {
                file.id = -1;
                file.deleted = item.deleted || false;
                file.idoo = item.localPath;
                file.fileName = item.name;
                file.size = item.spaceSize;
                file.ok = 2;
                result.push(file);

                $(this).find(".att_cont").append($("<li></li>", {
                    append: $("<div></div>", {
                        append: [
                            $("<span></span>", {
                                "class": "name",
                                title: file.fileName,
                                css: {
                                    color: "#333"
                                },
                                text: file.fileName.length > 18 ? file.fileName.substring(0, 15) + "..." : file.fileName
                            }),
                            $("<span></span>", {
                                "class": "attsize muted",
                                text: "(" + byteUtil(file.size) + ")",
                                css: {
                                    margin: "0 0 0 10px",
                                    color: "#999"
                                }
                            }),
                            $("<span></span>", {
                                "class": "status",
                                css: {
                                    margin: "0 10px 0 10px"
                                }
                            }),
                            $("<a></a>", {
                                "class": "mgtfile-delete",
                                href: "javascript:void(0)",
                                text: "删除",
                                css: {
                                    color: "#06c"
                                },
                                data: result.idoo,
                                click: function () {
                                    for (var i = 0, len = result.length; i < len; i++) {
                                        if (result[i].idoo == file.idoo) {
                                            result.splice(i, 1);
                                            //删除之前选择文件
                                            fromDisk.dataContainer.splice(i, 1);
                                            break;
                                        }
                                    }
                                    try {
                                        $(this).parent().parent().remove();
                                    } catch (e) {}
                                }
                            }),
                            "&nbsp;&nbsp;",
                            $("<span></span>", {
                                "class": "mgt_attFileMark mgt_attFileMark_" + item.localPath,
                                css: {
                                    color: "red",
                                    display: "none"
                                },
                                text: i18n.fileLoseEfficacyNs,
                                append: [
                                    $("<a></a>", {
                                        append: [
                                            $("<span></span>", {
                                                "class": "mgt_attReSeect mgt_attFileMark_" + item.localPath,
                                                css: {
                                                    color: "blue",
                                                    cursor: "pointer"
                                                },
                                                text: i18n.fileReSelect,
                                                click: function () {
                                                    for (var i = 0, len = result.length; i < len; i++) {
                                                        if (result[i].idoo == file.idoo) {
                                                            result.splice(i, 1);
                                                            //删除之前选择文件
                                                            fromDisk.dataContainer.splice(i, 1);
                                                            break;
                                                        }
                                                    }
                                                    try {
                                                        $(this).parent().parent().parent().find('a').eq(0).click();
                                                    } catch (e) {}
                                                    uploadFromNetDrive(self);
                                                }
                                            })
                                        ]
                                    })
                                ]
                            })

                        ]
                    })
                }));
                //显示文件
            }
        }

        function uploadFromNetDrive(elem) {
            var globalcdCp = '/webcd';
            loadCSS(globalcdCp + "/disk/static/css/fromDisk.css?v=" + cssVersion);
            loadCSS(globalCp + "/static/v2/zTree/zTreeStyle/zTreeStyle.css?v=" + cssVersion);
            $LAB.script(globalcdCp + "/disk/static/js/selectFromDisk.js?v=" + cssVersion)
                .script(globalCp + "/static/v2/zTree/js/jquery.ztree.core-3.5.min.js?v=" + cssVersion).wait()
                .script(globalCp + "/static/v2/zTree/js/jquery.ztree.excheck-3.5.min.js?v=" + cssVersion)
                .wait(function () {
                    $.post(globalcdCp + '/fromDisk/diskList.do', {
                        isSave: false,
                        isFalg: false
                    }, function (html) {
                        $(document.body).append(html);
                        setTimeout(function () {
                            lab_modal($("#selectFileFromDiskModal"), {
                                backdrop: "static"
                            });
                            $("#btn_select_add").click(function () {
                                var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                                var nodes = treeObj.getCheckedNodes(true);
                                if (nodes.length > 0) {
                                    $.each(nodes, function (key, value) {
                                        addUploadFile.call(elem, value);
                                    });
                                    $("#selectFileFromDiskModal").modal('hide').remove();
                                } else {
                                    if (!$('.mpic-notify-error').length) {
                                        lab_mgtNotification({
                                            message: "<i class='mpic-notify-error'></i>" + i18n.fileNoSelectd,
                                            type: 'error',
                                            position: "top-center",
                                            closable: false
                                        });
                                        return;
                                    }
                                }
                            });
                        });
                    });
                })

        }

        $.fn.mgtfileupload = function (o) {
            var result = oldupload.apply(this, arguments);
            var self = this;
            $(this).delegate("#att-upload-triangle-button", "click", function () {
                setTimeout(function () {
                    if (!$('.mgt_from_disk').length) {
                        $("#att-upload-dropdown-div").append($("<li></li>", {
                            html: '<span class="mgt_from_disk">' + i18n.fileSelectFormCent + '</span>',
                            click: function () {
                                uploadFromNetDrive(self);
                                $('#att-upload-dropdown-div').hide();
                            }
                        }));
                    }
                }, 0);
            });
            return result;
        }
    })(jQuery);
});