submit = document.getElementById('submit');
port = document.getElementById('port');
host = document.getElementById('host');
output = document.getElementById('output');

submit.onclick = async function() {
    let url = `/api/port?port=${port.value}&host=${host.value}`;
    let response = await fetch(url, {method: 'POST'});
    let result = await response.json();
    
    output.innerHTML = '';
    for (let p in result) {
        let li = document.createElement('li');
        li.innerHTML = `${p}: ${result[p] ? 'open' : 'closed'}`;
        output.appendChild(li);
    }
}