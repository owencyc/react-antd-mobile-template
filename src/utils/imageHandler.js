

export function compress(url,callback,quality=0.6){
    var img = new Image();
    img.src = url;
    img.onload = function () {
        var that = this;
        //var ext = name.substring(name.lastIndexOf(".") + 1).toLowerCase();
        // 默认按比例压缩
        var w = that.width,
            h = that.height,
            scale = w / h;
        w = w;
        h =  (w / scale);
        //生成canvas
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        // 创建属性节点
        var anw = document.createAttribute("width");
        anw.nodeValue = w;
        var anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(that, 0, 0, w, h);
        // 图像质量
        // quality值越小，所绘制出的图像越模糊
        //console.log("tup", ext)
        var base64 = canvas.toDataURL('image/jpeg', quality);
        
        callback(base64);
    }
}