submit = document.getElementById('submit');
host = document.getElementById('host');
output = document.getElementById('output');

submit.onclick = async function() {
    let url = `/api/traceroute?host=${host.value}`;
    let response = await fetch(url, {method: 'POST'});
    let result = await response.json();
    
    output.innerHTML = "";
    for (let r in result) {
        let li = document.createElement('li');
        li.innerHTML = `${JSON.stringify(result[r])}`;
        output.appendChild(li);
    }
}