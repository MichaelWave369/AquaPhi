# AquaΦ | AquaPhi

**Where Matter Meets Memory.**

AquaPhi is an independent, open-source experimental **water-droplet-inspired computing sandbox**. The v0.2 Wetware Observatory is a free, self-contained webpage that explores how topology and nonlinear connections affect the fading memory of a simulated seven-node aqueous network.

> **Scientific status:** Original **toy / phenomenological simulation**. It is NOT a reproduction of the laboratory hardware, not a calibrated electrochemical solver, not proof of Nested Bubble Gear (NBG), and not a demonstration of a working water computer.

## Live lab

GitHub Pages: **https://michaelwave369.github.io/AquaPhi/** (GitHub Actions deployment from `main`). New features appear after their pull requests merge and Pages deploys.

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
- Run **AquaMemory v0.2**: drive D0 with a seeded pulse, turn the source off, measure how much signal remains in other droplets, inspect topology traces and export a second JSON receipt.

## Frozen comparison, v0.1

The same seeded signal (`369`) drives D0 of every seven-droplet network. States are integrated with the same toy equations and parameter settings. A **16-feature** linear ridge readout predicts the input from **five samples earlier** using a chronological split: 100 warmup, 340 train, 180 held-out test. Scores are normalized RMSE (lower is better) and R². All six candidate networks use the same task and readout. See `index.html` for the implementation and exact parameters.

**Limitations:** No parameter calibration, uncertainty intervals, repeated random seeds, or equal-edge-count control across all graphs. The nested motif is a graph hypothesis, not an implementation or test of any NBG theorem. Do not interpret scores as measurements of real water droplets.

## AquaMemory v0.2: Pulse & Release

This is a second, separate protocol from the v0.1 readout benchmark.

- **Stimulated droplet:** D0 only. **Observed state:** RMS of simulated D1–D6 voltages, explicitly excluding the source.
- **Inputs:** 36 consecutive positive pulse samples (`0.68 + 0.38 * seededRandom(seed)`) followed by **exactly zero input** for 120 samples.
- **Common seeds:** integers 369–380 (12 matched input traces for each of six topologies). Same physics slider settings for every graph.
- **Detection:** post-release peak downstream RMS must reach at least **0.02 arbitrary units**. An isolated topology with no links is a negative control and must report **NO REACH**.
- **Response area:** sum of downstream RMS across all 120 post-release samples. The dashboard reports mean ± **sample standard deviation** across the 12 seeded inputs; these are *not* confidence intervals.
- **Half-decay:** number of samples *after the post-release peak* until downstream RMS drops to half that peak. If a response is not detectable, half-decay is not defined; if detected but not halved within the observation window, it is **right-censored**, not infinite memory. Summary half-decay uses **only uncensored, detectable trials**.
- **Fairer comparison:** Cell tissue and Nested motif both have exactly **12 membranes**. Other architectures are shown descriptively; the six-way comparison is not a matched-edge-count experiment.
- **Plot:** clicking a topology shows the seed-369 trajectory during stimulation and after cut-off. The plot is illustrative; the table aggregates all 12 trials.
- **Reproducibility:** the exported receipt includes the full frozen protocol, simulator parameters, every seed's scalar results, and one representative 156-point trace per topology.

**Interpretation limits:** These tests demonstrate behavior of one arbitrary, deterministic, phenomenological computational model. Repeating altered random inputs does not make twelve independent physical experiments. Membrane parameters were not calibrated; a longer response is not necessarily better prediction, and no real-world lifetime, confidence level, or independent NBG verification can be inferred. Do not market it as hardware wetware.

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

AquaMesh (additional equal-edge-count controls and held-out network tasks), AquaLedger (versioned reproducibility evidence and provenance), calibration against openly published physical datasets if available, and carefully labeled NBG-related hypotheses.

**License:** MIT. Ledger above ego.
