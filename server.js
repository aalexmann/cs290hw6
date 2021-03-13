var url = 'http://flip3.engr.oregonstate.edu:9090/';

function onLoad() {
    var req = new XMLHttpRequest();
    req.open('GET', url + 'table', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function () {
        if (req.status >= 200 && req.status < 400) {
            var response = JSON.parse(req.response);
            exercises(response);
        } else {
            console.log('An Error Occurred! '+ req.statusText);
        }
    });
    req.send(null);
}

onLoad();
document.querySelector('#submit').addEventListener('click', function (event) {
    var req = new XMLHttpRequest();
    var rows = {};
    rows.name = document.querySelector('#name-ent').value;
    rows.reps = document.querySelector('#reps-ent').value;
    rows.weight = document.querySelector('#weight-ent').value;
    rows.date = document.querySelector('#date-ent').value;
    rows.unit = document.querySelector('[name = units]:checked').id;
    req.open('POST', url + 'insert', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function () {
        if (req.status >= 200 && req.status < 400) {
            var response = JSON.parse(req.response);
            exercises(response);
        } else {
            console.log('Oops! Something went wrong!' + req.statusText);
        }
    });
    req.send(JSON.stringify(rows));
    

});

document.querySelector('#submitEdit').addEventListener('click', function (event) {
    if (document.querySelector('#name-ent').value != "") {
        var req = new XMLHttpRequest();
        var rows = {};

        rows.id = document.querySelector('#key').value;
        rows.name = document.querySelector('#name-ent').value;
        rows.reps = document.querySelector('#reps-ent').value;
        rows.weight = document.querySelector('#weight-ent').value;
        rows.date = document.querySelector('#date-ent').value;
        rows.unit = document.querySelector('[name = units]:checked').id;
        req.open('POST', url + 'safe-update', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load', function () {
            if (req.status >= 200 && req.status < 400) {
                var response = JSON.parse(req.response);
                exercises(response);
            } else {
                console.log('Something went wrong! ' + req.statusText);
            }
        });
        req.send(JSON.stringify(rows));
    } else {
        alert('Please check to make sure nothing is missing.')
    }
}
);
function deleteWorkout(id) {
    var req = new XMLHttpRequest();
    var rows = {};
    rows.id = id;
    req.open('POST', url + 'delete', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function () {
        if (req.status >= 200 && req.status < 400) {
            var response = JSON.parse(req.response);
            exercises(response);
        } else {
            console.log('Uh oh, Something whent wrong!' + req.statusText);
        }
    });
    req.send(JSON.stringify(rows));
};

function exercises(response) {
    var table = document.querySelector('#table');
    while (table.hasChildNodes()) {
        table.removeChild(table.firstChild);
    }
    var col = [];
    for (var i = 0; i < response.length; i++) {
        for (var key in response[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }

    var tr = table.insertRow(-1);
    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");
        if (i == 0) {
            th.innerHTML = col[i];
            tr.appendChild(th);
            th.setAttribute('hidden', true);
        }
        th.innerHTML = col[i];
        tr.appendChild(th);
    }
    for (var i = 0; i < response.length; i++) {
        tr = table.insertRow(-1);
        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            if (j == 0) {
                tabCell.innerHTML = response[i][col[j]];
                tabCell.setAttribute('name', Object.keys(response[i])[j]);
                tabCell.setAttribute('hidden', true);
            }
        }
        //appending deleter and edit buttons
        var deleter = document.createElement('input');
        var edit = document.createElement('input');
        deleter.type = 'button';
        edit.type = 'button';
        deleter.value = 'delete';
        edit.value = 'edit';
        deleter.className = 'deleteButton';
        edit.className = 'editButton';
        deleter.name = response[i].id;
        edit.name = response[i].id;
        tr.appendChild(deleter);
        tr.appendChild(edit);
    }
    var deleterButtons = document.querySelectorAll('.deleteButton');
    var editButtons = document.querySelectorAll('.editButton');
    delPost(delButtons);
    editPost(editButtons);
}
function delPost(del) {
    for (var i = 0; i < del.length; i++) {
        del[i].addEventListener('click', function (event) {
            var req = new XMLHttpRequest();
            var rows = {};
            rows.id = this.name
            req.open('POST', url + 'delete', true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.addEventListener('load', function () {
                if (req.status >= 200 && req.status < 400) {
                    var response = JSON.parse(req.response);
                    exercises(response);
                } else {
                    console.log(`Network error: ${req.statusText}`);
                }
            });
            req.send(JSON.stringify(rows));
        }
        );
    }
}
function editPost(edit) {
    for (var i = 0; i < edit.length; i++) {
        edit[i].addEventListener('click', function (event) {
            var req = new XMLHttpRequest();
            var rows = {};
            rows.id = this.name
            req.open('POST', url + 'select', true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.addEventListener('load', function () {
                if (req.status >= 200 && req.status < 400) {
                    var response = JSON.parse(req.response);
                    document.querySelector('#SUBMIT').hidden = true;
                    document.querySelector('#submitEdit').hidden = false;
                    document.querySelector(`[name="${rows.id}"]`).hidden = true;
                    document.querySelector('#key').value = response[0].id;
                    document.querySelector('#name-ent').value = response[0].name;
                    document.querySelector('#reps-ent').value = response[0].reps;
                    document.querySelector('#weight-ent').value = response[0].weight;
                    document.querySelector('[name= units ]:checked').value = response[0].unit;
                } else {
                    console.log(`Network error: ${req.statusText}`);
                }
            });
            req.send(JSON.stringify(rows));
        }
        );
    }
}