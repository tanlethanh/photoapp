const inputUsername = document.getElementById('inputUsername');
const inputPassword = document.getElementById('inputPassword');
const confirmPassword = document.getElementById('inputPasswordConfirm');
let countSuccess = 0;
// const submitButton = document.getElementById('submitButton');

// username
inputUsername.onchange = function (event) {
    const currentInput = event.target.value;
    const inputBox = document.getElementById('usernameDetails');

    if (checkUsername(currentInput)) {
        inputBox.innerText = 'approved';
        countSuccess++;
        console.log(countSuccess);
        name();
    } else {
        inputBox.innerText = 'username must start with a letter and contain at least 3 characters';
    }

    function checkUsername (usernameInput) {
        let accepted = false;
        const firstletter = /^[A-Za-z]/;

        if ((usernameInput.match(firstletter)) && (String(usernameInput).length >= 3)) {
            console.log('username approved');
            accepted = true;
        } else if ((usernameInput.match(firstletter)) && (String(usernameInput).length < 3)) {
            console.log('username does not contain at least 3 characters');
        } else if ((!usernameInput.match(firstletter)) && (String(usernameInput).length >= 3)) {
            console.log('username does not begin with a letter');
        } else {
            console.log('username does not contain at least 3 characters');
            console.log('username does not begin with a letter');
        }
        return accepted;
    }
};

// password
inputPassword.onchange = function (event) {
    const currentInput = event.target.value;
    const inputBox = document.getElementById('passwordDetails');

    if (userpasswordInputFunc(currentInput)) {
        inputBox.innerText = 'approved';
        countSuccess++;
        console.log(countSuccess);
    } else {
        inputBox.innerText = 'password must contain all of the following: at least 8 characters, an upper case, a number, and a special character ( / * - + ! @ # $ ^ & * ).';
    }

    function userpasswordInputFunc (userpassword) {
        let accept = false;
        let character = '';
        let checkUpperCase = false;
        let checkNumber = false;
        let checkSpecialCharacter = false;

        if (String(userpassword).length > 8) {
            for (let i = 0; i < String(userpassword).length; i++) {
                character = String(userpassword).charAt(i);
                if (character == character.toUpperCase()) {
                    checkUpperCase++;
                }
                if (/^-?\d+$/.test(character)) {
                    checkNumber++;
                }

                function containsSpecialCharacters (str) {
                    const regex = /[(/*-+!@#$^&*).]/g;
                    return regex.test(str);
                }

                if (containsSpecialCharacters(userpassword)) {
                    checkSpecialCharacter = true;
                }
            }
            if (checkUpperCase) {
                if (checkNumber) {
                    if (checkSpecialCharacter) {
                        console.log('password approved');
                        accept = true;
                    } else {
                        console.log('password does not contain a special character');
                    }
                } else {
                    console.log('password does not contain a number');
                }
            } else {
                console.log('password does not contain an uppercase');
            }
        } else {
            console.log('password is not at least 8 characters.');
        }
        return accept;
    }
};

// confirm password
confirmPassword.onchange = function (event) {
    const currentInput = event.target.value;
    const inputBox = document.getElementById('confirmPasswordDetails');

    if (inputPassword.value == currentInput) {
        console.log('password confirmation approved');
        inputBox.innerText = 'approved';
        countSuccess++;
        name();
        console.log(countSuccess);
    } else {
        inputBox.innerText = 'password does not match';
    }
};

// eslint-disable-next-line no-unused-vars
function toLoginPage () {
    if (countSuccess == 3) {
        window.location = 'login.html';
    } else {
        alert('One or more errors exist. Try Again');
    }
}
