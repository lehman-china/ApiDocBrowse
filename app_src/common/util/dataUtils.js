/**
 * Created by Administrator on 2015/8/26.
 */
    //---------------------------------------------------
    // ���ڸ�ʽ��
    // ��ʽ YYYY/yyyy/YY/yy ��ʾ���
    // MM/M �·�
    // W/w ����
    // dd/DD/d/D ����
    // hh/HH/h/H ʱ��
    // mm/m ����
    // ss/SS/s/S ��
    //---------------------------------------------------
Date.prototype.format = function ( formatStr ) {
    formatStr = formatStr || "yyyy-MM-dd HH:mm:ss";
    var str = formatStr;
    var Week = [ '��', 'һ', '��', '��', '��', '��', '��' ];
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