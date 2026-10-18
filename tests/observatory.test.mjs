import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const match = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
  .find(m => m[1].includes('function benchmarkAll('));
assert.ok(match, 'The published page must contain its standalone simulation');
assert.doesNotThrow(() => new vm.Script(match[1]), 'The published inline script must parse');
const modelSource = match[1].split('const el = id =>')[0];
assert.ok(modelSource.includes('function benchmarkTopology'), 'Cannot find model boundary');
const sandbox = {};
vm.runInNewContext(modelSource + `
globalThis.api = { NODE_COUNT, TOPOLOGIES, edgesForTopology, createNetwork, advance,
  stepNetwork, activeGates, networkFeatures, makeSequence, ridgeFit,
  benchmarkTopology, benchmarkAll, MEMORY_PROTOCOL, downstreamRms, pulseReleaseTrial,
  memoryStats, summarizeMemoryTrials, runMemorySuite };
`, sandbox, { timeout: 1000 });
const M = sandbox.api;
const keys = ['tissue', 'star', 'chain', 'isolated', 'dense', 'nested'];

test('the published page keeps seven droplets and valid topology graphs', () => {
  assert.equal(M.NODE_COUNT, 7);
  assert.deepEqual(keys.map(k => M.edgesForTopology(k).length), [12, 6, 6, 0, 21, 12]);
  for (const key of keys) {
    const edges = M.edgesForTopology(key);
    assert.equal(new Set(edges.map(([a,b]) => a + ':' + b)).size, edges.length);
    for (const [a,b] of edges) assert.ok(a >= 0 && a < b && b < 7);
  }
});

test('isolation blocks stimulation of other droplets', () => {
  const isolated = M.createNetwork('isolated');
  const tissue = M.createNetwork('tissue');
  for (let t = 0; t < 150; t++) { M.advance(isolated, 0.75); M.advance(tissue, 0.75); }
  assert.equal(isolated.nodes[1].voltage, 0);
  assert.ok(Math.abs(tissue.nodes[1].voltage) > 0.01);
});

test('states and gates stay finite and bounded under sustained excitation', () => {
  const net = M.createNetwork('dense');
  for (let i = 0; i < 2000; i++) {
    M.stepNetwork(net, Math.sin(i * 0.051));
    assert.ok(net.nodes.every(n => Number.isFinite(n.voltage) && Math.abs(n.voltage) <= 6));
    assert.ok(net.edges.every(e => Number.isFinite(e.gate) && e.gate >= 0 && e.gate <= 1));
  }
});

test('seeded signals and held-out comparisons are deterministic', () => {
  const a = M.makeSequence(100, 369), b = M.makeSequence(100, 369);
  assert.deepEqual([...a], [...b]);
  assert.notDeepEqual([...a], [...M.makeSequence(100, 370)]);
  assert.equal(M.networkFeatures(M.createNetwork('tissue')).length, 16);
  const x = M.benchmarkTopology('tissue');
  const y = M.benchmarkTopology('tissue');
  assert.deepEqual(JSON.parse(JSON.stringify(x)), JSON.parse(JSON.stringify(y)));
  assert.ok(Number.isFinite(x.nrmse));
  assert.equal(x.target.length, 180);
  assert.equal(M.benchmarkAll().length, 6);
});

test('readout recovers a simple linear function', () => {
  const w = M.ridgeFit([[1,0],[1,1],[1,2],[1,3]],[2,5,8,11],0);
  assert.ok(Math.abs(w[0] - 2) < 0.0001);
  assert.ok(Math.abs(w[1] - 3) < 0.0001);
});

test('published page includes accurate scientific qualification and citations', () => {
  assert.match(html, /not an experimentally validated physical replica/i);
  assert.match(html, /not proof of Nested Bubble Gear/i);
  assert.match(html, /10\.1126\/sciadv\.aed0971/);
  assert.match(html, /AQUAΦ/);
});

test('AquaMemory isolated control never reaches downstream droplets', () => {
  const trial = M.pulseReleaseTrial('isolated');
  assert.equal(trial.edges, 0);
  assert.equal(trial.detected, false);
  assert.equal(trial.censored, false);
  assert.equal(trial.peak, 0);
  assert.equal(trial.releaseArea, 0);
  assert.equal(trial.halfDecaySteps, null);
  assert.equal(trial.pulse.length, M.MEMORY_PROTOCOL.pulseSteps);
  assert.equal(trial.release.length, M.MEMORY_PROTOCOL.releaseSteps);
});

test('pulse-and-release protocol measures finite propagation and source-off decay', () => {
  for (const topology of ['tissue','star','chain','dense','nested']) {
    const result = M.pulseReleaseTrial(topology);
    assert.ok(Number.isFinite(result.peak) && result.peak >= 0);
    assert.ok(Number.isFinite(result.releaseArea) && result.releaseArea >= 0);
    assert.ok(Number.isFinite(result.at20));
    assert.ok(result.release.some(v => v > 0), topology);
    assert.ok(result.release.every(v => Number.isFinite(v)), topology);
    if (result.halfDecaySteps !== null) {
      assert.ok(result.detected);
      assert.ok(result.halfDecaySteps > 0 && result.halfDecaySteps < result.release.length);
    }
  }
});

test('suite is deterministic across the same matched seeds and changes with new seeds', () => {
  const a = M.runMemorySuite(), b = M.runMemorySuite(), c = M.runMemorySuite({seedStart:370});
  assert.deepEqual(JSON.parse(JSON.stringify(a)), JSON.parse(JSON.stringify(b)));
  assert.notEqual(a.results[0].releaseArea.mean, c.results[0].releaseArea.mean);
  assert.equal(a.results.length, 6);
  assert.equal(a.protocol.trials, 12);
  for (const r of a.results) {
    assert.equal(r.trials, 12);
    assert.equal(r.perTrial.length, 12);
    assert.equal(r.example.pulse.length, 36);
    assert.equal(r.example.release.length, 120);
    assert.ok(r.reachCount >= 0 && r.reachCount <= 12);
    assert.equal(r.halfDecaySteps.n + r.censoredCount, r.reachCount);
    assert.ok(Number.isFinite(r.releaseArea.mean) && Number.isFinite(r.releaseArea.sd));
  }
  assert.equal(a.results.find(r => r.topology==='tissue').edges,
    a.results.find(r => r.topology==='nested').edges);
});

test('undetectable responses and right-censoring are not called infinite memory', () => {
  const suite = M.runMemorySuite();
  const isolated = suite.results.find(r => r.topology === 'isolated');
  assert.equal(isolated.halfDecaySteps.n, 0);
  assert.equal(isolated.halfDecaySteps.mean, null);
  assert.equal(isolated.reachCount, 0);
  const censored = M.pulseReleaseTrial('tissue', { releaseSteps:20, detectionFloor:1e-8 });
  assert.ok(censored.halfDecaySteps === null || Number.isInteger(censored.halfDecaySteps));
  assert.throws(() => M.pulseReleaseTrial('tissue', { releaseSteps:19 }));
  assert.throws(() => M.runMemorySuite({trials:1}));
});

test('v0.2 page offers accessible visualizations and evidence export', () => {
  for (const id of ['memory','memoryBtn','memoryRows','memoryPlot','memoryCurve',
    'memoryStatus','memoryExportBtn','memoryTraceNote']) {
    assert.ok(html.includes('id="' + id + '"'), 'Missing ' + id);
  }
  assert.match(html, /AquaMemory-PULSE-RELEASE-0\.2/);
  assert.match(html, /MODEL v0\.2\.0/);
  assert.match(html, /not confidence intervals/i);
  assert.match(html, /aquaphi-memory-receipt-v0\.2\.json/);
});
