var express = require('express');
var router = express.Router();
const net = require('net');
const dns = require('dns');
const Traceroute = require('nodejs-traceroute');

function check_port(host, port, timeout) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let isOpen = false;

    if (isNaN(port)) { return false; }

    socket.setTimeout(timeout);

    socket.on('connect', () => { isOpen = true; socket.destroy(); });
    socket.on('timeout', () => { isOpen = false; socket.destroy(); });
    socket.on('error', (err) => { isOpen = false; socket.destroy(); });

    socket.on('close', () => { resolve(isOpen); });

    socket.connect(port, host);
  });
}
function dns_lookup(domain, type) {
  return new Promise((resolve) => {
    dns.resolve(domain, type, (err, addresses) => {
      if (err) {
        if (err.code === 'ENOTFOUND' || err.code === "ENODATA") { resolve([]); }
        else { resolve(err); }
      }
      else { resolve(addresses); }
    });
  });
}
function rdns_lookup(ip) {
  return new Promise((resolve) => {
    dns.reverse(ip, (err, hostnames) => {
      if (err) { resolve([]); }
      else { resolve(hostnames); }
    });
  });
}
function traceroute(host) {
  return new Promise((resolve) => {
    let hops = [];

    const tracer = new Traceroute();
    tracer
      .on('hop', (hop) => { hops.push(hop); })
      .on('close', () => { resolve(hops); });

    tracer.trace(host);
  });
}

// --- ROUTES ---

// Open Port Check
router.post('/port', async function(req, res) {
  let port = req.query.port;
  let host = req.query.host;
  if (!port) { res.status(400).json({message: 'Port is required'}); return; }
  if (!host) { res.status(400).json({message: 'Host is required'}); return; }

  results = {};

  let ports = port.split(',').map(p => parseInt(p)); // split ports and convert to int
  ports = ports.filter((p, i) => ports.indexOf(p) === i); // remove duplicates

  let portChecks = ports.map(async (p) => { 
    try { results[p] = await check_port(host, p, 1000); }
    catch (err) { results[p] = false; }
  });

  await Promise.all(portChecks);

  console.log(results);
  res.json(results);
});

// DNS lookup
router.post('/dns', async function(req, res) {
  let domain = req.query.domain;
  let types = req.query.types;
  if (!domain) { res.status(400).json({message: 'Domain is required'}); return; }
  if (!types) { types = "A,AAAA,CNAME,TXT,MX"; }

  let typesArr = types.split(',').map(t => t.toUpperCase());
  results = {};

  let dnsChecks = typesArr.map(async (t) => {
    try { results[t] = await dns_lookup(domain, t); }
    catch (err) { results[t] = []; }
  });

  await Promise.all(dnsChecks);

  console.log(results);
  res.json(results);
});

// Reverse DNS lookup
router.post('/rdns', async function(req, res) {
  let ip = req.query.ip;
  if (!ip) { res.status(400).json({message: 'IP is required'}); return; }

  try { result = await rdns_lookup(ip); }
  catch { result = null; }

  res.json(result);
});

// Traceroute
router.post('/traceroute', async function(req, res) {
  let host = req.query.host;
  if (!host) { res.status(400).json({message: 'Host is required'}); return; }

  try { result = await traceroute(host); }
  catch { result = null; }

  res.json(result);
});

module.exports = router;
