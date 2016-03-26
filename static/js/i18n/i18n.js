define(function(){
    window.zh_CN = 'zh_CN' == 'zh_CN' ? true : false;
    window.i18n = {};
    // common4bootstrap.js
    i18n.loadingMsg = zh_CN ? "数据加载中，请稍候..." : "數據加載中，請稍候...";
    i18n.attention = zh_CN ? "关注" : "關注";
    i18n.attent_cancel = zh_CN ? "取消" : "取消";
    i18n.attent_cancelAttent = zh_CN ? "取消关注" : "取消關注";
    i18n.attent_common = zh_CN ? "一般关注" : "一般關注";
    i18n.attent_very = zh_CN ? "特别关注" : "特別關注";
    // jquery.bootstrap.pagination.js
    i18n.page = zh_CN ? "页" : "頁";
    i18n.pageSize = zh_CN ? "条" : "條";
    i18n.word = zh_CN ? "字" : "字";
    i18n.cell = zh_CN ? "个" : "個";
    i18n.noDefinedGroup = zh_CN ? "您还没有自定义组，请到客户端创建自定义组" : "您還沒有自定義組，請到客戶端創建自定義組";
    i18n.noDefinedENC = zh_CN ? "没有友好企业" : "沒有友好企業";
    // mgtfile.js
    i18n.fileNotEmpty = zh_CN ? "文件内容不能为空" : "文本內容不能為空";
    i18n.fileUploadFail = zh_CN ? "文件上传失败" : "文件上傳失敗";
    i18n.fileMaxSize = zh_CN ? "单个文件上传大小不能超过" : "單個文件上傳大小不能超過";
    i18n.fileExist = zh_CN ? "该文件已经存在了，请重新选择文件！" : "該文件已經存在了，請重新選擇文件！";
    i18n.fileMaxLength = zh_CN ? "文件名长度不能超过216字！" : "文件名長度不能超過216字！";
    i18n.fileLoseEfficacyNs = zh_CN ? "该文件失效,请" : "該文件失效，請";
    i18n.fileReSelect = zh_CN ? "重新选择" : "重新選擇";
    i18n.fileNoResult = zh_CN ? "没有文件！" : "沒有文件！";
    i18n.fileNoResultStart = zh_CN ? "没有找到与“" : "沒有找到與“";
    i18n.fileNoResultEnd = zh_CN ? "”相关的文件" : "”相關的文件";
    i18n.fileNoSelectd = zh_CN ? "您没有选择文件！" : "您沒有選擇文件！";
    i18n.fileOverLimitNum = zh_CN ? "超出可上传最大文件数！" : "超出可上传最大文件數！";
    i18n.fileOneExist = zh_CN ? "文件已经存在，请重新选择文件！" : "文件已經存在，請重新選擇文件！";
    i18n.filenoSupport = zh_CN ? "不支持的类型文件！" : "不支持的类型文件！";
    i18n.fileSelectFormSystem = zh_CN ? "从应用文档选择" : "從應用文檔選擇";
    i18n.fileSelectFormCent = zh_CN ? "从企业网盘选择" : "從企业网盘選擇";
    i18n.fileFormSystem = zh_CN ? "应用文档" : "應用文檔";
    i18n.fileFormCent = zh_CN ? "企业网盘" : "企业网盘";
    // editor.js
    i18n.noFreeSpace = zh_CN ? "云存储已经不足，请联系您的管理员。" : "雲存儲已經不足，請聯繫您的管理員。";
    i18n.commonUploadFile = zh_CN ? "上传附件" : "上傳附件";
    i18n.purchaseNow = zh_CN ? "立即扩容" : "立即擴容";
    // jingoalTree.js
    i18n.inputName = zh_CN ? "请输入姓名" : "請輸入姓名";
    i18n.noPerson = zh_CN ? "无合适人员" : "無合適人員";
    window.staticUrl = window.globalCp = '/module';
});
