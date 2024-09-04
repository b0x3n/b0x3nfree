///////////////////////////////////////////////////////////
//  FrinkBASIC/src/LoadScript.js                         //
///////////////////////////////////////////////////////////
//
//
//


    export const LoadScript = (
        base,
        path,
        script_name,
        callback
    ) => {

        const   __xhr = new XMLHttpRequest();

        __xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                callback(this.responseText);
            }
        };

        __xhr.open("GET", `${base}${path}${script_name}`, true);
        __xhr.send();

    };

