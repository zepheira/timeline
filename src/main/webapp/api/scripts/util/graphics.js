/*==================================================
 *  Graphics Utility Functions and Constants
 *==================================================
 */

Timeline.Graphics = new Object();
Timeline.Graphics.pngIsTranslucent = !(Timeline.Platform.isIE && Timeline.Platform.isWin32);

Timeline.Graphics.createTranslucentImage = function(doc, url, verticalAlign) {
    var elmt;
    if (Timeline.Graphics.pngIsTranslucent) {
        elmt = doc.createElement("img");
        elmt.setAttribute("src", url);
    } else {
        elmt = doc.createElement("div");
        elmt.style.display = "inline";
        elmt.style.width = "1px";  // just so that IE will calculate the size property
        elmt.style.height = "1px";
        elmt.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + url +"', sizingMethod='image')";
    }
    elmt.style.verticalAlign = (verticalAlign != null) ? verticalAlign : "middle";
    return elmt;
};

Timeline.Graphics.setOpacity = function(elmt, opacity) {
    if (Timeline.Platform.isIE) {
        elmt.style.filter = "progid:DXImageTransform.Microsoft.Alpha(Style=0,Opacity=" + opacity + ")";
    } else {
        var o = (opacity / 100).toString();
        elmt.style.opacity = o;
        elmt.style.MozOpacity = o;
    }
};

Timeline.Graphics._bubbleMargins = {
    top:      33,
    bottom:   42,
    left:     33,
    right:    40
}
Timeline.Graphics._arrowOffsets = {
    top:      1,
    bottom:   9,
    left:     2,
    right:    8
}

Timeline.Graphics._bubblePointOffset = 6;
Timeline.Graphics._halfArrowWidth = 19;

Timeline.Graphics.createBubbleForPoint = function(doc, pageX, pageY, contentWidth, contentHeight) {
    var docWidth = doc.body.offsetWidth;
    var docHeight = doc.body.offsetHeight;
    
    var margins = Timeline.Graphics._bubbleMargins;
    var bubbleWidth = margins.left + contentWidth + margins.right;
    var bubbleHeight = margins.top + contentHeight + margins.bottom;
    
    var pngIsTranslucent = Timeline.Graphics.pngIsTranslucent;
    var urlPrefix = Timeline.urlPrefix;
    
    var setImg = function(elmt, url, width, height) {
        elmt.style.position = "absolute";
        elmt.style.width = width + "px";
        elmt.style.height = height + "px";
        if (pngIsTranslucent) {
            elmt.style.background = "url(" + url + ")";
        } else {
            elmt.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + url +"', sizingMethod='crop')";
        }
    }
    var div = doc.createElement("div");
    div.style.width = bubbleWidth + "px";
    div.style.height = bubbleHeight + "px";
    div.style.position = "absolute";
    div.style.zIndex = 100;
    div.style.border = "1px solid blue";
    
    var divInner = doc.createElement("div");
    divInner.style.width = "100%";
    divInner.style.height = "100%";
    divInner.style.position = "relative";
    div.appendChild(divInner);
    
    var createImg = function(url, left, top, width, height) {
        var divImg = doc.createElement("div");
        divImg.style.left = left + "px";
        divImg.style.top = top + "px";
        setImg(divImg, url, width, height);
        divInner.appendChild(divImg);
    }
    
    createImg(urlPrefix + "images/bubble-top-left.png", 0, 0, margins.left, margins.top);
    createImg(urlPrefix + "images/bubble-top.png", margins.left, 0, contentWidth, margins.top);
    createImg(urlPrefix + "images/bubble-top-right.png", margins.left + contentWidth, 0, margins.right, margins.top);
    
    createImg(urlPrefix + "images/bubble-left.png", 0, margins.top, margins.left, contentHeight);
    createImg(urlPrefix + "images/bubble-right.png", margins.left + contentWidth, margins.top, margins.right, contentHeight);
    
    createImg(urlPrefix + "images/bubble-bottom-left.png", 0, margins.top + contentHeight, margins.left, margins.bottom);
    createImg(urlPrefix + "images/bubble-bottom.png", margins.left, margins.top + contentHeight, contentWidth, margins.bottom);
    createImg(urlPrefix + "images/bubble-bottom-right.png", margins.left + contentWidth, margins.top + contentHeight, margins.right, margins.bottom);
    
    var divContent = doc.createElement("div");
    divContent.style.position = "absolute";
    divContent.style.left = margins.left + "px";
    divContent.style.top = margins.top + "px";
    divContent.style.width = contentWidth + "px";
    divContent.style.height = contentHeight + "px";
    divContent.style.overflow = "auto";
    divContent.style.background = "white";
    divInner.appendChild(divContent);
    
    (function() {
        if (pageX - Timeline.Graphics._halfArrowWidth - margins.left > 0 ||
            pageX + Timeline.Graphics._halfArrowWidth + margins.right < docWidth) {
            
            var left = Math.max(0, Math.min(docWidth - bubbleWidth,
                pageX - Math.round(contentWidth / 2) - margins.left));
                
            if (pageY - Timeline.Graphics._bubblePointOffset - bubbleHeight > 0) { // top
                var divImg = doc.createElement("div");
                
                divImg.style.left = (pageX - Timeline.Graphics._halfArrowWidth - left) + "px";
                divImg.style.top = (margins.top + contentHeight) + "px";
                setImg(divImg, urlPrefix + "images/bubble-bottom-arrow.png", 37, margins.bottom);
                divInner.appendChild(divImg);
                
                div.style.left = left + "px";
                div.style.top = (pageY - Timeline.Graphics._bubblePointOffset - bubbleHeight) + "px";
                
                return;
            } else if (pageY + Timeline.Graphics._bubblePointOffset + bubbleHeight < docHeight) { // bottom
                var divImg = doc.createElement("div");
                
                divImg.style.left = (pageX - Timeline.Graphics._halfArrowWidth - left) + "px";
                divImg.style.top = "0px";
                setImg(divImg, urlPrefix + "images/bubble-top-arrow.png", 37, margins.top);
                divInner.appendChild(divImg);
                
                div.style.left = left + "px";
                div.style.top = (pageY + Timeline.Graphics._bubblePointOffset) + "px";
                
                return;
            }
        }
        
        var top = Math.max(0, Math.min(docHeight - bubbleHeight,
            pageY - Math.round(contentHeight / 2) - margins.top));
                
        if (pageX + Timeline.Graphics._bubblePointOffset + bubbleWidth < docWidth) { // right
            var divImg = doc.createElement("div");
            
            divImg.style.left = "0px";
            divImg.style.top = (pageY - Timeline.Graphics._halfArrowWidth - top) + "px";
            setImg(divImg, urlPrefix + "images/bubble-left-arrow.png", margins.left, 37);
            divInner.appendChild(divImg);
            
            div.style.left = (pageX + Timeline.Graphics._bubblePointOffset) + "px";
            div.style.top = top + "px";
        } else { // left
            var divImg = doc.createElement("div");
            
            divImg.style.left = (margins.left + contentWidth) + "px";
            divImg.style.top = (pageY - Timeline.Graphics._halfArrowWidth - top) + "px";
            setImg(divImg, urlPrefix + "images/bubble-right-arrow.png", margins.right, 37);
            divInner.appendChild(divImg);
            
            div.style.left = (pageX - Timeline.Graphics._bubblePointOffset - bubbleWidth) + "px";
            div.style.top = top + "px";
        }
    })();
    
done:
    doc.body.appendChild(div);
};