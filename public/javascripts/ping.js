submit = document.getElementById('submit');
host = document.getElementById('host');
output = document.getElementById('output');

submit.onclick = async function() {
    let url = `/api/ping?host=${host.value}`;
    let response = await fetch(url, {method: 'POST'});
    let result = await response.json();

    output.innerHTML = result;
}