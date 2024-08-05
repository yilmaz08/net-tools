submit = document.getElementById('submit');
ip = document.getElementById('ip');
output = document.getElementById('output');

submit.onclick = async function() {
    let url = `/api/rdns?ip=${ip.value}`;
    let response = await fetch(url, {method: 'POST'});
    let result = await response.json();
    
    output.innerHTML = "";
    for (let r in result) {
        let li = document.createElement('li');
        li.innerHTML = `${result[r]}`;
        output.appendChild(li);
    }
}