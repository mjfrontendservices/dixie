let net = new brain.recurrent.LSTM();
/**
 * LOCAL STORAGES ===========================================================================
 * 
 */
let dixie = JSON.parse(localStorage.getItem("DIXIE"));
let dixieTask = JSON.parse(localStorage.getItem("DIXIE_TASK_MANAGEMENT"));
let taskTemporaryID = localStorage.getItem("DIXIE_TASK_TEMPORARY_ID");
let taskEdit = JSON.parse(localStorage.getItem("DIXIE_TASK_EDIT"));

if (!taskEdit) { taskEdit = {}; }
if (!dixieTask) { dixieTask = []; }
if (!dixie) { dixie = []; }
/**
 * TIME AND DATE FOR CHAT ===========================================================================
 * 
 */
let time = new Date();
let hour = time.getHours();
let indicator;

if (time.getHours() === 13) { hour = "01" }
if (time.getHours() === 14) { hour = "02" }
if (time.getHours() === 15) { hour = "03" }
if (time.getHours() === 16) { hour = "04" }
if (time.getHours() === 17) { hour = "05" }
if (time.getHours() === 18) { hour = "06" }
if (time.getHours() === 19) { hour = "07" }
if (time.getHours() === 20) { hour = "08" }
if (time.getHours() === 21) { hour = "09" }
if (time.getHours() === 22) { hour = "10" }
if (time.getHours() === 23) { hour = "11" }
if (time.getHours() === 0) { hour = "12" }

time.getHours() > 12 ? indicator = "PM" : indicator = "AM";
/**
 * MAIN FUNCTION FOR INSERTING CHAT ======================================================================
 * 
 */
function output(trained, input, rawInput) {
    $.getJSON(trained, function (data) {
        training(net, data).then(function () {
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
            } else if (prediction(net, input) === "Sure, opening google...") {
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
            } else if (prediction(net, input) === "Sure, opening youtube...") {
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
            } else if (prediction(net, input) === "Sure, opening facebook..." || prediction(net, input) === "Sure, opening fb...") {
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

                // if task
            } else if (prediction(net, input) === "Okay sir please input your task here, and I will handle the rest.") {
                let conversationObject = {
                    id: Date.now(),
                    me: rawInput,
                    bot: prediction(net, input)
                }

                if (dixie.length === 3) {
                    dixie.splice(0, 1);
                    dixie.push(conversationObject);
                    localStorage.setItem("DIXIE", JSON.stringify(dixie))
                    // if task only
                    localStorage.setItem("DIXIE_TASK_TEMPORARY_ID", conversationObject.id)
                    window.location.reload();
                } else {
                    dixie.push(conversationObject);
                    localStorage.setItem("DIXIE", JSON.stringify(dixie))
                    // if task only
                    localStorage.setItem("DIXIE_TASK_TEMPORARY_ID", conversationObject.id)
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
/**
 * FOR LOADING MODEL ===========================================================================
 * 
 */
function training(network, trainingData) {
    return new Promise(function (resolve, reject) {
        network.fromJSON(trainingData);
        let error = false;
        !error ? resolve() : reject("Error loading the trained json file.");
    });
}
/**
 * FOR INPUT AND PREDICTION ===========================================================================
 * 
 */
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
/**
 * MAIN CHATBOT AUTOLOADS ===========================================================================
 * 
 */
let maxTask = dixieTask.length;

dixie.forEach(element => {
    // if task ask for input
    if (element.bot === "Okay sir please input your task here, and I will handle the rest.") {
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
                    <div class="inputTask">
                        <b>Task details:</b><br><br>
                        <b class="errorTask"></b><br>
                        <input type="text" class="task" placeholder="Task Name..."><br>
                        <input type="date" class="date"><br>
                        <input type="time" class="time"><br>
                        <button class="addTask"><i class="fa fa-plus"></i> Add Task</button>
                    </div>
                </div>
            </div>
        `);
    } else if (element.bot === "tasks...") {
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
                    <p>
                        Here are your task record. Click the 'More Action' button if you want to remove, or edit something.<br><br>
                        <span class="taskRecords"></span>
                        <button class="actions" data-toggle="modal" data-target="#moreAction"><i class="fa fa-bars"></i> More Action</button>
                    </p>
                </div>
            </div>
        `);
    } else {
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
        `);
    }
});

let chatTaskCounter = 0;

dixieTask.forEach(element => {
    chatTaskCounter++;
    $('.taskRecords').append(`
        ${chatTaskCounter}. ${element.task} at ${element.time} on ${element.date}<br>
    `);
});
/**
 * MODAL AUTOLOADS ===========================================================================
 * 
 */
let taskCounter = 0

dixieTask.forEach(element => {
    taskCounter++;
    $('.allTasks').append(`
        <p>
            <b>${taskCounter}. ${element.task} at ${element.time} on ${element.date}</b><br>
            <button class="btn btn-info edit" data-id="${element.id}" data-task="${element.task}" data-toggle="modal" data-target="#task${element.id}"><i class="fa fa-edit"></i> Edit</button>
            <button data-id="${element.id}" class="btn btn-danger remove"><i class="fa fa-trash"></i> Remove</button>
        </p><br>
    `);

});

$('.allTaskCounter').text(taskCounter);

$('.edit').click(function () {
    let id = $(this).attr('data-id');
    let task = $(this).attr('data-task');
    let obj = {
        id: id,
        task: task
    }

    taskEdit = obj
    localStorage.setItem("DIXIE_TASK_EDIT", JSON.stringify(taskEdit));
    window.location.href = './edit.html';
})

$('.remove').click(function () {
    let removeID = $(this).attr('data-id');
    let removeTaskIndex = dixieTask.findIndex(x => x.id === parseInt(removeID));
    dixieTask.splice(removeTaskIndex, 1);
    localStorage.setItem("DIXIE_TASK_MANAGEMENT", JSON.stringify(dixieTask));
    window.location.reload();
});
/**
 * EDIT PAGE AUTOLOADS ===========================================================================
 * 
 */
$('.editSection .container').html(`
    <b>Edit Task Name</b>
    <input type="text" class="edittable" placeholder="Edit..." value="${taskEdit.task}"><br>
    <button data-id="${taskEdit.id}" class="save btn btn-info"><i class="fa fa-check"></i> Save</button>
    <a href="index.html">
        <button class="cancel btn btn-danger"><i class="fa fa-times"></i> Cancel</button>
    </a><br><br>
    <div class="msg"></div>
`);

$('.save').click(function () {
    let id = $(this).attr('data-id');
    let edditedTask = $('.edittable').val();
    let taskIndex = dixieTask.findIndex(x => x.id === parseInt(id));
    if (edditedTask != "") {
        // update -----------------------------------------
        dixieTask[taskIndex].task = edditedTask;
        localStorage.setItem("DIXIE_TASK_MANAGEMENT", JSON.stringify(dixieTask));
        // remove temporary data from edit ----------------------------------
        taskEdit = {};
        localStorage.setItem("DIXIE_TASK_EDIT", JSON.stringify(taskEdit));
        $('.msg').html(`<p><b class="alert alert-success"><i class="fa fa-check"></i> Updated Successfully!</b></p>`);
        window.location.href = './index.html';
    } else {
        $('.msg').html(`<p><b class="alert alert-danger"><i class="fa fa-times"></i> Please enter complete details!</b></p>`);
    }
})
/**
 * SEND CHAT BTN EXECUTE ALL ===========================================================================
 * 
 */
$('.sendBtn').click(function () {
    const input = $('.convoTxt').val();
    const removeQuestion = input.replace('?', '',);
    const removeExclamation = removeQuestion.replace('!', '',);
    const removePeriod = removeExclamation.replace('.', '',);
    const finalData = removePeriod.replace("'", '',);
    // main ------------------------------------------------------------
    output('./trained/trained.json', finalData.toLowerCase(), input);
    $(this).hide();
    $('.loadBtn').show();
});
/**
 * ADD TASKS ===========================================================================
 * 
 */
$('.addTask').click(function () {
    // TIME PROCESSED -----------------------------------------
    let time = $('.time').val();
    let date = $('.date').val();

    let timeSplit = time.split(":");

    let hour = timeSplit[0];
    let minute = timeSplit[1];
    let hourNew = new Date().getHours().toString();
    let indicator;

    if (hour === "13") { hourNew = "01" }
    if (hour === "14") { hourNew = "02" }
    if (hour === "15") { hourNew = "03" }
    if (hour === "16") { hourNew = "04" }
    if (hour === "17") { hourNew = "05" }
    if (hour === "18") { hourNew = "06" }
    if (hour === "19") { hourNew = "07" }
    if (hour === "20") { hourNew = "08" }
    if (hour === "21") { hourNew = "09" }
    if (hour === "22") { hourNew = "10" }
    if (hour === "23") { hourNew = "11" }
    if (hour === "0") { hourNew = "12" }

    hour > 12 ? indicator = "PM" : indicator = "AM";
    // DATE PROCESSED ---------------------------------------
    let dateArray = date.split("-");
    let month;

    if (dateArray[1] === "01") { month = "January" }
    if (dateArray[1] === "02") { month = "Febuary" }
    if (dateArray[1] === "03") { month = "March" }
    if (dateArray[1] === "04") { month = "April" }
    if (dateArray[1] === "05") { month = "May" }
    if (dateArray[1] === "06") { month = "June" }
    if (dateArray[1] === "07") { month = "July" }
    if (dateArray[1] === "08") { month = "August" }
    if (dateArray[1] === "09") { month = "September" }
    if (dateArray[1] === "10") { month = "October" }
    if (dateArray[1] === "11") { month = "November" }
    if (dateArray[1] === "12") { month = "December" }

    let processedTime = `${hourNew}:${minute} ${indicator}`;
    let processedDate = `${month} ${dateArray[2]}, ${dateArray[0]}`;

    let taskObject = {
        id: Date.now(),
        task: $('.task').val(),
        time: processedTime,
        date: processedDate
    };

    if (taskObject.task === "" || taskObject.time === "undefined:undefined AM" || taskObject.date === "undefined undefined, ") {
        $('.errorTask').text("Please complete the task inputs.");
    } else {
        dixieTask.push(taskObject);
        // insert to task management ----------------------------------------------------
        localStorage.setItem("DIXIE_TASK_MANAGEMENT", JSON.stringify(dixieTask));
        // get chat bot id and change the chat bot text to thanks... --------------------------------
        let chatBotIdTask = localStorage.getItem("DIXIE_TASK_TEMPORARY_ID");
        let dixieConvoIndex = dixie.findIndex(x => x.id === parseInt(chatBotIdTask));
        dixie[dixieConvoIndex].bot = "Okay sir, your task now has been added.";
        // storages -----------------------------------------------------
        localStorage.setItem("DIXIE", JSON.stringify(dixie));
        localStorage.setItem("DIXIE_TASK_TEMPORARY_ID", "");
        $('.inputTask').hide();

        window.location.reload();
    }
});