$(function(){
  $('.OuterLayer').each(function(){
    var InThisDiv = $(this).parent();
    var RunOnClick = null;//SetTimeOut to wait for mouse hold
    var RunOnHold = null;//SetInterval to accelerate
//==========Get the class of the hidden textbox from PB
    var ThisDiv = $(this).closest('.SubOperation')//outputvalue div
    var LastChild = ThisDiv.find('div.VerticalLayout:nth-child(2)');//last-child which contains the submit button
    var Display = LastChild.find('.Text_DisplayOutput');
    var DisableTextbox = InThisDiv.find('.DisableTextbox');
//======Class value variables==============
    var ChangeSize = (parseInt(InThisDiv.find('.ChangeSize').val()) + 'px');//To change the height and width of the [+], [-] signs
    var AllowCycle = InThisDiv.find('.AllowCycle').val();// Get the value of AllowCyle input from PB
    var AllowAccelerate = InThisDiv.find('.AllowAccelerate').val();//Get the Allow accelerate value from PB
    var NumTitle = InThisDiv.find('.NumericTitle').val();
    var TextBoxWidth = InThisDiv.find('.TextBoxWidth').val();
    var UserInput = (parseFloat(Display.val(), 10)).toFixed(2);
    var Max = parseFloat(InThisDiv.find('.maxVal').val(), 10);
    var Min = parseFloat(InThisDiv.find('.minVal').val(), 10);
    var Interval = (parseFloat(InThisDiv.find('.Interval').val(), 10)).toFixed(2);
    KeepTwoDigitValue();
    FieldsetPosition();
//==========CSS
    InThisDiv.find('.Size').css({
      width: ChangeSize,
      height: ChangeSize
    });
    Display.css({
      height: (parseInt(ChangeSize, 10) - 6),
      width: TextBoxWidth,
      'font-size': (parseInt(ChangeSize, 10) - 5),
    });
//Disable the text box from accepting any values from the user
    if ((DisableTextbox.val()) == 'true'){
      Display.prop('disabled',true);
      Display.css("opacity", "0.9");         
    }
    InThisDiv.find('.plusBtn').css({
      marginLeft: parseInt(TextBoxWidth , 10)
    });
    function FieldsetPosition(){
      var isChrome = !!window.chrome;
//Fieldset is hidden
      if(NumTitle == ''){
        InThisDiv.find('fieldset').css({
          'border': '0',
          paddingBottom: '5px'
        });
        if(isChrome){
          Display.css({
            marginTop: -(parseInt(ChangeSize, 10) + 10),
            marginLeft: (parseInt(ChangeSize, 10) + 10)
          });
        }else{
          Display.css({
            marginTop: -(parseInt(ChangeSize, 10) + 11),
            marginLeft: (parseInt(ChangeSize, 10) + 10)
          });
        }
      }else{
        if(isChrome){
          Display.css({
            marginTop: -(parseInt(ChangeSize, 10) + 27),
            marginLeft: (parseInt(ChangeSize, 10) + 12)
          });
        }else{
          Display.css({
            marginTop: -(parseInt(ChangeSize, 10) + 28),
            marginLeft: (parseInt(ChangeSize, 10) + 12)
          });
        }
      }
    }
        //Check if the value entered is an Integer
        function isInt(n) {return n % 1 === 0;}
        //put extra zeros after decimal if it becomes an integer
        function FormatPlaceholders() {
            var UserInput = Display.val();
            var FormattedString = UserInput.toString();
            if (!isInt(Interval)) {
                if (FormattedString.indexOf('.') == -1)
                    FormattedString += '.';
                while (FormattedString.length < FormattedString.indexOf('.') + 3)
                    FormattedString += '0';
                Display.val(FormattedString);
            }
        }
        //On press of a button Keep all input values to 2 decimal places
        function KeepTwoDigitValue() {
            FormatPlaceholders();
            if (Display.val().indexOf('.') != -1) {
                if (Display.val().split(".")[1].length > 2) {
                    if (isNaN(parseFloat(Display.val())))
                        return;
                    Display.val(parseFloat(Display.val()).toFixed(2))
                }
            }
        }
        //=================[DECREMENT ON MINUS BTN]
        function CalculateAndDisplayValues_forMinus() {

            var UserInput = (parseFloat(Display.val(), 10)).toFixed(2);
            var Max = parseFloat(InThisDiv.find('.maxVal').val(), 10);
            var Min = parseFloat(InThisDiv.find('.minVal').val(), 10);
            var Interval = (parseFloat(InThisDiv.find('.Interval').val(), 10)).toFixed(2);
            var ModuleVal = (UserInput % Interval).toFixed(2);
            var Decrement = (UserInput - Interval);     
            if (AllowCycle == 'true') {         
                if ((ModuleVal > 0) && (Decrement >= Min)) {
                    Display.val(UserInput - ModuleVal);
                }else if (!isNaN(Decrement) && (Decrement >= Min && Decrement <= Max)) { // If is not undefined 
                    Display.val(Decrement);
                } else {
                    Display.val(Max);//put Max Otherwise
                }
            } else {
                if ((ModuleVal > 0) && (Decrement >= Min))  {
                    Display.val(UserInput - ModuleVal);
                } else if (!isNaN(Decrement) && (Decrement >= Min && Decrement <= Max)) { // If it isn't undefined or its greater than 0
                    Display.val(Decrement);//Decrement one
                } else {
                    Display.val(Min);//put Min Otherwise
                    clearInterval(RunOnHold);
                }
            }
        }
        //========================[INCREMENT ON PLUS BTN]
        function CalculateAndDisplayValues_forPlus() {
            var UserInput = (parseFloat(Display.val(), 10));//.toFixed(2);
            var Max = parseFloat(InThisDiv.find('.maxVal').val(), 10);
            var Min = parseFloat(InThisDiv.find('.minVal').val(), 10);
            var Interval = (parseFloat(InThisDiv.find('.Interval').val(), 10));//.toFixed(2);
            var Increment = ((UserInput + Interval));
            var ModuleVal = (UserInput % Interval);//.toFixed(2);

            if (AllowCycle == 'true') {
                if((ModuleVal > 0) && (Increment <= Max) && (!isInt(Interval))){                   
                    Display.val(Increment);//Increment
                }else if ((ModuleVal > 0) && (Increment <= Max)) {                  
                    Display.val((UserInput - ModuleVal) + (Interval));
                    // If UserInput is not undefined and as long as Increment is between min and max keep incrementing.
               } else if (!isNaN(Increment) && (Increment >= Min && Increment <= Max)) {
                    Display.val(Increment);//Increment
                } else {
                    Display.val(Min);//put Min Otherwise
                }
            } else {
                
                if (UserInput < Min) {
                    Display.val(Min);//put Min Otherwise
                //Increment only if (entered value + interval) is >= Min and <= Max 
                } else  if((ModuleVal > 0) && (Increment <= Max) && (!isInt(Interval))){
                    Display.val(Increment);//Increment
                }else if ((ModuleVal > 0) && (Increment <= Max)) {                  
                    Display.val((UserInput - ModuleVal) + Interval);
                } else if (!isNaN(Increment) && (Increment >= Min && Increment <= Max)) { // If is not undefined 
                    Display.val(Increment);//Increment
                //if the entered value in the text box is less than the defined minimum put minimum value 
                } else {
                    Display.val(Max);//put Max Otherwise
                    clearInterval(RunOnHold); //and stop it there since a cycle is not allowed.
                }
            }
        }
        //=======================[PLUS BUTTON INCREMENT STARTS]     
        InThisDiv.find('.plusBtn').mousedown(function(e) { //Increment the value  
            e.preventDefault(); // Stop acting like a button
            CalculateAndDisplayValues_forPlus();
            KeepTwoDigitValue();
            if (AllowAccelerate == 'true') {
                RunOnClick = setTimeout(function() {
                    RunOnHold = setInterval(function() {
                        CalculateAndDisplayValues_forPlus();
                        KeepTwoDigitValue();
                    }, 25);
                }, 500);
            }
        }).on('mouseup', function() {
            clearTimeout(RunOnClick);
            clearInterval(RunOnHold);
        });
        //=======================[MINUS BUTTON DECREAMENT STARTS]        
        InThisDiv.find('.minusBtn').mousedown(function(e) { //decrement the value till 0
            e.preventDefault(); // Stop acting like a button
            CalculateAndDisplayValues_forMinus();
            KeepTwoDigitValue();
            if (AllowAccelerate == 'true') {
                RunOnClick = setTimeout(function() {
                    RunOnHold = setInterval(function() {
                        CalculateAndDisplayValues_forMinus();
                        KeepTwoDigitValue();
                    }, 25);
                }, 500);
            }
        }).on('mouseup', function() {
            clearTimeout(RunOnClick);
            clearInterval(RunOnHold);
        }); 
        var ShowKeyboard = InThisDiv.find('.AllowKeyboard').val();
        //Open up virtual keyboard
        if(ShowKeyboard == 'true'){
            Display.virtualKeyboard({
                'type': 'numpad',
            });
        }
    });
    window.addEventListener("contextmenu", function(e) { e.preventDefault(); });
});