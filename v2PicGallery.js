$(function() {
    /*==============================[Plugin for centering the Image to window]====================================*/
    $.fn.centerToWindow = function() {
        var obj = $(this);
        var obj_width = $(this).outerWidth(true);
        var window_width = window.innerWidth ? window.innerWidth : $(window).width();

        if($(window).width() < 1500){
            obj.css({
                "position": "relative",
                paddingRight: "30px",
                paddingLeft: "30px"              
            });
        }else{
            obj.css({
                marginLeft: ((window_width / 2) - (obj_width / 2)) + "px"
            });
        }
    }

    $('.PicGalleryOuterLayer').each(function() {
       //variables
        var InThisDiv = $(this).parent();   
        var OverLay = InThisDiv.find('.OverLay');
        var SmallImages = InThisDiv.find('.SmallImages');
        var ExpandImg = InThisDiv.find('.ExpandImg');
        var ImageDisplay = InThisDiv.find('.ImageDisplay');
        var AllowExpand = InThisDiv.find('.AllowExpand').val();
        var ThumbImg = InThisDiv.find('.ThumbImg');
        var CoverMainImgThumbs = InThisDiv.find('.CoverMainImgThumbs');
        var SmImageCounter = InThisDiv.find('.SmImageCounter');
        var ShowImageCount = InThisDiv.find('.ShowImageCount').val();
        var MoveImgLR = InThisDiv.find('.MoveNext, .MovePrev');
        var MoveImgSmall = InThisDiv.find('.MoveNextSmall, .MovePrevSmall');

        //adjust height/width of the large iframe
        var LargeImgHeight = InThisDiv.find('.LargeImgHeight').val();
        var LargeImgWidth = InThisDiv.find('.LargeImgWidth').val();
        var SmallImgHeight = InThisDiv.find('.SmallImgHeight').val();
        var SmallImgWidth = InThisDiv.find('.SmallImgWidth').val();
        var SmallImg = InThisDiv.find('.SmallImg');

     //On window resize  
        $(window).resize(function() {
            CoverMainImgThumbs.centerToWindow(); //center the main image on resize
            OverLay.css({ width: $(window).width() }); //OverLay takes the width/height of the window
        }); 

        ExpandImg.click(FnExpandImg);
        OverLay.click(OverLayWrapper);
        CoverMainImgThumbs.centerToWindow(); //Center the main image. 

        OverLay.css({ width: $(window).width() });  //OverLay takes the width/height of the window
        if(AllowExpand == 'true'){ ExpandImg.show();}  //AllowExpand
        ExpandImg.css({ marginLeft: SmallImages.width()+40 }); //Put the [+] sign on the top right corner of the image.    
        ThumbImg.css('opacity', '0.5'); //keep thumbnails faded
        CenterHorizontally(SmImageCounter, SmallImages); // Keep the Image Couner in the center of the Small Image
        CenterHorizontally((InThisDiv.find('.OverLay .ImageCounter')), CoverMainImgThumbs); // Keep the Image Couner in the center of the Expanded Image
        CenterVertically(MoveImgLR, CoverMainImgThumbs);
        CenterVertically (MoveImgSmall, SmallImages);

    //Show Image Count 
        if(ShowImageCount == 'true'){
            SmImageCounter.css({
                marginTop: SmallImgHeight
            }).show();
            InThisDiv.find('.OverLay .ImageCounter').show();
        }

        InThisDiv.find('.MoveNextSmall').css({
            marginLeft: SmallImages.width()+16
        });
    //keep the image counter in the center of small images
        function CenterHorizontally (counter, Div) {
            counter.css({
                marginLeft: ((Div.width()/2) - 40),
            });
        }
        function CenterVertically (navibtns, Image) {
            navibtns.css({
                marginTop: ((Image.height()/2)-25),
            });
        }
        ImageDisplay.mouseenter(function(){
            MoveImgLR.css('background-color', 'white');
        });
        ImageDisplay.mouseleave(function(){
            MoveImgLR.css('background-color', 'transparent');
        });

    //High-Light the chosen image
        function DisplayLargeImg(CurrentImgSrc){          
            ImageDisplay.find('iframe.MainImage').attr('src', CurrentImgSrc.attr('src'));
        }

    //count large and thumb Images
        function CountImage(SelectedImage){
            var TotalImages = ThumbImg.length;
            var CurrentImg = SelectedImage.index()+1;//integrated with thumbnails
            InThisDiv.find('.OverLay .ImageCounter').html("Image: "+CurrentImg+" of "+TotalImages);
            SmImageCounter.html("Image: "+CurrentImg+" of "+TotalImages);
        }

    //clicking on Thumbnails changes the main image
        ThumbImg.click(function(){
            HiliteSeletedImage($(this).attr('id'), $(this)); 
            CountImage($(this));
        });
        function HiliteSeletedImage(ThumbId, Thumb){ 
            var ObjID = InThisDiv.find('.SmallImages iframe[id*='+ThumbId+']');       
            DisplayLargeImg(ObjID);                    
            SmallImg.hide();
            ObjID.show(); //Show the same image as large and thumb displaying/highlighted
            ThumbImg.css('opacity', '0.5');//keep all thumbs faded
            Thumb.css('opacity', '1');  //Don't fade the clicked one.                     
        }

        function getNextPrevImg(NextBtn, PrevBtn) {
            var SmCount = SmallImg.length;
            var CurrentThumbImg;
            if(SmCount > 1){
                var CurrentImage = InThisDiv.find('.SmallImages iframe:visible');
                if(NextBtn){
                    var NextImage = (CurrentImage.next().length) ? CurrentImage.next() : InThisDiv.find('.SmallImages iframe').first();
                    NextImage.show();
                    CurrentThumbImg = NextImage;                    
                }else if(PrevBtn){
                    var PreviousImage = (CurrentImage.prev().length) ? CurrentImage.prev() : InThisDiv.find('.SmallImages iframe').last();
                    PreviousImage.show();
                    CurrentThumbImg = PreviousImage;
                }
                InThisDiv.find('.ThumbImg[id*='+CurrentThumbImg.attr("id")+']').trigger('click');
                DisplayLargeImg(CurrentThumbImg);
                CountImage(CurrentThumbImg);
                CurrentImage.hide();  
            }
        }
        //navigate through images
        InThisDiv.find('.MovePrev, .MovePrevSmall').click(function(){getNextPrevImg(0, $(this));});  //Move files back
        InThisDiv.find('.MoveNext, .MoveNextSmall').click(function(){getNextPrevImg($(this), 0);});  //Move ahead
/*
        $(SmallImages, ImageDisplay).click(SmallImgLeftRight);

        function SmallImgLeftRight(e) {
            var offset = $(this).offset();
            var XCoord = (e.pageX - offset.left);
            if (XCoord < ($(this).width() / 2)) {
                getPrev();
            } else {
                getNext();
            }
        }
*/
    //Clicking the Plus Sign    
        function FnExpandImg() {
            var VisibleImage = InThisDiv.find('.SmallImages iframe:visible'); //Trigger the visible image in small images
            InThisDiv.find('.ThumbImg[id*='+VisibleImage.attr("id")+']').trigger('click'); //Find the thumbnail of exact id and click it
            OverLay.show('slow'); //show the Overlay 
            ThumbImg.show('slow'); //Show the thumbnails
            ImageDisplay.width(parseInt(LargeImgWidth, 10)+32); //Overlay parent div, needs width to place the arrows(next/Prev) properly
        }

    //Close Overlay only if clicked on the black part
        function OverLayWrapper(e) {
            if (e.target === this) { //Only if click happens on the black part   
                $(this).hide('slow'); // hide Overlay
            }
        }
    });
});

//esc key hides OverLay
$( document ).on('keydown', function ( e ) {
    if ( e.keyCode === 27 ) {
        $('.OverLay').hide('slow');
    }
});

/*
        $('iframe').load(function(){
            var SmalliFrameImages = SmallImg.contents().find('img');
            SmalliFrameImages.css({
                'height': SmallImgHeight,
                'width': SmallImgWidth
            });
        }); 
        $.fn.hasFocus = function(){
            if(($this) == $(document.activeElement)){
                return true;
            }
            return false;
        }
        //navigate through images with left/right keys [not working properly, dropped the idea]
        $('body').keydown(function(e){
            if(e.which == $.ui.keyCode.LEFT) {getNextPrevImg(0, $(this));}//Go to back/previous file
            if(e.which == $.ui.keyCode.RIGHT) {getNextPrevImg($(this), 0);}//Go to next file
        });

        var ImageListArray = InThisDiv.find('.ArrayVal').val();
        var ImageLink = ImageListArray.split(',');

        $(ImageLink).each(function(index, el) {
            SmallImages.append("<iframe class='SmallImg' height= "+SmallImgHeight+" width ="+SmallImgWidth+" src =" + el + "></iframe>");
            var extension = el.substr( (el.lastIndexOf('.') +1) );
            switch(extension) {
                case 'pdf':
                    InThisDiv.find('.StoreInputs').append("<input type='hidden' class='pdfFileSrc' value= " + el + "/>");
                    InThisDiv.find('.ThumbNails').append("<img class='ThumbImg' height='80' width='100' src ='../../FlexNet/Styles/GOOGLE/Images/Portal/pdfIcon.png'/>");
                break;
                default:
                    InThisDiv.find('.ThumbNails').append("<img class='ThumbImg' height='80' width='100' src ="+el+"/>");
                break;
            }
        });
*/