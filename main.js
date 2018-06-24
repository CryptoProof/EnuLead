getProducers();

function filterProds () {
    var search = document.getElementById('filter-prods').value;
    document.querySelectorAll('.prod-row').forEach(function (row) {
        if (search === "")
            row.style.display = "table-row";
        else if (row.childNodes[3].textContent.indexOf(search) > -1)
            row.style.display = "table-row";
        else
            row.style.display = "none";
    });
}

function getEos() {
    var network = document.getElementById('network').value;
    var ip = network.slice(network.lastIndexOf("/") + 1, network.lastIndexOf(":"));
    var port = network.slice(network.lastIndexOf(":") + 1);
    var config = {
        keyProvider: '',
        httpEndpoint: network,
        broadcast: false,
        sign: false,
        chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f",
        expireInSeconds: 30
    }
    return Eos(config);
}

function getProducers() {
    var eos = getEos();
    var params = {
        json: true,
        scope: "enumivo",
        code: "enumivo",
        table: "producers", 
        limit: 10000
    }
    var tbody = document.querySelector("#block-producers tbody");
    tbody.innerHTML = '';

    return eos.getTableRows(params).then(resp => {
        var sorted = resp.rows.sort((a,b) => Number(a.total_votes) > Number(b.total_votes) ? -1:1);
        sorted.map((prod, index) => `<tr class="prod-row">
		
            <td>${index+1}</td>
			<td>${upStatus(prod.is_active)}</td>
            <td>${prod.owner}</td>
            <td>${prettyNumber(prod.total_votes)}</td>
			<td>${prod.unpaid_blocks}</td>
			<td>${timeConverter(prod.last_claim_time)}</td>
			<td>${prod.location}</td>
			<td><a href="${prod.url}" target="_blank">${prod.url}</a></td>
        </tr>`)
        .forEach(row => tbody.innerHTML += row);
    });

}


function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp/1000);
  return a.toLocaleString();
}

function upStatus(num) {
	return num == 1 ? "UP" : "DOWN";
}

function prettyNumber(num) {
    num = parseInt(parseInt(num) / 1e10 * 2.8);
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
