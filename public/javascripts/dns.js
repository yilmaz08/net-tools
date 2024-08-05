submit = document.getElementById('submit');
domain = document.getElementById('domain');
types = document.getElementById('types');
output = document.getElementById('output');

submit.onclick = async function() {
    let url = `/api/dns?domain=${domain.value}&types=${types.value}`;
    let response = await fetch(url, {method: 'POST'});
    let result = await response.json();
    
    output.innerHTML = "";
    for (let r in result) {
        let li = document.createElement('li');
        li.innerHTML = `${r}: ${JSON.stringify(result[r])}`;
        output.appendChild(li);
    }
}