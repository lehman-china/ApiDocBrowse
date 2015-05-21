    /**
     * 获得base64
     * @param {Object} obj
     * @param {Number} [obj.width] 图片需要压缩的宽度，高度会跟随调整
     * @param {Function} obj.success(obj) 处理后函数
     */
    $.fn.localResizeIMG = function(obj) {
        this.on('change', function() {
            var file = this.files[0];
            var URL = window.URL || window.webkitURL;
            var blob = URL.createObjectURL(file);


            _create(blob, file);
            this.value = ''; // 清空临时数据
        });

        /**
         * 生成base64
         * @param blob 通过file获得的二进制
         */
        function _create(blob) {
            var img = new Image();
            img.src = blob;
            img.onload = function() {
                var that = this;
                //生成比例
                var w = that.width,
                    h = that.height,
                    scale = w / h;
                w = obj.width || w;
                h = w / scale;

                //生成canvas
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                $(canvas).attr({
                    width: w,
                    height: h
                });
                ctx.drawImage(that, 0, 0, w, h);

                /**
                 * 生成base64
                 * 兼容修复移动设备需要引入mobileBUGFix.js
                 */
                var base64 = canvas.toDataURL('image/jpeg');
                // 执行后函数
                obj.success(base64);
            };
        }
    };


    // 例子
    /*
    $('input:file').localResizeIMG({
        width: 100,
        success: function (result) {
            var img = new Image();
            img.src = result.base64;
            $('body').append(img);
            console.log(result);
        }
    });
*/