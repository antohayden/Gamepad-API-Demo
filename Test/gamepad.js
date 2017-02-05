var gamepad = (

    function () {

        var start;
        var interval;
        var buttonCount = 17;
        var container = document.getElementById("controllerContainer");
        var currentJoystickPosition = {};

        //hardcoding pixel positions of analog sticks
        var leftJoyX = 328;
        var rightJoyX = 588;
        var leftJoyY = 353;
        var rightJoyY = 353;
        var joyStickMultiplier = 50;

        window.addEventListener("gamepadconnected", function (e) {
            console.log("Connected");
            gameLoop();
        });

        window.addEventListener("gamepaddisconnected", function (e) {
            console.log("disconnected");
            cancelRequestAnimationFrame(start);
        });

        if (!('ongamepadconnected' in window)) {
            // No gamepad events available, poll instead.
            interval = setInterval(pollGamepads, 50);
        }

        function pollGamepads() {
            var gamepads = navigator.getGamepads();

            for (var i = 0; i < gamepads.length; i++) {
                var gp = gamepads[i];
                if (gp) {
                    gameLoop();
                    clearInterval(interval);
                }
            }
        }

        function buttonPressed(b) {
            if (typeof (b) == "object") {
                return b.pressed;
            }
            return b == 1.0;
        }

        function getJoystickPosition(gp, toFixed){

            if(toFixed){
                return {
                    left: {
                        X: gp.axes[0].toFixed(toFixed),
                        Y: gp.axes[1].toFixed(toFixed)
                    },
                    right: {
                        X: gp.axes[2].toFixed(toFixed),
                        Y: gp.axes[3].toFixed(toFixed)
                    }
                };
            }

            if(gp)
                return {
                        left: {
                            X: gp.axes[0],
                            Y: gp.axes[1]
                        },
                        right: {
                            X: gp.axes[2],
                            Y: gp.axes[3]
                        }
                    };

            else
                return null;
        }

        //Checks whether either joystick has moved since last update
        function checkJoyStickPositions(gp){

            //gather the positions of the joysticks on the controller
            var axes = getJoystickPosition(gp, 2);

            //Compare objects to see if there was any change since last update
            //left stick comparison
            if(JSON.stringify(currentJoystickPosition.left) !== JSON.stringify(axes.left)){

                if (container.querySelector('.leftStick') === null) {
                    var d = document.createElement("div");
                    d.className = 'stickPointer leftStick';
                    d.style.left = (leftJoyX + (axes.left.X * joyStickMultiplier)).toString() + "px";
                    d.style.top = (leftJoyY + (axes.left.Y * joyStickMultiplier)).toString() + "px";
                    container.appendChild(d);
                }
                else {
                    var d = container.querySelector('.leftStick');
                    d.style.opacity = 1;
                    d.style.left = (leftJoyX + (axes.left.X * joyStickMultiplier)).toString() + "px";
                    d.style.top = (leftJoyY + (axes.left.Y * joyStickMultiplier)).toString() + "px";
                }

                currentJoystickPosition.left = axes.left;
            }
            else{
                var d = container.querySelector('.leftStick');
                if(d.style.opacity > 0)
                    d.style.opacity -= 0.01;
            }

            //same for right stick
            if(JSON.stringify(currentJoystickPosition.right) !== JSON.stringify(axes.right)){

                if (container.querySelector('.rightStick') === null) {
                    var d = document.createElement("div");
                    d.className = 'stickPointer rightStick';
                    d.style.left = (rightJoyX + (axes.right.X * joyStickMultiplier)).toString() + "px";
                    d.style.top = (rightJoyY + (axes.right.Y * joyStickMultiplier)).toString() + "px";
                    container.appendChild(d);
                }
                else {
                    var d = container.querySelector('.rightStick');
                    d.style.opacity = 1;
                    d.style.left = (rightJoyX + (axes.right.X * joyStickMultiplier)).toString() + "px";
                    d.style.top = (rightJoyY + (axes.right.Y * joyStickMultiplier)).toString() + "px";
                }

                currentJoystickPosition.right = axes.right;
            }
            else{
                var d = container.querySelector('.rightStick');
                if(d.style.opacity > 0)
                    d.style.opacity -= 0.01;
            }
        }

        function gameLoop() {

            var gamepads = navigator.getGamepads();

            var gp = gamepads[0];

            checkJoyStickPositions(gp);

            // Each loop check for pressed buttons
            // If so, create an element with classname relating to button pressed
            // If not pressed remove class of the same same if they exist
            // Doing it this way due to animation restrictions
            for (var i = 0; i < buttonCount; i++) {

                if (buttonPressed(gp.buttons[i])) {

                    if (container.querySelector('.button' + i) === null) {
                        var d = document.createElement("div");
                        d.className = 'positionPointer button' + i;
                        container.appendChild(d);
                    }
                }
                else {
                    var child = container.querySelector('.button' + i);
                    if (child !== null) {
                        container.removeChild(child);
                    }
                }
            }

            start = requestAnimationFrame(gameLoop);
        }
    }()
);
