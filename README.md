# AquaΦ | AquaPhi

**Where Matter Meets Memory.**

AquaPhi is an independent, open-source experimental **water-droplet-inspired computing sandbox**. The v0.1 Wetware Observatory is a free, self-contained webpage that explores how topology and nonlinear connections affect the fading memory of a simulated seven-node aqueous network.

> **Scientific status:** Original **toy / phenomenological simulation**. It is NOT a reproduction of the laboratory hardware, not a calibrated electrochemical solver, not proof of Nested Bubble Gear (NBG), and not a demonstration of a working water computer.

## Live lab

GitHub Pages: **https://michaelwave369.github.io/AquaPhi/** (available after this PR is merged and Pages publishes from `main` / repository root).

Open `index.html` directly in a browser. No dependencies, backend, paid services, telemetry, or build system. Optional Google Fonts are the only remote appearance resource and have local fallbacks.

## Enable GitHub Pages (one-time)

The repository includes `.github/workflows/pages.yml` to publish the standalone page. In **Settings → Pages → Build and deployment**, select **Source: GitHub Actions**. This setting is essential: passing the `Verify AquaPhi` test does **not** publish a site.

After the deployment workflow succeeds on `main`, open https://michaelwave369.github.io/AquaPhi/ . If publication is still pending, check **Actions → Publish AquaPhi to GitHub Pages** for any configuration or permissions errors. The deploy can also be retriggered from **Actions → Publish AquaPhi to GitHub Pages → Run workflow**.

## Explore

- Seven virtual droplets and six graph topologies: tissue, hub-and-spoke, chain, isolated, dense and exploratory nested motif.
- Live normalized electrical states, nonlinear membrane conduction gates and oscilloscope.
- Adjustable coupling, leak and gate threshold; selectable input waveform.
- Pause, step and reset the experiment.
- Compare topology performance with a deterministic, held-out delayed-input prediction benchmark, then export a JSON receipt.

## Frozen comparison, v0.1

The same seeded signal (`369`) drives D0 of every seven-droplet network. States are integrated with the same toy equations and parameter settings. A **16-feature** linear ridge readout predicts the input from **five samples earlier** using a chronological split: 100 warmup, 340 train, 180 held-out test. Scores are normalized RMSE (lower is better) and R². All six candidate networks use the same task and readout. See `index.html` for the implementation and exact parameters.

**Limitations:** No parameter calibration, uncertainty intervals, repeated random seeds, or equal-edge-count control across all graphs. The nested motif is a graph hypothesis, not an implementation or test of any NBG theorem. Do not interpret scores as measurements of real water droplets.

## Verify locally

Node.js 18+:

```bash
npm test
```

The tests extract and execute the **same model code embedded in the published page**, so that a standalone deploy doesn't silently diverge from its tested physics.

## Research inspiration

Armendarez, N. X., Mohamed, A. S., Hasan, M. S., & Najem, J. S. (2026). *Neuromorphic tissues: Soft biomolecular networks for brain-inspired temporal computing*. **Science Advances**, 12(30), eaed0971. [DOI: 10.1126/sciadv.aed0971](https://doi.org/10.1126/sciadv.aed0971).

This project is independently written; no third-party research code or experimental datasets are incorporated. Reference is acknowledgment, not endorsement.

## Future experiments

AquaMemory (repeat-seed tests, confidence intervals), AquaMesh (connectivity-controlled comparisons), AquaLedger (signed reproducibility receipts), and eventual carefully labeled NBG-related hypotheses.

**License:** MIT. Ledger above ego.
