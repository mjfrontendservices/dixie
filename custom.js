
let net = new brain.recurrent.LSTM();
let dixie = JSON.parse(localStorage.getItem("DIXIE"));
if (!dixie) {
    dixie = [];
}

let time = new Date();
let hour = time.getHours();
let indicator;

if (time.getHours() === 13) { hour = 1 }
if (time.getHours() === 14) { hour = 2 }
if (time.getHours() === 15) { hour = 3 }
if (time.getHours() === 16) { hour = 4 }
if (time.getHours() === 17) { hour = 5 }
if (time.getHours() === 18) { hour = 6 }
if (time.getHours() === 19) { hour = 7 }
if (time.getHours() === 20) { hour = 8 }
if (time.getHours() === 21) { hour = 9 }
if (time.getHours() === 22) { hour = 10 }
if (time.getHours() === 23) { hour = 11 }
if (time.getHours() === 0) { hour = 12 }

if (time.getHours() > 12) {
    indicator = "PM";
} else {
    indicator = "AM";
}

function output(trained, input, rawInput) {
    $.getJSON(trained, function (data) {
        // func
        training(net, data).then(function () {
            // if time
            if (prediction(net, input) === "time") {

                let conversationObject = {
                    id: Date.now(),
                    me: rawInput,
                    bot: `Time now is ${hour}:${time.getMinutes()}:${time.getSeconds()} ${indicator}`
                }

                if (dixie.length === 3) {
                    dixie.splice(0, 1);
                    dixie.push(conversationObject);
                    localStorage.setItem("DIXIE", JSON.stringify(dixie))
                    window.location.reload();
                } else {
                    dixie.push(conversationObject);
                    localStorage.setItem("DIXIE", JSON.stringify(dixie))
                    window.location.reload();
                }

                // if google
            } else if (prediction(net, input) === "Sure, opening google") {
                let conversationObject = {
                    id: Date.now(),
                    me: rawInput,
                    bot: prediction(net, input)
                }

                if (dixie.length === 3) {
                    dixie.splice(0, 1);
                    dixie.push(conversationObject);
                    localStorage.setItem("DIXIE", JSON.stringify(dixie))
                    window.open('https://google.com');
                } else {
                    dixie.push(conversationObject);
                    localStorage.setItem("DIXIE", JSON.stringify(dixie))
                    window.open('https://google.com');
                }

                // if youtube
            } else if (prediction(net, input) === "Sure, opening youtube") {
                let conversationObject = {
                    id: Date.now(),
                    me: rawInput,
                    bot: prediction(net, input)
                }

                if (dixie.length === 3) {
                    dixie.splice(0, 1);
                    dixie.push(conversationObject);
                    localStorage.setItem("DIXIE", JSON.stringify(dixie))
                    window.open('https://youtube.com');
                } else {
                    dixie.push(conversationObject);
                    localStorage.setItem("DIXIE", JSON.stringify(dixie))
                    window.open('https://youtube.com');
                }

                // if facebook
            } else if (prediction(net, input) === "Sure, opening facebook" || prediction(net, input) === "Sure, opening fb") {
                let conversationObject = {
                    id: Date.now(),
                    me: rawInput,
                    bot: prediction(net, input)
                }

                if (dixie.length === 3) {
                    dixie.splice(0, 1);
                    dixie.push(conversationObject);
                    localStorage.setItem("DIXIE", JSON.stringify(dixie))
                    window.open('https://facebook.com');
                } else {
                    dixie.push(conversationObject);
                    localStorage.setItem("DIXIE", JSON.stringify(dixie))
                    window.open('https://facebook.com');
                }

                // if dont know
            } else if (prediction(net, input) === "") {
                let conversationObject = {
                    id: Date.now(),
                    me: rawInput,
                    bot: "I don't know what you're talking about. Please make it short and clear."
                }

                if (dixie.length === 3) {
                    dixie.splice(0, 1);
                    dixie.push(conversationObject);
                    localStorage.setItem("DIXIE", JSON.stringify(dixie))
                    window.location.reload();
                } else {
                    dixie.push(conversationObject);
                    localStorage.setItem("DIXIE", JSON.stringify(dixie))
                    window.location.reload();
                }

                // if normal chat
            } else {
                let conversationObject = {
                    id: Date.now(),
                    me: rawInput,
                    bot: prediction(net, input)
                }

                if (dixie.length === 3) {
                    dixie.splice(0, 1);
                    dixie.push(conversationObject);
                    localStorage.setItem("DIXIE", JSON.stringify(dixie))
                    window.location.reload();
                } else {
                    dixie.push(conversationObject);
                    localStorage.setItem("DIXIE", JSON.stringify(dixie))
                    window.location.reload();
                }
            }
        });
    })
}

function training(network, trainingData) {
    return new Promise(function (resolve, reject) {
        network.fromJSON(trainingData);
        let error = false;
        !error ? resolve() : reject("Error loading the trained json file.");
    });
}

function prediction(network, input) {
    // array of pred
    const prediction = network.run(input);
    // array of pred (needed)
    const arrayOfPrediction = prediction.split('|');
    // length of the pred array
    const predictionNumberOfIndex = arrayOfPrediction.length;
    // random index based on the length
    const randomIndexGenerator = Math.floor(Math.random() * predictionNumberOfIndex);
    // random response
    const randomResponse = arrayOfPrediction[randomIndexGenerator];
    return randomResponse;
}

dixie.forEach(element => {
    $('.convos .container').append(`
            <div class="me">
                <div class="space"></div>
                <div class="txt">
                    <p>${element.me}</p>
                </div>
                </div>
            <div class="bot">
                <div class="img">
                    <img src="./logobig.png" alt="">
                </div>
                <div class="reply">
                    <p>${element.bot}</p>
                </div>
            </div>
        `)
});

$('.sendBtn').click(function () {
    const input = $('.convoTxt').val();
    const removeQuestion = input.replace('?', '',);
    const removeExclamation = removeQuestion.replace('!', '',);
    const removePeriod = removeExclamation.replace('.', '',);
    const finalData = removePeriod.replace("'", '',);

    // func
    output('./trained/trained.json', finalData.toLowerCase(), input);
    // console.log(finalData);

    $(this).hide();
    $('.loadBtn').show();
});
