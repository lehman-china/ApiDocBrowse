/**
 * Created by Administrator on 2015/8/26.
 */
    //---------------------------------------------------
    // 日期格式化
    // 格式 YYYY/yyyy/YY/yy 表示年份
    // MM/M 月份
    // W/w 星期
    // dd/DD/d/D 日期
    // hh/HH/h/H 时间
    // mm/m 分钟
    // ss/SS/s/S 秒
    //---------------------------------------------------
Date.prototype.format = function ( formatStr ) {
    formatStr = formatStr || "yyyy-MM-dd HH:mm:ss";
    var str = formatStr;
    var Week = [ '日', '一', '二', '三', '四', '五', '六' ];
    var month = this.getMonth() + 1;
    str = str.replace( /yyyy|YYYY/, this.getFullYear() );
    str = str.replace( /MM/, month > 9 ? month + '' : '0' + month );
    str = str.replace( /w|W/g, Week[ this.getDay() ] );
    str = str.replace( /dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate() );
    str = str.replace( /hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours() );
    str = str.replace( /mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes() );
    str = str.replace( /ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds() );
    return str;
};