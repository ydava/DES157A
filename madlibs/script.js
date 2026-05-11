(function () {
    "use strict";

    console.log("reading js");

    const madlibQuestions = document.querySelector("#madlib-questions");
    const madlib = document.querySelector("#madlib");
    const madlibOverlay = document.querySelector("#madlib-overlay");
    const closeBtn = document.querySelector("#close");
    const errorMessage = document.querySelector("#error");

    madlibQuestions.addEventListener("submit", function (event) {
        event.preventDefault();

        const adjective1 = document.querySelector("#adjective1").value;
        const verb1 = document.querySelector("#verb1").value;
        const noun = document.querySelector("#noun").value;
        const adjective2 = document.querySelector("#adjective2").value;
        const verb2 = document.querySelector("#verb2").value;

        let myText = "";

        if (adjective1 === "") {
            errorMessage.textContent = "Please provide an adjective";
            document.querySelector("#adjective1").focus();
            return;
        }

        if (verb1 === "") {
            errorMessage.textContent = "Please provide a verb";
            document.querySelector("#verb1").focus();
            return;
        }

        if (noun === "") {
            errorMessage.textContent = "Please provide a noun";
            document.querySelector("#noun").focus();
            return;
        }

        if (adjective2 === "") {
            errorMessage.textContent = "Please provide an adjective";
            document.querySelector("#adjective2").focus();
            return;
        }

        if (verb2 === "") {
            errorMessage.textContent = "Please provide a verb";
            document.querySelector("#verb2").focus();
            return;
        }

        errorMessage.textContent = "";

        myText = `
            <p>
                On a cold and <span>${adjective1}</span> night, a lonely vampire began to <span>${verb1}</span> through the empty castle halls. 
                Clutched tightly in their hands was a cursed <span>${noun}</span> that whispered strange secrets every midnight.

                As thunder echoed outside, the vampire continued to <span>${verb1}</span> deeper into the shadows while a flock of 
                <span>${adjective2}</span> ravens circled above. Suddenly, the cursed <span>${noun}</span> started glowing dark red, 
                causing the castle doors to <span>${verb2}</span> on their own.

                The vampire placed the <span>${noun}</span> onto an ancient altar and watched the candles <span>${verb2}</span> violently 
                as a pair of <span>${adjective2}</span> eyes slowly opened in the darkness...
            </p>
        `;

        madlib.innerHTML = "<h2>Spooky MadLibs</h2>" + myText;

        madlibOverlay.style.display = "block";

        document.querySelector("form").reset();
    });

    closeBtn.addEventListener("click", function (event) {
        event.preventDefault();
        madlibOverlay.style.display = "none";
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            madlibOverlay.style.display = "none";
        }
    });

})();