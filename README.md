[![NPM](https://img.shields.io/npm/v/@voxextractlabs/vox-whisper?label=npm)](https://www.npmjs.com/package/@voxextractlabs/vox-whisper)
[![License](https://img.shields.io/npm/l/@voxextractlabs/vox-whisper)](./LICENSE)
[![Build Status](https://github.com/VoxExtract-Labs/vox-whisper/actions/workflows/pr-check.yml/badge.svg)](https://github.com/VoxExtract-Labs/vox-whisper/actions/workflows/pr-check.yml)
[![codecov](https://codecov.io/gh/VoxExtract-Labs/vox-whisper/graph/badge.svg?token=BIYV66POTD)](https://codecov.io/gh/VoxExtract-Labs/vox-whisper)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/3c68d4afd088475a8fde5b00277cec2f)](https://app.codacy.com/gh/VoxExtract-Labs/vox-whisper/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Bundlephobia](https://img.shields.io/bundlephobia/minzip/@voxextractlabs/vox-whisper)](https://bundlephobia.com/package/@voxextractlabs/vox-whisper)

# @voxextractlabs/vox-whisper

## Project Summary and Key Features

- **Fast Transcription:** A lightweight wrapper around the Faster-Whisper Docker CLI.
- **Cross-Platform:** Designed to work with Node.js and Bun.
- **Configurable:** Supports CPU and GPU inference along with various runtime options.
- **Modern Tooling:** Integrates Biome, conventional commits, lefthook, and more.

## Installation

Install the package via npm:

```sh
npm install vox-whisper
```

## Usage Example

```ts
import { Whisper } from 'vox-whisper';

const whisper = new Whisper({
    input: 'path/to/audio.wav',       // Path to your input audio file
    out: 'output-folder',             // Output directory for transcriptions
    device: 'cpu',                    // Inference device: 'cpu' or 'cuda'
    dockerImage: 'voxextractlabs/vox-whisper:latest' // Docker image (can be customized)
});

whisper.run().then(result => {
    console.log('Transcription result:', result);
});
```

## Configuration Details

- **input:** Path to the audio file.
- **out:** Output directory.
- **device:** 'cpu' or 'cuda' for inference.
- **dockerImage:** Custom Docker image tag if needed.

## Contribution Guidelines

Contributions are welcome! Please follow the [Conventional Commits](https://www.conventionalcommits.org/) guidelines and run pre-commit hooks via Lefthook. For more details, see the CONTRIBUTING guide.

## License and Acknowledgments

Licensed under the MIT License.  
Special thanks to the contributors and the open-source community for their invaluable support.
