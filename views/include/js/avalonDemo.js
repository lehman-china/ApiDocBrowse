require( [ "avalon", "commonUtil" ], function () {
    console.log( avalon )

    var avalonDemoCtrl = avalon.define( {
        $id: "avalonDemoCtrl",
        //**************************
        isShow: true,
        msShowHide: function () {
            avalonDemoCtrl.isShow = !avalonDemoCtrl.isShow;
        },

        //****************************
        time: new Date().getTime(),
        num: 808,

        //****************************
        //*******************************sql 查询
        keyWord: "",
        products: [],
        query: function () {
            var sql = "select * from product where name like '%" + avalonDemoCtrl.keyWord + "%' or sn like '%" + avalonDemoCtrl.keyWord + "%' LIMIT 0,30";
            avalonDemoCtrl.products = Util.query( sql );
        }
    } );
    // 时间走动
    setInterval( function () {
        avalonDemoCtrl.time = new Date().getTime();
    }, 1000 );

    // require加载器,加载后 扫描dom 编译一下
    avalon.scan();
} );

